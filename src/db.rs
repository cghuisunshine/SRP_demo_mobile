use rusqlite::{Connection, Result};
use std::sync::Mutex;

pub struct AppState {
    pub conn: Mutex<Connection>,
}

impl AppState {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("srp_portal.db")?;

        // Users Table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                role TEXT NOT NULL,
                strata_id TEXT,
                position TEXT,
                phone TEXT,
                cell_phone TEXT,
                must_change_password INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            )",
            [],
        )?;

        // Stratas Table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS stratas (
                id TEXT PRIMARY KEY,
                strata_plan TEXT NOT NULL,
                complex_name TEXT NOT NULL,
                address TEXT,
                city TEXT,
                province TEXT,
                postal_code TEXT,
                country TEXT,
                property_type TEXT,
                strata_manager_id TEXT,
                property_manager_id TEXT,
                created_at TEXT NOT NULL
            )",
            [],
        )?;

        // Service Requests Table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS service_requests (
                id TEXT PRIMARY KEY,
                strata_id TEXT NOT NULL,
                status TEXT NOT NULL,
                progress INTEGER DEFAULT 0,
                service_type TEXT NOT NULL,
                description TEXT,
                priority TEXT,
                requested_date TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(strata_id) REFERENCES stratas(id)
            )",
            [],
        )?;

        // Survey Answers Table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS survey_answers (
                service_request_id TEXT NOT NULL,
                question_id TEXT NOT NULL,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                PRIMARY KEY (service_request_id, question_id)
            )",
            [],
        )?;

        // FTS for Search (Optional but useful for Admin search)
        conn.execute(
            "CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
                content,
                source_id,
                source_type
            )",
            [],
        )?;

        let state = Self {
            conn: Mutex::new(conn),
        };

        state.seed_data()?;

        Ok(state)
    }

    fn seed_data(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        // Check if users table is empty
        let count: i64 = conn.query_row("SELECT COUNT(*) FROM users", [], |row| row.get(0))?;
        if count > 0 {
            return Ok(());
        }

        // 1. Seed Stratas
        conn.execute(
            "INSERT INTO stratas (id, strata_plan, complex_name, address, city, province, postal_code, country, property_type, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                "strata-1", "VIS 2345", "Vancouver Heights", "123 High St", "Vancouver", "BC", "V6B 1A1", "Canada", "Apartment", "2024-03-01T10:00:00Z"
            ],
        )?;

        // 2. Seed Users
        conn.execute(
            "INSERT INTO users (id, name, email, role, strata_id, position, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                "user-admin-1", "John Admin", "admin@srp.com", "admin", "", "Senior Planner", "2024-01-01T00:00:00Z"
            ],
        )?;
        conn.execute(
            "INSERT INTO users (id, name, email, role, strata_id, position, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                "user-client-1", "John Doe", "john.doe@strata.com", "client", "strata-1", "Strata President", "2024-03-01T10:00:00Z"
            ],
        )?;
        conn.execute(
            "INSERT INTO users (id, name, email, role, strata_id, position, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                "user-inspector-1", "Jane Inspector", "inspector@srp.com", "inspector", "", "Senior Field Inspector", "2024-03-01T10:00:00Z"
            ],
        )?;

        // 3. Seed Service Requests
        conn.execute(
            "INSERT INTO service_requests (id, strata_id, status, progress, service_type, created_at) 
             VALUES (?, ?, ?, ?, ?, ?)",
            [
                "req-1", "strata-1", "In Progress", "45", "Depreciation Report", "2024-03-05T14:00:00Z"
            ],
        )?;

        Ok(())
    }
}
