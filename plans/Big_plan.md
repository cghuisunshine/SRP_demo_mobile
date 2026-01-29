# SRP Portal Prototype - Master Implementation Plan ("Big Plan")

**Objective:** Build a fully functional, high-fidelity prototype that strictly aligns with the provided SRP Wireframes, featuring a senior-friendly design and a robust Rust/Axum data layer.
**Tech Stack:** Astro, React, Tailwind CSS, shadcn/ui.
**Data Strategy:** Rust-based data layer using Axum for APIs and SQLite (via rusqlite) for storage.
**Source of Truth (Logic):** [robyn_erds.md](file:///c:/Users/jpfaj/OneDrive/Desktop/astrox-template/plans/robyn_erds.md)
**Source of Truth (Flows):** [kamil_userflows.md](file:///c:/Users/jpfaj/OneDrive/Desktop/astrox-template/plans/kamil_userflows.md)
**Source of Truth (UI):** @[admin-wireframes] and @[client-wireframes]

---

## 🏗️ 1. Architecture & Routing

We use a **Hybrid Rust-First** architecture for maximum stability and performance.

### **Entry Point (The "Login Pod")**
To bypass Astro SSR build-walls and ensure 100% uptime, the **Rust (Axum)** backend serves the initial Login page directly as a zero-dependency HTML/Tailwind "Pod." This ensures:
- **Instant Loads**: No JS framework initialization required for the login screen.
- **Ultra-Compact UI**: Precise control over the viewport to ensure footer visibility.
- **Build Resilience**: The build never crashes because the entry point is "pre-hardcoded" in Rust.

### **Internal App (Astro + React Islands)**
Once authenticated, the user is redirected to the Astro-built internal application. We use file-based routing with React "Islands" for stateful interactivity on the dashboard, profile, and survey pages.

### **Reactive Backend (ECS Philosophy)**
For complex business logic (e.g., the Timeline Engine), we use an **Entity Component System (ECS)** pattern implemented via `bevy_ecs`.
- **Logic Decoupling**: Systems (logic) are separated from Components (data), ensuring Robyn's complex rules can be applied modularly.
- **High Performance**: Rust's memory safety and speed are leveraged through data-local processing.
- **Testability**: Systems can be tested in isolation against mock worlds.

### **Route Structure**
```
/                      # Root (Served by Rust HTML Pod)
/client/dashboard      # Dashboard (Astro/React)
│   ├── documents.astro        # Document Uploads
│   ├── inspection.astro       # Inspection Scheduler
│   └── meeting.astro          # Draft Meeting Scheduler
├── admin/
│   ├── dashboard.astro        # Admin Command Center
│   ├── strata/                # Strata Management
│   ├── users/                 # User Management
│   ├── requests/              # Service Requests & Review
│   └── settings.astro         # Company Settings
└── inspector/
    ├── dashboard.astro        # Inspection Schedule
    └── availability.astro     # Availability Manager
```

---

## 💾 2. Rust Data Layer (The "Real Database")

We will define these models in `src/models.rs` and serve them via Axum endpoints.

### **Rust Models (src/models.rs)**

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String, // admin, inspector, client, assistant
    pub strata_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Strata {
    pub id: String,
    pub strata_plan: String,
    pub name: String,
    pub address: String,
    pub property_type: String,
}

// ... other models for ServiceRequest, Document, etc.
```

### **API Endpoints**

```
GET /api/auth/me          # Check current session
POST /api/auth/login      # Authenticate user
GET /api/stratas          # List all stratas (Admin)
GET /api/strata/:id       # Details for one strata
GET /api/requests         # Service requests
```
// Based on Robyn's ERDs
export type UserRole = 'admin' | 'inspector' | 'client' | 'assistant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  strataId?: string; // For client users
  avatarUrl?: string;
}

export interface Strata {
  id: string;
  strataPlan: string; // "VIS 2345"
  name: string;
  address: string;
  city: string;
  propertyType: 'Townhouse' | 'Apartment' | 'Bare Land';
  users: string[]; // User IDs
}

export interface ServiceRequest {
  id: string;
  strataId: string;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Inspection Scheduled' | 'Report Sent';
  progress: number; // 0-100
  agmDate?: string;
  fiscalYearEnd?: string;
}

// Survey & Documents
export interface SurveyResponse {
  sectionId: string; // "exterior", "interior"
  answers: Record<string, any>; // { "roof_age": 10, "has_pool": false }
}

export interface Document {
    id: string;
    requestId: string;
    name: string;
    type: 'Mandatory' | 'Optional';
    category: 'Strata Plan' | 'Bylaws' | 'Financials';
    status: 'Pending' | 'Uploaded' | 'Approved' | 'Rejected';
    uploadDate?: string;
}
```

---

## 🧩 3. Component Inventory

Using **shadcn/ui** as the base.

### **Core UI (Existing)**
- `Button` (w/ Brand Green variants)
- `Card`, `CardHeader`, `CardContent`
- `Input`, `Label`, `Textarea`
- `Badge` (Status indicators)
- `Alert`, `Dialog` (Modals)

### **Custom "Smart" Components (To Build)**
1.  **`AuthGuard`**: Wrapper to protect routes based on User Role.
2.  **`GlobalStateProvider`**: A React Context provider to initialize and sync LocalStorage data.
3.  **`SidebarNav`**: Responsive sidebar that changes based on role.
4.  **`ProgressBar`**: Visual indicator for survey/document completion.
5.  **`DocumentUploader`**: Drag-and-drop zone that simulates upload delay and success.
6.  **`CalendarPicker`**: Wrapper around `react-day-picker` for scheduling slots.
7.  **`TimelineVisualizer`**: Renders the AGM backwards-calculation timeline.
8.  **Brand Identity**: Use SRP Logo @[plans/logo_SRP.png] and consistent green color palette (#6B8E5F).
9.  **User Flow Compliance**: Meet requirements from @[plans/robyn_erds.md], @[plans/kamil_userflows.md], @[plans/josh_translation.md], and @[plans/summary_what_jeremy_needs.md].

---

## ✅ 4. Master Checklist & Build Order

### **Phase 1: Foundation & State**
- [x] **Setup Types**: Create `models.rs` and `lib/types.ts`.
- [x] **Setup API**: Implement Axum handlers for authentication and stratas.
- [x] **Global Store**: Build `useStore` hook in `lib/store.ts` to sync with Axum API.
- [x] **Layouts**: Create `DashboardLayout.astro` and `BaseLayout.astro`.

### **Phase 2: Authentication (Axum + Sessions)**
- [x] **Login Page**: Build screen matching `log_in.png`.
- [x] **Auth Logic**: Integrated Rust-based login endpoint.
- [x] **High-Fidelity UI**: Align Sidebar, Tables, and Cards with Kamil's wireframes.
- [ ] **Sessions**: Implement real SQLite-backed sessions (currently mock).
- [ ] **Route Protection**: Middleware to redirect unauthenticated users.

### **Phase 3: Client Portal (The Core Hub)**
- [ ] **Bento Box Dashboard**:
    - [ ] Dynamic tile layout for Surveys, Documents, and Timelines.
    - [ ] Global Semantic Search (Filter across surveys and uploads).
    - [ ] Smart Progress donut charts for each tile.
- [ ] **Property Profile**:
    - [ ] Read-only Strata info + Edit Contact form.
- [x] **Timelines**:
    - [x] AGM Date picker + Rust-powered date math.
    - [x] Calculated: Next AGM, Draft Deadline, Fiscal Metrics.
- [x] **Smart Surveys (Hybrid Strategy)**:
    - [x] **Content Collections**: Define Zod schema in `src/content/config.ts`.
    - [x] **Markdown Source**: Migrate question text from code to `.md` files in `src/content/surveys/`.
    - [x] **Generic Engine**: Refactor `SurveyEngine.tsx` to bridge Markdown content with Rust logic.
- [ ] **Operational Flow (Admin/Inspector)**:
    - [ ] **Task Collections**: Use Markdown to define standard "Operating Procedures" or roles.
    - [ ] **Dynamic Dashboards**: Use Astro to pre-render role-specific content from Markdown.

---

## 🛠️ 4. Hybrid Content Strategy (The "Markdown Technique")

To ensure the portal is maintainable by non-programmers (e.g., consultants updating survey questions), we utilize **Astro Content Collections**.

1.  **Definitions**: Schema definitions in `src/content/config.ts` enforce data integrity.
2.  **Authoring**: New survey sections, document categories, or even inspector instructions are written in simple **Markdown**.
3.  **Consumption**: React components query these collections at build-time (or via API) to render the UI dynamically.

**Benefits:**
- **Speed**: No need to "re-code" if a strata law changes; just update the `.md` file.
- **Robustness**: Zod ensures that every Markdown file has the required fields (ID, title, category).
- **Interactivity**: We bridge MD frontmatter with Rust state in the Zustand store.

### **Phase 4: Admin Portal**
- [ ] **Admin Dashboard**:
    - [ ] High-level stats (Total Active, Due Today).
    - [ ] Recent Activity Feed.
- [x] **Service Request Manager**:
    - [x] Filterable table of all requests (Status, Client, Date).
    - [ ] Detail View: See client's survey answers and docs.
    - [ ] Actions: "Mark Docs Reviewed", "Unlock Inspection".

### **Phase 5: Inspector Portal**
- [ ] **My Schedule**: List of upcoming confirmed inspections.
- [ ] **Availability Manager**: Calendar to block off dates.

---

## 🚀 5. Implementation Steps (Micro-Tasks)

I will execute these in order.

**Step 1: Setup Data & Store**
Create the "Brain" of the app. If this is solid, the UI is just rendering data.

**Step 2: Login & Shell**
Get the navigation working. Ensure I can switch between "Client" and "Admin" views easily.

**Step 3: Client Dashboard & Profile**
The "Home" base for the user. Responsive layout check.

**Step 4: The Timeline Engine & Hub Base**
Implement the date math in Rust and build the Bento Box layout shell.

**Step 5: Smart Survey & Doc Engine**
Build the dynamic question renderer and filter logic. Ensure progress bars "know" what is optional.

**Step 7: Admin Views**
Build the "Other side" of the interaction to prove the data is shared.

**Step 8: Polish**
- Add Josh's requested specific text/copy.
- Adjust colors to match `styleguide_SRP.md`.
- Ensure "Senior Friendly" sizes (text/buttons).

---
