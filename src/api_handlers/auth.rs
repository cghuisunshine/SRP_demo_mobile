use axum::extract::{State, Json};
use axum::routing::{get, post};
use axum::response::IntoResponse;
use axum::Router;
use axum::http::StatusCode;
use crate::models::{User, AuthResponse, AuthRequest};
use crate::db::AppState;
use std::sync::Arc;

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/me", get(get_me))
        .route("/list", get(list_users))
        .with_state(state)
}

async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<AuthRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    let conn = state.conn.lock().unwrap();

    // Authenticate user from database
    let user_res: Result<User, _> = conn.query_row(
        "SELECT id, name, email, role, strata_id, position, phone, cell_phone, must_change_password, created_at 
         FROM users WHERE email = ?",
        [payload.email],
        |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
                email: row.get(2)?,
                role: row.get(3)?,
                strata_id: row.get(4)?,
                position: row.get(5)?,
                phone: row.get(6)?,
                cell_phone: row.get(7)?,
                must_change_password: row.get::<_, i32>(8)? != 0,
                created_at: row.get(9)?,
            })
        },
    );

    match user_res {
        Ok(user) => Ok(Json(AuthResponse {
            user,
            token: "fake-jwt-token".to_string(),
        })),
        Err(_) => Err(StatusCode::UNAUTHORIZED),
    }
}

async fn get_me() -> impl IntoResponse {
    // Mock session check
    let user = User {
        id: "user-client-1".to_string(),
        name: "John Doe".to_string(),
        email: "john.doe@strata.com".to_string(),
        role: "client".to_string(),
        strata_id: Some("strata-1".to_string()),
        position: Some("Strata President".to_string()),
        phone: Some("(604) 311-2222".to_string()),
        cell_phone: Some("(604) 333-4444".to_string()),
        must_change_password: false,
        created_at: "2024-03-01T10:00:00Z".to_string(),
    };

    Json(user)
}

pub async fn list_users(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<User>>, StatusCode> {
    let conn = state.conn.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, name, email, role, strata_id, position, phone, cell_phone, must_change_password, created_at FROM users")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_iter = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
                email: row.get(2)?,
                role: row.get(3)?,
                strata_id: row.get(4)?,
                position: row.get(5)?,
                phone: row.get(6)?,
                cell_phone: row.get(7)?,
                must_change_password: row.get::<_, i32>(8)? != 0,
                created_at: row.get(9)?,
            })
        })
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let users = user_iter
        .map(|res| res.unwrap())
        .collect::<Vec<User>>();

    Ok(Json(users))
}
