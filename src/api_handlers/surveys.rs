use axum::extract::{State, Json};
use axum::routing::{get, post};
use axum::Router;
use axum::http::StatusCode;
use crate::models::{HubStatus, SurveySection, SurveyQuestion};
use crate::db::AppState;
use serde_json::Value;
use std::sync::Arc;

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/status", get(get_hub_status))
        .route("/sections/:id", get(get_section_questions))
        .route("/save-answers", post(save_answers))
        .route("/save-doc-status", post(save_doc_status))
        .with_state(state)
}

async fn get_hub_status() -> Json<HubStatus> {
    // Mocking a strata fetch - in real app, this comes from SQLite
    let property_type = "Bare Land"; // Imagine this is fetched for the current user's strata
    
    let all_sections = vec![
        SurveySection {
            id: "docs".to_string(),
            title: "Mandatory Documents".to_string(),
            description: "Upload Strata Plan, AGM Minutes, and Financial Statements.".to_string(),
            icon: "FileText".to_string(),
            progress: 45,
            tags: vec!["Critical".to_string(), "Documents".to_string()],
            is_applicable: true,
            href: Some("/client/documents".to_string()),
            grid_class: Some("md:col-span-2".to_string()),
        },
        SurveySection {
            id: "exterior".to_string(),
            title: "Building Exterior".to_string(),
            description: "Roofing, siding, windows, and exterior envelope details.".to_string(),
            icon: "Home".to_string(),
            progress: 0,
            tags: vec!["Survey".to_string()],
            is_applicable: true,
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "interior".to_string(),
            title: "Interior & Common".to_string(),
            description: "Review of common hallways, lobbies, and shared spaces.".to_string(),
            icon: "Home".to_string(),
            progress: 0,
            tags: vec!["Interior".to_string()],
            is_applicable: property_type != "Bare Land",
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "clubhouse".to_string(),
            title: "Clubhouse assessment".to_string(),
            description: "Detailed report on clubhouse envelope and mechanicals.".to_string(),
            icon: "Home".to_string(),
            progress: 0,
            tags: vec!["Technical".to_string()],
            is_applicable: true, // Specific check for clubhouse existence would go here
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "amenities".to_string(),
            title: "Amenities Checklist".to_string(),
            description: "Scope of shared facilities (Pools, Gyms, etc).".to_string(),
            icon: "Users".to_string(),
            progress: 0,
            tags: vec!["Scope".to_string()],
            is_applicable: true,
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "legal".to_string(),
            title: "Legal Issues".to_string(),
            description: "CRT claims and lawsuits disclosure.".to_string(),
            icon: "ShieldCheck".to_string(),
            progress: 0,
            tags: vec!["Risk".to_string()],
            is_applicable: true,
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "council".to_string(),
            title: "Council Concerns".to_string(),
            description: "Direct feedback from the Strata Council.".to_string(),
            icon: "ClipboardCheck".to_string(),
            progress: 0,
            tags: vec!["Feedback".to_string()],
            is_applicable: true,
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "elevator".to_string(),
            title: "Elevator & Lift".to_string(),
            description: "Safety inspections and maintenance records for all vertical transport.".to_string(),
            icon: "ShieldCheck".to_string(),
            progress: 0,
            tags: vec!["Survey".to_string(), "Technical".to_string()],
            is_applicable: property_type != "Bare Land",
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "services".to_string(),
            title: "Mechanical Services".to_string(),
            description: "HVAC, plumbing, electrical systems, and shared utilities.".to_string(),
            icon: "Wrench".to_string(),
            progress: 12,
            tags: vec!["Survey".to_string()],
            is_applicable: true,
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "amenities_features".to_string(),
            title: "Amenities & Clubhouse".to_string(),
            description: "Shared facilities including pools, gyms, and community spaces.".to_string(),
            icon: "Tree".to_string(),
            progress: 0,
            tags: vec!["Survey".to_string()],
            is_applicable: true,
            href: None,
            grid_class: None,
        },
        SurveySection {
            id: "contacts".to_string(),
            title: "Contact Management".to_string(),
            description: "Confirm site contacts and property management details.".to_string(),
            icon: "Users".to_string(),
            progress: 80,
            tags: vec!["Setup".to_string()],
            is_applicable: true,
            href: Some("/client/profile".to_string()),
            grid_class: None,
        },
        SurveySection {
            id: "inspection".to_string(),
            title: "Inspection Date".to_string(),
            description: "Schedule the site visit after documents are reviewed.".to_string(),
            icon: "ClipboardCheck".to_string(),
            progress: 0,
            tags: vec!["Locked".to_string()],
            is_applicable: true,
            href: Some("/client/inspection".to_string()),
            grid_class: Some("md:col-span-full bg-gray-50/50 grayscale opacity-60".to_string()),
        },
    ];

    // Filter only applicable sections
    let applicable_sections: Vec<SurveySection> = all_sections
        .into_iter()
        .filter(|s| s.is_applicable)
        .collect();

    Json(HubStatus {
        sections: applicable_sections,
        overall_progress: 33,
    })
}

async fn get_section_questions(axum::extract::Path(id): axum::extract::Path<String>) -> Json<Vec<SurveyQuestion>> {
    let questions = match id.as_str() {
        "exterior" => vec![
            SurveyQuestion {
                id: "ext-1".to_string(),
                section_id: "exterior".to_string(),
                question_text: "Has the roof been replaced since the last report?".to_string(),
                question_type: "boolean".to_string(),
                options: None,
                is_mandatory: true,
                help_text: None,
                depends_on_question_id: None,
                depends_on_value: None,
            },
            SurveyQuestion {
                id: "ext-2".to_string(),
                section_id: "exterior".to_string(),
                question_text: "What year was the roof replaced?".to_string(),
                question_type: "text".to_string(),
                options: None,
                is_mandatory: true,
                help_text: Some("Enter 4-digit year".to_string()),
                depends_on_question_id: Some("ext-1".to_string()),
                depends_on_value: Some("true".to_string()),
            },
            SurveyQuestion {
                id: "ext-3".to_string(),
                section_id: "exterior".to_string(),
                question_text: "Are there any known leaks?".to_string(),
                question_type: "boolean".to_string(),
                options: None,
                is_mandatory: true,
                help_text: None,
                depends_on_question_id: None,
                depends_on_value: None,
            },
        ],
        _ => vec![],
    };
    
    Json(questions)
}

async fn save_answers(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    // ✅ FIXED: Prefix with _ to silence unused warning
    let _section_id = payload.get("sectionId").and_then(|v| v.as_str()).unwrap_or("");
    let answers = payload.get("answers").and_then(|v| v.as_object()).ok_or(StatusCode::BAD_REQUEST)?;
    let timestamp = payload.get("timestamp").and_then(|v| v.as_str()).unwrap_or("");

    // In a real app, getting the current service request ID from session would be key.
    // For now, hardcode to "req-1" to match our seed data.
    let service_request_id = "req-1";

    let conn = state.conn.lock().unwrap();

    for (question_id, value) in answers {
        let val_str = value.as_str().unwrap_or("").to_string();
        
        conn.execute(
            "INSERT OR REPLACE INTO survey_answers (service_request_id, question_id, value, updated_at) 
             VALUES (?, ?, ?, ?)",
            [service_request_id, question_id, &val_str, timestamp],
        ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    }
    
    // Also update progress for this section (simplified logic)
    // Here we'd typically calculate % complete and update `service_requests.progress` or similar.

    Ok(Json(serde_json::json!({ "status": "ok", "message": "Answers saved successfully" })))
}

async fn save_doc_status(Json(payload): Json<Value>) -> Json<Value> {
    println!("Saving document status: {:?}", payload);
    // In real app, update Document status in SQLite
    Json(serde_json::json!({ "status": "ok", "message": "Document status updated" }))
}
