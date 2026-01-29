mod api_handlers;
mod db;
mod models;

use crate::api_handlers::server_time::get_time;
use crate::db::AppState;
use axum::{
    extract::{OriginalUri, Request},
    response::{Html, IntoResponse},
    routing::{get, post, put},
    Json,
    RequestPartsExt, Router,
};
use dotenv::dotenv;
use std::sync::Arc;
use tower::util::ServiceExt;
use tower_http::compression::CompressionLayer;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    dotenv().ok();

    // Initialize database
    let app_state = Arc::new(AppState::new().expect("Failed to initialize database"));

    let api_host = std::env::var("PUBLIC_HOST").unwrap_or_else(|_| {
        println!("\x1b[38;2;217;194;140mWarning\x1b[0m PUBLIC_HOST not set");
        "localhost:3000".to_string()
    });

    let public_path = std::env!("CARGO_MANIFEST_DIR").to_owned() + "/dist";
    let fallback_service = ServeDir::new(public_path).append_index_html_on_directories(true);

    let compression_layer = CompressionLayer::new().gzip(true);
    let cors_layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(serve_login_pod))
        .fallback(get(|req: Request| async move {
            let (mut parts, body) = req.into_parts();
            let uri: OriginalUri = parts.extract().await?;
            let req = Request::from_parts(parts, body);
            match fallback_service.oneshot(req).await {
                Ok(mut res) => {
                    if uri.path().contains("/_static/") {
                        res.headers_mut()
                            .insert("Cache-Control", "public, max-age=31536000".parse().unwrap());
                    }
                    Ok(res)
                }
                Err(e) => Err(e),
            }
        }))
        .nest("/api", api_handlers::notes::router(app_state.clone()))
        .nest("/api/auth", api_handlers::auth::router(app_state.clone()))
        .nest("/api/stratas", api_handlers::stratas::router(app_state.clone()))
        .nest("/api/stratas", api_handlers::timelines::router())
        .nest("/api/surveys", api_handlers::surveys::router(app_state.clone()))
        .nest("/api/logistics", api_handlers::logistics::router())
        .route("/api/ecs/documents/process", get(process_documents_ecs))
        .route("/api/ecs/scheduler/optimize", put(run_scheduler_ecs))
        .route("/api/ecs/inspection/simulate", post(simulate_inspection_ecs))
        .route("/api/time/", get(get_time))
        .layer(compression_layer)
        .layer(cors_layer);

    let listener = tokio::net::TcpListener::bind(api_host).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn process_documents_ecs() -> impl IntoResponse {
    use crate::api_handlers::ecs_documents::DocumentWorld;
    
    // Spin up an ECS world for this request
    let mut ecs = DocumentWorld::new();
    
    // Ingest some mock documents
    ecs.add_document("doc-1".into(), "Budget_2024.pdf".into(), "This is the Strata Budget for 2024...".into());
    ecs.add_document("doc-2".into(), "Minutes_AGM.docx".into(), "Minutes of the Annual General Meeting...".into());
    ecs.add_document("doc-3".into(), "Engineering_Report.txt".into(), "Structural analysis reveals critical failures...".into());
    
    // Run the systems (Parallel Analysis)
    ecs.run();
    
    // Get results
    let results = ecs.get_results();
    
    Json(results)
}

async fn run_scheduler_ecs() -> impl IntoResponse {
    use crate::api_handlers::ecs_scheduler::SchedulerWorld;
    
    let mut ecs = SchedulerWorld::new();
    ecs.seed_simulation();
    ecs.run();
    
    let assignments = ecs.get_assignments();
    
    Json(assignments)
}

async fn simulate_inspection_ecs() -> impl IntoResponse {
    use crate::api_handlers::ecs_inspection::InspectionWorld;

    let mut ecs = InspectionWorld::new();
    ecs.seed_mock_elements();
    ecs.run();

    let results = ecs.get_results();
    
    // Transform tuple to simple JSON objects for frontend
    let json_results: Vec<_> = results.into_iter().map(|(elem, finding)| {
        serde_json::json!({
            "element": elem,
            "finding": finding
        })
    }).collect();

    Json(json_results)
}

async fn serve_login_pod() -> impl IntoResponse {
    Html(r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Strata Reserve Planning</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { background-color: #6B8E5F; overflow: hidden; font-family: 'Inter', sans-serif; }
        .compact-card { max-width: 320px; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between py-4 px-4">
    <div class="flex-grow flex items-center justify-center">
        <div class="compact-card w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 text-center ring-1 ring-white/10 animate-in fade-in zoom-in duration-500">
            <!-- Logo Section -->
            <div class="mx-auto mb-4 h-12 w-auto flex items-center justify-center">
                <img src="/logo_SRP.png" alt="SRP Logo" class="h-10 w-auto object-contain" />
            </div>
            <h1 class="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Strata Reserve Planning</h1>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Portal Access</p>

            <!-- Form -->
            <form id="loginForm" class="space-y-3 text-left">
                <div class="space-y-1">
                    <label class="text-[9px] font-black uppercase text-gray-400 tracking-wider">Username</label>
                    <input type="email" id="email" required class="w-full h-9 px-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#6B8E5F]/20 focus:outline-none transition-all" placeholder="name@email.com">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-black uppercase text-gray-400 tracking-wider">Password</label>
                    <input type="password" id="password" required class="w-full h-9 px-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#6B8E5F]/20 focus:outline-none transition-all" placeholder="••••••••">
                </div>
                <button type="submit" id="submitBtn" class="w-full h-10 bg-[#6B8E5F] hover:bg-[#5a7850] text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#6B8E5F]/20 active:scale-[0.98] transition-all mt-1">Sign In</button>
            </form>

            <!-- Fast Pass -->
            <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2 mb-2">
                    <div class="h-px bg-gray-100 flex-grow"></div>
                    <p class="text-[8px] font-black uppercase tracking-[0.2em] text-gray-300">Quick Access</p>
                    <div class="h-px bg-gray-100 flex-grow"></div>
                </div>
                <div class="flex justify-center gap-2">
                    <button type="button" onclick="fastPass('john.doe@strata.com', 'password123', '/client/dashboard')" class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 bg-gray-50 hover:bg-[#6B8E5F]/10 hover:text-[#6B8E5F] rounded-lg transition-colors">Client</button>
                    <button type="button" onclick="fastPass('inspector@srp.com', 'inspect123', '/inspector/dashboard')" class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 bg-gray-50 hover:bg-[#6B8E5F]/10 hover:text-[#6B8E5F] rounded-lg transition-colors">Insp</button>
                    <button type="button" onclick="fastPass('admin@srp.com', 'admin123', '/admin/dashboard')" class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 bg-gray-50 hover:bg-[#6B8E5F]/10 hover:text-[#6B8E5F] rounded-lg transition-colors">Admin</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-white/70 text-[9px] font-black uppercase tracking-[0.3em] pb-2">
        <p>© 2026 Strata Reserve Planning. All Rights Reserved.</p>
        <div class="mt-2 space-x-4 opacity-50">
            <a href="/privacy" class="hover:underline hover:text-white transition-colors">Privacy</a>
            <a href="/terms" class="hover:underline hover:text-white transition-colors">Terms</a>
        </div>
    </footer>

    <script>
        async function fastPass(email, pass, next) {
            document.getElementById('email').value = email;
            document.getElementById('password').value = pass;
            handleLogin(null, next);
        }

        async function handleLogin(e, redirectOverride) {
            if (e) e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = document.getElementById('submitBtn');
            
            btn.innerHTML = 'AUTHENTICATING...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (res.ok) {
                    const data = await res.json();
                    const state = {
                        state: {
                            auth: { currentUser: data.user, token: data.token, isAuthenticated: true }
                        }
                    };
                    localStorage.setItem('srp-portal-storage', JSON.stringify(state));
                    window.location.href = redirectOverride || (data.user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
                } else {
                    alert('Invalid credentials');
                    btn.innerHTML = 'SIGN IN';
                    btn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                btn.innerHTML = 'SIGN IN';
                btn.disabled = false;
            }
        }

        document.getElementById('loginForm').onsubmit = (e) => handleLogin(e);
    </script>
</body>
</html>"#)
}
