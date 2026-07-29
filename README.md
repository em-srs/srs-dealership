# Car Dealership Inventory System (TDD Kata)

A full-stack Car Dealership Inventory System built following strict **Test-Driven Development (TDD)** principles, featuring a **FastAPI** backend with **Neon PostgreSQL** cloud database storage, **JWT authentication**, role-based access control (`user` and `admin`), and a single-page **React 19 + Tailwind CSS** permission-gated dashboard.

---

## 🌐 Deployment & Live Production URLs

The application is deployed across production cloud infrastructure:

- 🚀 **Live Production Dashboard (Frontend SPA)**: [https://srs-dealership.vercel.app](https://srs-dealership.vercel.app)
- ⚙️ **Live Production API (Backend Service)**: [https://drivehub-dealership.onrender.com](https://drivehub-dealership.onrender.com)
- 🗄️ **Live Cloud Database**: **Neon Serverless PostgreSQL** (51 vehicles seeded + demo accounts)

### Production Deployment Setup
- **Database (Neon Cloud)**: Managed serverless PostgreSQL 16 instance. DDL (`schema.sql`) and 51 seed records loaded directly into Neon.
- **Backend Service (Render)**: Python 3.13 service executing Gunicorn multi-worker ASGI process (`render.yaml`).
- **Frontend SPA (Vercel)**: React 19 Vite application configured with single-page app rewrite rules (`frontend/vercel.json`) consuming `VITE_API_BASE_URL`.

---

## 💡 Design Decisions

### Deliberate Column Rename: `make` $\rightarrow$ `maker`
- **Context & Rationale**: During development, the user explicitly requested renaming the vehicle attribute `make` to `maker` to provide explicit clarity across the domain model, API query parameters, PostgreSQL schema, and frontend UI components.
- **Confirmation**: This rename was a **deliberate human architectural choice** requested by the developer (`sunnyrajsu`), not an accidental AI-driven deviation. The entire codebase (`schema.sql`, SQLAlchemy models, Pydantic schemas, React components, and test fixtures) consistently enforces `maker`.

---

## My AI Usage & Ownership Disclosure

> **Transparent & Detailed Disclosure on Human vs. Multi-AI Collaborations**

### Human Direction & Conceptual Ownership (sunnyrajsu)
- **Architectural & Tech Stack Selection**: Conceptualized and selected the technology stack — FastAPI for high-performance Python microservices, PostgreSQL with relational domain `CHECK` constraints, and React 19 + Vite + Tailwind CSS for a modern single-page dashboard.
- **UI/UX Design & Aesthetic Vision**: Designed the single-page permission-gated dashboard layout (sharing one unified grid for regular users and admins, with layered admin controls), modern dark-mode aesthetic, color palette (cyan/blue gradient accents, slate dark backgrounds), and stock status pills (green "In Stock" / red "Out of Stock").
- **Implementation Strategy & Testing Process**: Designed the step-by-step TDD implementation roadmap (establishing the Red -> Green -> Refactor cycle, defining test-first boundaries for Auth, Vehicles, Inventory, and Frontend components, and setting up empirical report verification).

### Multi-AI Tool Attribution & Contributions

#### 1. Claude (Anthropic) — Planning, Architecture & Strategy
- **Role**: High-level architectural collaborator, kata requirements analysis, tech stack planning, and prompt engineering.
- **Contributions**:
  - Analyzed `TDD Kata for srs-dealership.docx` and structured the multi-phase implementation roadmap.
  - Recommended the technology stack: FastAPI microservices, PostgreSQL with domain `CHECK` constraints, and React 19 + Vite + Tailwind CSS.
  - Designed the single-page permission-gated dashboard UX rules and structured the prompt sequences provided to the in-IDE coding agent.

#### 2. Antigravity AI Agent (Google DeepMind) — Hands-On In-IDE Execution & TDD Coding
- **Role**: Primary in-IDE pair programming agent for code generation, unit test writing, and bug resolutions.
- **Contributions**:
  - Implemented backend Python microservice code (`models`, `schemas`, `endpoints`, `security`, database connection pooling).
  - Wrote TDD unit test suites (`test_auth.py`, `test_vehicles.py`, `test_inventory.py`) and Vitest RTL component tests (`App.test.jsx`).
  - Implemented React 19 SPA components (`Navbar`, `VehicleCard`, `FilterBar`, `AdminModal`, `RestockModal`, `AuthModal`, `ProfileModal`).
  - Diagnosed and resolved runtime errors (PostCSS v4 deprecation, OR-based search logic, AuthProvider context wiring, Neon DB scripts, Render `render.yaml`, Vercel `vercel.json`).

### Note on Git Commit Co-Author Trailers
- **Initial Commits (`Gemini AI`)**: The first two commit messages initially used a trailer labeled `Co-authored-by: Gemini AI <copilot@users.noreply.github.com>`.
- **Trailer Standardization (`AI Assistant`)**: Following a directive to standardize commit trailers, a `git filter-branch` operation updated the trailer string across early commits to `Co-authored-by: AI Assistant <copilot@users.noreply.github.com>`. *(Note: The `copilot@` email string was a placeholder format; GitHub Copilot was not used)*.
- **Corrected Standard (`Antigravity AI`)**: All new commits going forward use the accurate trailer:
  `Co-authored-by: Antigravity AI <antigravity@google.com>`.

---

## Production Cloud Architecture Stack

| Layer | Hosting Provider | Configuration & Infrastructure |
| :--- | :--- | :--- |
| **Frontend SPA** | **Vercel** | Vite React 19 build, SPA route rewrite rules ([`vercel.json`](frontend/vercel.json)), connected to Render backend via `VITE_API_BASE_URL` |
| **Backend API** | **Render** | Python 3.13 Gunicorn multi-worker service ([`render.yaml`](render.yaml)), dynamic CORS middleware, auto-reconnects to Neon PostgreSQL |
| **Database** | **Neon Cloud** | Managed serverless PostgreSQL 16 instance with SSL connection pooling, relational domain `CHECK` constraints, and composite indexes |

---

## Key Features

- **Permission-Gated Single-Page Dashboard**: Regular users and admins share the same dashboard page and grid. Controls render dynamically based on `user.role` from `AuthContext`.
- **User & Admin Authentication**: JWT token-based authentication with password hashing using `bcrypt`.
- **Role-Based Permissions**:
  - `user` (Customer): Browse inventory, live search across maker/model, filter by category/price, purchase vehicles.
  - `admin` (Administrator): All user permissions + `+ Add Vehicle` button above grid, layered card controls (✏️ Edit, 🗑️ Delete with confirmation, ➕ Restock inventory).
- **Dynamic Search & Filtering**: Live text search (`q` parameter filtering `maker` OR `model`), category dropdown (`Sedan`, `SUV`, `Truck`, `Electric`, `Coupe`), and price range (`min_price`, `max_price`).
- **Real-Time Inventory Protection**: Purchasing decrements stock quantity by 1. Out-of-stock items (`quantity == 0`) render a greyed-out disabled Purchase button and are protected at DB level (`CHECK (quantity >= 0)`).
- **Smooth Scrolling & Back-To-Top Button**: Modern CSS `scroll-behavior: smooth` integrated with a floating cyan/blue Back-To-Top button that appears dynamically on page scroll.
- **Strict TDD Methodology**: Developed using Red -> Green -> Refactor cycle for both backend (`pytest`) and frontend (`Vitest` + RTL).

---

## Demo Credentials (Live & Local)

- **Administrator**: `admin@dealership.com` (`admin123`)
- **Regular Customer**: `user@dealership.com` (`user123`)

---

## Local Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -v --cov=app > ../backend_test_report.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm test > ../frontend_test_report.txt
npm run dev
```

---

## Test Report Summary (22/22 Tests Passing)

### Backend Pytest Suite — 18/18 Passed
- **Auth Module**: 6 passed (`test_auth.py`)
- **Vehicles Module**: 7 passed (`test_vehicles.py`)
- **Inventory Module**: 5 passed (`test_inventory.py`)
- Output log saved in [`backend_test_report.txt`](backend_test_report.txt).

### Frontend Vitest Suite — 4/4 Passed
- **VehicleCard Component**: 2 passed (renders details, disables Purchase button at 0 stock)
- **Navbar Component**: 2 passed (logged-out state, logged-in user state)
- Output log saved in [`frontend_test_report.txt`](frontend_test_report.txt).

---

## Deliverables & Documentation

- `PROMPTS.md`: Complete interactive prompt log.
- `schema.sql`: Hand-written DDL for PostgreSQL setup.
- `DEVELOPMENT_LOG.docx`: Comprehensive local logbook with styled IDE code blocks.
- `backend_test_report.txt`: Output log for backend pytest execution.
- `frontend_test_report.txt`: Output log for frontend Vitest execution.
- `render.yaml`: Infrastructure-as-code configuration manifest for Render.
- `frontend/vercel.json`: Single-page app routing manifest for Vercel.
