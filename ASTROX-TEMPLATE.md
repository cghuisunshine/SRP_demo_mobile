# Astrox Template - Developer Guide

> A high-performance web application template combining Astro (frontend) + Axum (Rust backend) for building modern, fast, and resource-efficient web applications.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+) and npm
- **Rust** (latest stable) and Cargo
- **Git** (optional, for version control)

### Development

```bash
# Install dependencies
npm install

# Development mode (choose one):

# Option 1: Frontend only (Astro dev server with HMR)
npm run dev:frontend

# Option 2: Backend only (Cargo with auto-reload)
npm run dev:backend

# Option 3: Full stack (run both in separate terminals)
# Terminal 1:
npm run dev:frontend
# Terminal 2:
npm run dev:backend
```

### Production

```bash
# Build everything
npm run build
# Creates: /dist (static files) + /target/release/astrox-template.exe

# Run production server
npm start
# Serves static files + API at http://localhost:3000
```

---

## 📁 Project Structure

```
astrox-template/
├── src/
│   ├── api_handlers/          # Rust API handlers
│   │   ├── mod.rs
│   │   ├── notes.rs           # CRUD operations for notes
│   │   ├── server_time.rs     # Example API endpoint
│   │   └── util.rs            # API utilities
│   ├── components/            # React/Astro components
│   │   ├── display-server-time.tsx
│   │   ├── notes-app.tsx      # Full-featured notes app
│   │   └── ui/                # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   ├── layouts/
│   │   └── Layout.astro       # Base layout template
│   ├── lib/
│   │   └── utils.ts           # Utility functions (cn helper)
│   ├── pages/                 # Astro pages (routes)
│   │   ├── index.astro        # Homepage
│   │   └── notes.astro        # Notes app page
│   ├── styles/
│   │   └── globals.css        # Global styles + Tailwind
│   ├── db.rs                  # SQLite database setup
│   ├── main.rs                # Axum server entry point
│   └── env.d.ts               # TypeScript environment types
├── dist/                      # Build output (generated)
├── target/                    # Rust build output (generated)
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── Cargo.toml                 # Rust dependencies
├── package.json               # Node dependencies
└── notes.db                   # SQLite database (generated)
```

---

## 🏗️ Architecture Overview

### Frontend Layer (Astro)

**Philosophy**: Static-first with selective interactivity via Islands

- **Static Pages**: `.astro` files compile to pure HTML
- **Interactive Islands**: React components hydrate only where needed
- **Build Output**: Optimized static files in `/dist`

**Example Page Structure**:
```astro
---
import Layout from '@/layouts/Layout.astro'
import { InteractiveComponent } from '@/components/interactive.tsx'
---

<Layout title="My Page">
  <h1>Static HTML - No JavaScript</h1>
  <InteractiveComponent client:load /> <!-- Island of interactivity -->
</Layout>
```

### Backend Layer (Axum)

**Philosophy**: High-performance Rust server serving static files + REST API

- **Static File Serving**: Serves `/dist` with automatic directory index handling
- **REST API**: JSON endpoints at `/api/*`
- **Database**: Embedded SQLite with FTS5 full-text search
- **Single Binary**: Compiles to ~2MB executable with zero runtime dependencies

**Request Flow**:
```
Browser → Axum Server
  ├─ /              → Rust `Html` Response (Login Pod - zero dependencies)
  ├─ /client/*      → Astro Static Routes (Static + React island)
  ├─ /api/*         → Rust REST API (Dynamic)
  └─ /_astro/*      → Static assets (Cached)
```

---

## ⚡ Breakthrough Pattern: Bypassing the SSR Build Wall

Building large React islands (like those using Radix UI or Framer Motion) inside Astro can occasionally hit a "Build Wall" during the SSR phase (e.g., `window is not defined` or hydration mismatches).

### **The Solution: The Rust-Served Login Pod**

To ensure 100% build stability and instant landing page loads, we use a **Rust-First Entry Point**:

1.  **Rust Serves `/`**: Instead of an `index.astro` file, the Axum backend serves a hardcoded, vanilla HTML/Tailwind string for the Login page.
2.  **No Build-Time SSR**: Since the login page isn't part of the Astro build, it cannot crash the binary generation.
3.  **Ultra-Compact Control**: Serving raw HTML allows for extreme CSS compaction (perfect for mobile-first, senior-friendly UIs).
4.  **Astro for the "Deep App"**: Astro is still used for the complex internal pages (`/client/*`, `/admin/*`), which are already optimized for static generation.

**Implementation in `main.rs`**:
```rust
async fn main() {
    let app = Router::new()
        .route("/", get(serve_login_pod)) // Standardized Entry Point
        .fallback(get(serve_static_files))
        // ...
}

async fn serve_login_pod() -> impl IntoResponse {
    Html(r#"<!DOCTYPE html><html>...</html>"#)
}
```

---

## 🏎️ **Reactive Backend: The ECS Pattern**

For complex business logic that requires strict rule enforcement and high performance (like the **Timeline Engine** or **Document Validation**), we use the **Entity Component System (ECS)** philosophy using `bevy_ecs`.

### **Why ECS for Web?**
Most web backends use "God Objects" or messy services. ECS treats data as **Components** and logic as **Systems**:
1.  **Components**: Pure data structs (e.g., `ProjectDates`, `StrataRules`).
2.  **Entities**: A collection of components representing a single concept (e.g., a "Service Request").
3.  **Systems**: Pure logic functions that run over entities with specific components.

**Example from `src/api_handlers/timelines.rs`**:
```rust
// Run a calculation System over the world
let mut query = world.query::<(&ProjectDates, &StrataRules)>();
let (dates, rules) = query.single(&world);

// Calculate deadlines based on provided components...
```

---

## 🔧 How to Build a New Application

### Step 1: Plan Your Data Model

**Example**: Building a task management SaaS

1. **Define your database schema** in `src/db.rs`:

```rust
pub struct AppState {
    pub conn: Mutex<Connection>,
}

impl AppState {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("app.db")?;
        
        // Create your tables
        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL,
                due_date INTEGER,
                created_at INTEGER NOT NULL
            )",
            [],
        )?;
        
        // Add FTS5 for search if needed
        conn.execute(
            "CREATE VIRTUAL TABLE IF NOT EXISTS tasks_fts USING fts5(
                title, description,
                content='tasks',
                content_rowid='id'
            )",
            [],
        )?;
        
        Ok(Self { conn: Mutex::new(conn) })
    }
}
```

### Step 2: Create API Handlers

**Create** `src/api_handlers/tasks.rs`:

```rust
use axum::{
    extract::{State, Query},
    http::StatusCode,
    routing::{get, post, put, delete},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::db::AppState;

#[derive(Deserialize)]
pub struct CreateTask {
    title: String,
    description: Option<String>,
    status: String,
}

#[derive(Serialize)]
pub struct TaskResponse {
    id: i64,
    title: String,
    description: Option<String>,
    status: String,
    created_at: i64,
}

async fn create_task(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateTask>,
) -> Result<Json<TaskResponse>, StatusCode> {
    let conn = state.conn.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let timestamp = /* get timestamp */;
    
    conn.execute(
        "INSERT INTO tasks (title, description, status, created_at) VALUES (?1, ?2, ?3, ?4)",
        (&payload.title, &payload.description, &payload.status, timestamp),
    ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    // Return created task...
}

async fn get_tasks(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<TaskResponse>>, StatusCode> {
    // Fetch and return tasks...
}

pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/tasks", get(get_tasks).post(create_task))
        .route("/tasks/:id", put(update_task).delete(delete_task))
        .with_state(state)
}
```

**Register in** `src/main.rs`:

```rust
mod api_handlers;

let app = Router::new()
    .nest("/api", api_handlers::tasks::router(app_state))
    .layer(compression_layer)
    .layer(cors_layer);
```

### Step 3: Build React Components

**Create** `src/components/task-manager.tsx`:

```tsx
import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Task {
  id: number
  title: string
  description?: string
  status: string
  created_at: number
}

export function TaskManager() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const API_BASE = `http://${import.meta.env.PUBLIC_HOST ?? 'localhost:3000'}/api`

  React.useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then(res => res.json())
      .then(setTasks)
  }, [])

  const createTask = async (title: string) => {
    await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status: 'pending' }),
    })
    // Refresh tasks...
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </Card>
      ))}
    </div>
  )
}
```

### Step 4: Create Astro Pages

**Create** `src/pages/tasks.astro`:

```astro
---
import Layout from '@/layouts/Layout.astro'
import { TaskManager } from '@/components/task-manager.tsx'
---

<Layout title="Tasks | My SaaS">
  <main class="container mx-auto p-8">
    <h1 class="text-4xl font-bold mb-8">Task Manager</h1>
    <TaskManager client:load />
  </main>
</Layout>
```

### Step 5: Style with Tailwind + shadcn/ui

**Add shadcn components**:
```bash
npx shadcn@latest add button card input
```

**Use in your components**:
```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

<Button variant="default" onClick={handleClick}>
  Create Task
</Button>
```

---

## 🎨 Styling Guide

### Tailwind Configuration

Edit `tailwind.config.mjs` to customize your design system:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      }
    }
  }
}
```

### Global Styles

Edit `src/styles/globals.css` for CSS variables:

```css
@layer base {
  :root {
    --primary: 200 100% 50%;
    --radius: 0.5rem;
  }
}
```

---

## 🔌 API Patterns

### Standard CRUD Pattern

```rust
// CREATE
.route("/resource", post(create_resource))

// READ (all)
.route("/resource", get(list_resources))

// READ (one)
.route("/resource/:id", get(get_resource))

// UPDATE
.route("/resource/:id", put(update_resource))

// DELETE
.route("/resource/:id", delete(delete_resource))
```

### Search with FTS5

```rust
async fn search_items(
    State(state): State<Arc<AppState>>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<Vec<Item>>, StatusCode> {
    let conn = state.conn.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    if let Some(query) = params.q {
        let search_term = format!("{}*", query.replace('"', "\"\""));
        let mut stmt = conn.prepare(
            "SELECT * FROM items 
             JOIN items_fts ON items.id = items_fts.rowid 
             WHERE items_fts MATCH ?1 
             ORDER BY rank"
        )?;
        // Execute and return results...
    }
}
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

**Outputs**:
- `/dist/` - Static files (deploy to CDN)
- `/target/release/astrox-template.exe` - Server binary

### Deployment Options

#### Option 1: VPS + CDN
1. Upload `/dist` to Cloudflare Pages, Netlify, or Vercel (static hosting)
2. Deploy binary to VPS (DigitalOcean, AWS EC2, etc.)
3. Point API subdomain to VPS

#### Option 2: Single Server
1. Copy `/dist` and binary to server
2. Run binary (serves both static + API)
3. Use nginx as reverse proxy

**Example nginx config**:
```nginx
server {
    listen 80;
    server_name myapp.com;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

#### Option 3: Docker
```dockerfile
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/astrox-template /app/
COPY --from=builder /app/dist /app/dist
WORKDIR /app
CMD ["./astrox-template"]
```

---

## 🔐 Environment Variables

Create `.env` file:

```bash
PUBLIC_HOST=localhost:3000
DATABASE_URL=sqlite:app.db
```

Access in Rust:
```rust
let host = std::env::var("PUBLIC_HOST").unwrap_or("localhost:3000".to_string());
```

Access in Astro/React:
```typescript
const apiHost = import.meta.env.PUBLIC_HOST ?? 'localhost:3000'
```

---

## 📊 Database Management

### Migrations

For schema changes, create migration functions in `src/db.rs`:

```rust
impl AppState {
    pub fn migrate_v2(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 0",
            [],
        )?;
        Ok(())
    }
}
```

### Backup

```bash
# SQLite backup
sqlite3 notes.db ".backup backup.db"
```

---

## 🧪 Testing

### Backend Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_create_task() {
        let state = Arc::new(AppState::new().unwrap());
        // Test your handlers...
    }
}
```

Run: `cargo test`

### Frontend Tests

Add to `package.json`:
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

---

## 🎯 Common Use Cases

### Building a SaaS Application
1. Add authentication (JWT tokens in Axum)
2. Multi-tenancy (add `tenant_id` to tables)
3. Subscription management (Stripe integration)
4. Admin dashboard (protected Astro pages)

### Building a Content Site
1. Use Astro's content collections
2. Minimal React islands for comments/forms
3. Static generation for SEO
4. API for dynamic features only

### Building an Internal Tool
1. Simple auth (basic auth in Axum)
2. CRUD interfaces with React islands
3. Export functionality (CSV/PDF from Rust)
4. Real-time updates (WebSockets in Axum)

---

## 💡 Best Practices

### Performance
- ✅ Use `client:visible` for below-fold components
- ✅ Lazy load heavy components
- ✅ Enable compression in Axum
- ✅ Cache static assets aggressively

### Security
- ✅ Validate all inputs in Rust handlers
- ✅ Use prepared statements (prevents SQL injection)
- ✅ Set CORS policies appropriately
- ✅ Add rate limiting for API endpoints

### Code Organization
- ✅ One API handler file per resource
- ✅ Shared types in separate modules
- ✅ Reusable UI components in `/components/ui`
- ✅ Keep pages thin, logic in components

---

## 🐛 Troubleshooting

### "Warning PUBLIC_HOST not set"
**Solution**: Create `.env` file with `PUBLIC_HOST=localhost:3000`

### "Cannot find module" in React components
**Solution**: Check `tsconfig.json` has correct path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Database locked errors
**Solution**: Ensure only one connection pool, use `Mutex<Connection>`

### Static files not found
**Solution**: Run `npm run build` before `npm start`

---

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Axum Documentation](https://docs.rs/axum)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)

---

## 🤝 Contributing to Your Project

When working with other developers or LLMs:

1. **Share this document** for onboarding
2. **Document new API endpoints** in this file
3. **Update architecture diagrams** as you scale
4. **Keep dependencies updated** regularly

---

**Built with ❤️ using Astro + Axum**
