use bevy_ecs::prelude::*;
use axum::Json;
use axum::routing::post;
use axum::Router;
use chrono::{NaiveDate, Datelike, Duration};
use crate::models::{TimelineRequest, TimelineResponse};

// Components
#[derive(Component, Debug, Clone)]
struct ProjectDates {
    file_opened: NaiveDate,
    last_agm: NaiveDate,
    today: NaiveDate,
}

#[derive(Component, Debug, Clone)]
struct StrataRules {
    fiscal_start_month: u32,
}

pub fn router() -> Router {
    Router::new()
        .route("/calculate-timeline", post(calculate_timeline))
}

async fn calculate_timeline(
    Json(payload): Json<TimelineRequest>,
) -> Json<TimelineResponse> {
    let mut world = World::new();

    let file_opened = NaiveDate::parse_from_str(&payload.file_opened, "%Y-%m-%d")
        .unwrap_or_else(|_| NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
    
    let last_agm = NaiveDate::parse_from_str(&payload.last_agm_date, "%Y-%m-%d")
        .unwrap_or_else(|_| NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
        
    let today = chrono::Local::now().naive_local().date();

    // Spawn entity by component Insertion (avoids Tuple Bundle issues if trait impls are tricky)
    world.spawn_empty()
        .insert(ProjectDates { file_opened, last_agm, today })
        .insert(StrataRules { fiscal_start_month: payload.fiscal_year_start_month as u32 });

    // Run the calculation "System" manually for this request
    let mut query = world.query::<(&ProjectDates, &StrataRules)>();
    let (dates, rules) = query.single(&world).unwrap();

    // 1. Calculate Next Projected AGM
    let next_projected_agm = NaiveDate::from_ymd_opt(
        dates.last_agm.year() + 1,
        dates.last_agm.month(),
        dates.last_agm.day(),
    ).unwrap_or(dates.last_agm + Duration::days(365));
    
    // 2. Draft Deadline
    let draft_deadline = next_projected_agm - Duration::days(30);
    
    // 3. Fiscal Year Info
    let current_year = dates.today.year();
    let mut fiscal_start = NaiveDate::from_ymd_opt(current_year, rules.fiscal_start_month, 1).unwrap();
    if fiscal_start > dates.today {
        fiscal_start = NaiveDate::from_ymd_opt(current_year - 1, rules.fiscal_start_month, 1).unwrap();
    }
    
    let days_into_fiscal = (dates.today - fiscal_start).num_days();
    let fiscal_end = NaiveDate::from_ymd_opt(fiscal_start.year() + 1, fiscal_start.month(), fiscal_start.day()).unwrap() - Duration::days(1);
    let days_remaining_in_fiscal = (fiscal_end - dates.today).num_days();

    // 4. Days since last AGM
    let days_since_agm = if dates.today >= dates.last_agm {
        Some((dates.today - dates.last_agm).num_days())
    } else {
        None
    };
    
    // 5. Days since file opened
    let days_since_file_opened = (dates.today - dates.file_opened).num_days();

    Json(TimelineResponse {
        next_projected_agm: next_projected_agm.format("%Y-%m-%d").to_string(),
        draft_deadline: draft_deadline.format("%Y-%m-%d").to_string(),
        days_into_fiscal,
        days_remaining_in_fiscal,
        days_since_agm,
        days_since_file_opened,
    })
}
