use axum::extract::{State, Json, Path};
use axum::routing::{get, post};
use axum::Router;
use axum::http::StatusCode;
use crate::models::{Strata, ServiceRequest};
use crate::db::AppState;
use std::sync::Arc;

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/", get(list_stratas))
        .route("/requests", get(list_requests))
        .route("/:id", get(get_strata))
        .route("/update", post(update_strata))
        .with_state(state)
}

async fn list_stratas(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Strata>>, StatusCode> {
    let conn = state.conn.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, strata_plan, complex_name, address, city, province, postal_code, country, property_type, strata_manager_id, property_manager_id, created_at FROM stratas")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let strata_iter = stmt
        .query_map([], |row| {
            Ok(Strata {
                id: row.get(0)?,
                strata_plan: row.get(1)?,
                complex_name: row.get(2)?,
                address: row.get(3)?,
                city: row.get(4)?,
                province: row.get(5)?,
                postal_code: row.get(6)?,
                country: row.get(7)?,
                property_type: row.get(8)?,
                legal_type: "Standard".to_string(), // Default for now
                company_id: "company-1".to_string(), // Default for now
                property_manager_id: row.get(10)?,
                user_ids: vec![], // For simplicity, handled elsewhere if needed
                created_at: row.get(11)?,
            })
        })
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let stratas = strata_iter
        .map(|res| res.unwrap())
        .collect::<Vec<Strata>>();

    Ok(Json(stratas))
}

async fn list_requests(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<ServiceRequest>>, StatusCode> {
    let conn = state.conn.lock().unwrap();
    let mut stmt = conn
        .prepare("SELECT id, strata_id, status, progress, service_type, created_at FROM service_requests")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let request_iter = stmt
        .query_map([], |row| {
            let strata_id: String = row.get(1)?;
            // In a real app, we'd join with stratas table. For now, fetch generic plan.
            Ok(ServiceRequest {
                id: row.get(0)?,
                strata_id: strata_id.clone(),
                strata_plan: "VIS 2345".to_string(), // Placeholder join
                service_type: row.get(4)?,
                status: row.get(2)?,
                progress: row.get(3)?,
                request_date: row.get(5)?, 
                file_opened_date: None,
                fiscal_year_start_month: None,
                agm_date: None,
                last_depreciation_report_date: None,
                target_date: None,
                report_scope: None,
                draft_deadline: None,
                draft_sent_date: None,
                created_at: row.get(5)?,
                updated_at: row.get(5)?,
            })
        })
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let requests = request_iter
        .map(|res| res.unwrap())
        .collect::<Vec<ServiceRequest>>();

    Ok(Json(requests))
}
async fn get_strata(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<Strata>, StatusCode> {
    let conn = state.conn.lock().unwrap();
    let strata_res: Result<Strata, _> = conn.query_row(
        "SELECT id, strata_plan, complex_name, address, city, province, postal_code, country, property_type, strata_manager_id, property_manager_id, created_at FROM stratas WHERE id = ?",
        [id],
        |row| {
            Ok(Strata {
                id: row.get(0)?,
                strata_plan: row.get(1)?,
                complex_name: row.get(2)?,
                address: row.get(3)?,
                city: row.get(4)?,
                province: row.get(5)?,
                postal_code: row.get(6)?,
                country: row.get(7)?,
                property_type: row.get(8)?,
                legal_type: "Standard".to_string(),
                company_id: "company-1".to_string(),
                property_manager_id: row.get(10)?,
                user_ids: vec![],
                created_at: row.get(11)?,
            })
        },
    );

    match strata_res {
        Ok(strata) => Ok(Json(strata)),
        Err(_) => Err(StatusCode::NOT_FOUND),
    }
}

async fn update_strata(
    Json(payload): Json<Strata>,
) -> Json<Strata> {
    // In real app, persist to DB here
    Json(payload)
}
