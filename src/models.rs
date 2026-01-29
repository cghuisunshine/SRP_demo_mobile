#![allow(dead_code)]
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String, // admin, inspector, client, assistant
    pub strata_id: Option<String>,
    pub position: Option<String>,
    pub phone: Option<String>,
    pub cell_phone: Option<String>,
    pub must_change_password: bool,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Strata {
    pub id: String,
    pub strata_plan: String,
    pub complex_name: String,
    pub address: String,
    pub city: String,
    pub province: String,
    pub postal_code: String,
    pub country: String,
    pub property_type: String, // Bare Land, Townhouse, Apartment, etc.
    pub legal_type: String, // Standard, Air-Parcel
    pub company_id: String,
    pub property_manager_id: Option<String>,
    pub user_ids: Vec<String>,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ServiceRequest {
    pub id: String,
    pub strata_id: String,
    pub strata_plan: String,
    pub service_type: String,
    pub status: String,
    pub progress: u8,
    pub request_date: String,
    pub file_opened_date: Option<String>,
    pub fiscal_year_start_month: Option<u8>,
    pub agm_date: Option<String>,
    pub last_depreciation_report_date: Option<String>,
    pub target_date: Option<String>,
    pub report_scope: Option<String>, // "This Fiscal", "Next Fiscal"
    pub draft_deadline: Option<String>,
    pub draft_sent_date: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    pub id: String,
    pub service_request_id: String,
    pub name: String,
    pub file_name: String,
    pub document_type: String,
    pub category: String, // mandatory, if_available, if_applicable
    pub status: String, // pending, uploaded, reviewed, rejected
    pub uploaded_by: String,
    pub uploaded_at: Option<String>,
    pub reviewed_by: Option<String>,
    pub reviewed_at: Option<String>,
    pub file_size: Option<u64>,
    pub mime_type: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Appointment {
    pub id: String,
    pub service_request_id: String,
    pub strata_plan: String,
    pub appointment_type: String, // inspection, draft_meeting
    pub requested_date_1: String,
    pub requested_time_1: String,
    pub requested_date_2: Option<String>,
    pub requested_time_2: Option<String>,
    pub confirmed_date: Option<String>,
    pub confirmed_time: Option<String>,
    pub inspector_id: Option<String>,
    pub status: String,
    pub meeting_type: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TimelineRequest {
    pub file_opened: String,
    pub fiscal_year_start_month: u8,
    pub last_agm_date: String,
    pub last_depr_report: Option<String>,
    pub target_date: Option<String>,
    pub report_scope: String, // "This Fiscal" or "Next Fiscal"
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TimelineResponse {
    pub next_projected_agm: String,
    pub draft_deadline: String,
    pub days_into_fiscal: i64,
    pub days_remaining_in_fiscal: i64,
    pub days_since_agm: Option<i64>,
    pub days_since_file_opened: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SurveySection {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub progress: u8,
    pub tags: Vec<String>,
    pub is_applicable: bool,
    pub href: Option<String>,
    pub grid_class: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SurveyQuestion {
    pub id: String,
    pub section_id: String,
    pub question_text: String,
    pub question_type: String, // text, select, radio, checkbox, boolean
    pub options: Option<Vec<String>>,
    pub is_mandatory: bool,
    pub help_text: Option<String>,
    pub depends_on_question_id: Option<String>,
    pub depends_on_value: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SurveyAnswer {
    pub service_request_id: String,
    pub question_id: String,
    pub value: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HubStatus {
    pub sections: Vec<SurveySection>,
    pub overall_progress: u8,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DocStatusUpdate {
    pub document_id: String,
    pub status: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LogisticsSlot {
    pub date: String,
    pub time: String,
    pub id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AuthResponse {
    pub user: User,
    pub token: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
}
