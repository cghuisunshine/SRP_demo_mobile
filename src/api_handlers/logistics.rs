use axum::Json;
use axum::routing::{get, post};
use axum::Router;
use chrono::{Datelike, Duration, Weekday};
use crate::models::{LogisticsSlot, Appointment};

pub fn router() -> Router {
    Router::new()
        .route("/available-slots", get(get_available_slots))
        .route("/book-inspection", post(book_inspection))
}

async fn get_available_slots() -> Json<Vec<LogisticsSlot>> {
    let mut slots = Vec::new();
    let today = chrono::Local::now().naive_local().date();
    
    // Find the next 4 Fridays
    let mut current = today;
    let mut fridays_found = 0;
    
    while fridays_found < 4 {
        current = current + Duration::days(1);
        if current.weekday() == Weekday::Fri {
            // Add 10:00 AM slot
            slots.push(LogisticsSlot {
                date: current.format("%Y-%m-%d").to_string(),
                time: "10:00 AM".to_string(),
                id: format!("{}-10am", current.format("%Y-%m-%d")),
            });
            // Add 2:00 PM slot
            slots.push(LogisticsSlot {
                date: current.format("%Y-%m-%d").to_string(),
                time: "2:00 PM".to_string(),
                id: format!("{}-2pm", current.format("%Y-%m-%d")),
            });
            fridays_found += 1;
        }
    }
    
    Json(slots)
}

async fn book_inspection(
    Json(payload): Json<Appointment>,
) -> Json<Appointment> {
    // In a real app, we would save payload to the DB here.
    // For now, we just echo it back as "confirmed" if it was strictly valid.
    let mut confirmed = payload;
    confirmed.status = "Pending Review".to_string();
    confirmed.updated_at = chrono::Local::now().to_rfc3339();
    
    Json(confirmed)
}
