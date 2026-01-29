use axum::{
    extract::{Query, State},
    http::StatusCode,
    routing::{delete, get, put},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::db::AppState;

#[derive(Deserialize)]
pub struct CreateNote {
    title: String,
    content: String,
}

#[derive(Deserialize)]
pub struct UpdateNote {
    id: i64,
    title: String,
    content: String,
}

#[derive(Deserialize)]
pub struct DeleteNote {
    id: i64,
}

#[derive(Deserialize)]
pub struct TogglePin {
    id: i64,
}

#[derive(Deserialize)]
pub struct SearchQuery {
    q: Option<String>,
}

#[derive(Serialize)]
pub struct NoteResponse {
    id: i64,
    title: String,
    content: String,
    pinned: bool,
    created_at: i64,
}

// CREATE
async fn create_note(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateNote>,
) -> Result<Json<NoteResponse>, StatusCode> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .as_secs() as i64;

    conn.execute(
        "INSERT INTO notes (title, content, created_at) VALUES (?1, ?2, ?3)",
        (&payload.title, &payload.content, timestamp),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let id = conn.last_insert_rowid();
    Ok(Json(NoteResponse {
        id,
        title: payload.title,
        content: payload.content,
        pinned: false,
        created_at: timestamp,
    }))
}

// READ ALL (with optional search)
async fn get_notes(
    State(state): State<Arc<AppState>>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<Vec<NoteResponse>>, StatusCode> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let notes: Vec<NoteResponse> = if let Some(query) = params.q.filter(|q| !q.trim().is_empty()) {
        // Full-text search with FTS5
        let search_term = format!("{}*", query.replace('"', "\"\""));
        let mut stmt = conn
            .prepare(
                "SELECT n.id, n.title, n.content, n.pinned, n.created_at
                 FROM notes n
                 JOIN notes_fts fts ON n.id = fts.rowid
                 WHERE notes_fts MATCH ?1
                 ORDER BY n.pinned DESC, rank",
            )
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let rows = stmt
            .query_map([&search_term], |row| {
                Ok(NoteResponse {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    content: row.get(2)?,
                    pinned: row.get::<_, i32>(3)? != 0,
                    created_at: row.get(4)?,
                })
            })
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        rows.filter_map(|r| r.ok()).collect()
    } else {
        // Return all notes, pinned first
        let mut stmt = conn
            .prepare(
                "SELECT id, title, content, pinned, created_at
                 FROM notes
                 ORDER BY pinned DESC, created_at DESC",
            )
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let rows = stmt
            .query_map([], |row| {
                Ok(NoteResponse {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    content: row.get(2)?,
                    pinned: row.get::<_, i32>(3)? != 0,
                    created_at: row.get(4)?,
                })
            })
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        rows.filter_map(|r| r.ok()).collect()
    };

    Ok(Json(notes))
}

// UPDATE
async fn update_note(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UpdateNote>,
) -> Result<StatusCode, StatusCode> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    conn.execute(
        "UPDATE notes SET title = ?1, content = ?2 WHERE id = ?3",
        (&payload.title, &payload.content, payload.id),
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::OK)
}

// TOGGLE PIN
async fn toggle_pin(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<TogglePin>,
) -> Result<StatusCode, StatusCode> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    conn.execute(
        "UPDATE notes SET pinned = NOT pinned WHERE id = ?1",
        [payload.id],
    )
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::OK)
}

// DELETE
async fn delete_note(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<DeleteNote>,
) -> Result<StatusCode, StatusCode> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    conn.execute("DELETE FROM notes WHERE id = ?1", [payload.id])
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::OK)
}

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/notes", get(get_notes).post(create_note))
        .route("/notes/update", put(update_note))
        .route("/notes/pin", put(toggle_pin))
        .route("/notes/delete", delete(delete_note))
        .with_state(state)
}
