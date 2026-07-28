# Car Dealership Inventory System (TDD Kata)

A full-stack Car Dealership Inventory System built following strict **Test-Driven Development (TDD)** principles, featuring a **FastAPI** backend with **Neon PostgreSQL** cloud database storage, **JWT authentication**, role-based access control (`user` and `admin`), and a single-page **React 19 + Tailwind CSS** permission-gated dashboard.

---

## 🌐 Live Production URLs

- 🚀 **Live Production Dashboard (Frontend SPA)**: [https://srs-dealership.vercel.app](https://srs-dealership.vercel.app)
- ⚙️ **Live Production API (Backend Service)**: [https://drivehub-dealership.onrender.com](https://drivehub-dealership.onrender.com)
- 🗄️ **Live Cloud Database**: **Neon Serverless PostgreSQL** (51 vehicles seeded + demo accounts)

---

## 100% Honest AI Usage & Ownership Statement

> **Transparent Disclosure on Human vs. AI Contributions**

### Human Direction & Conceptual Ownership (sunnyrajsu)
- **Architectural & Tech Stack Selection**: Conceptualized and selected the technology stack — FastAPI for high-performance Python microservices, PostgreSQL with relational domain `CHECK` constraints, and React 19 + Vite + Tailwind CSS for a modern single-page dashboard.
- **UI/UX Design & Aesthetic Vision**: Designed the single-page permission-gated dashboard layout (sharing one unified grid for regular users and admins, with layered admin controls), modern dark-mode aesthetic, color palette (cyan/blue gradient accents, slate dark backgrounds), and stock status pills (green "In Stock" / red "Out of Stock").
- **Implementation Strategy & Testing Process**: Designed the step-by-step TDD implementation roadmap (establishing the Red -> Green -> Refactor cycle, defining test-first boundaries for Auth, Vehicles, Inventory, and Frontend components, and setting up empirical report verification).

### AI Contribution & Code Generation (Gemini 3.6 Flash / Copilot)
- **Code Implementation**: Almost all backend Python code (`models`, `schemas`, `endpoints`, `security`), frontend React components (`Navbar`, `VehicleCard`, `FilterBar`, `AdminModal`, `RestockModal`, `AuthModal`, `ProfileModal`), and database seed scripts (`seed_data.py`) were written using AI code generation and inspiration.
- **TDD Test Fixtures**: AI generated the comprehensive pytest test suite (`test_auth.py`, `test_vehicles.py`, `test_inventory.py`) and Vitest + React Testing Library component tests (`App.test.jsx`).
- **Debugging & Cloud Deployment Setup**: AI diagnosed and fixed edge-case bugs encountered during audit (PostCSS v4 deprecation, OR-based search query logic, AuthProvider context state synchronization, Neon DB deployment scripts, Render `render.yaml` manifests, and Vercel `vercel.json` SPA configurations).

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
