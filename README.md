# Car Dealership Inventory System (TDD Kata)

A full-stack Car Dealership Inventory System built following strict **Test-Driven Development (TDD)** principles, featuring a **FastAPI** backend with **PostgreSQL** relational database storage, **JWT authentication**, role-based access control (`user` and `admin`), and a single-page **React + Tailwind CSS** permission-gated dashboard.

---

## 100% Honest AI Usage & Ownership Statement

> **Transparent Disclosure on Human vs. AI Contributions**

### Human Direction & Conceptual Ownership (sunnyrajsu)
- **Architectural & Tech Stack Selection**: Conceptualized and chose the technology stack — FastAPI for high-performance Python microservices, PostgreSQL with relational domain `CHECK` constraints, and React 19 + Vite + Tailwind CSS for a modern single-page dashboard.
- **UI/UX Design & Aesthetic Vision**: Designed the single-page permission-gated dashboard layout (sharing one unified grid for regular users and admins, with layered admin controls), modern dark-mode aesthetic, color palette (cyan/blue gradient accents, slate dark backgrounds), and stock status pills (green "In Stock" / red "Out of Stock").
- **Implementation Strategy & Testing Process**: Designed the step-by-step TDD implementation roadmap (establishing the Red -> Green -> Refactor cycle, defining test-first boundaries for Auth, Vehicles, Inventory, and Frontend components, and setting up empirical report verification).

### AI Contribution & Code Generation (Gemini 3.6 Flash / Copilot)
- **Code Implementation**: Almost all backend Python code (`models`, `schemas`, `endpoints`, `security`), frontend React components (`Navbar`, `VehicleCard`, `FilterBar`, `AdminModal`, `RestockModal`, `AuthModal`, `ProfileModal`), and database seed scripts (`seed_data.py`) were written using AI code generation and inspiration.
- **TDD Test Fixtures**: AI generated the comprehensive pytest test suite (`test_auth.py`, `test_vehicles.py`, `test_inventory.py`) and Vitest + React Testing Library component tests (`App.test.jsx`).
- **Debugging & Error Resolutions**: AI diagnosed and fixed edge-case bugs encountered during audit (PostCSS v4 deprecation, OR-based search query logic, AuthProvider context state synchronization, and public catalog access).

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

## Tech Stack

- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic v2, PostgreSQL
- **Backend Testing**: `pytest`, `httpx` (FastAPI TestClient), `pytest-cov`
- **Authentication**: JWT (`python-jose`, `passlib` with `bcrypt`)
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Frontend Testing**: Vitest, React Testing Library, `jsdom`

---

## Local Setup Instructions

### Prerequisites
- PostgreSQL 14+ installed and running locally
- Python 3.11+
- Node.js 18+ & npm

---

### 1. Database Setup (PostgreSQL)

Open your PostgreSQL CLI (`psql`) as superuser:

```sql
CREATE ROLE dealership_admin WITH LOGIN PASSWORD 'dealership_pass';
CREATE DATABASE srs_dealership OWNER dealership_admin;
GRANT ALL PRIVILEGES ON DATABASE srs_dealership TO dealership_admin;
```

Run the schema DDL against `srs_dealership`:

```bash
psql -U dealership_admin -d srs_dealership -f schema.sql
```

---

### 2. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed 50 sample vehicles & demo accounts:
   ```bash
   python seed_data.py
   ```
5. Run automated test suite with coverage:
   ```bash
   pytest -v --cov=app > ../backend_test_report.txt
   ```
6. Start backend development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

### 3. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run component test suite:
   ```bash
   npm test > ../frontend_test_report.txt
   ```
4. Start Vite development server:
   ```bash
   npm run dev
   ```

---

## Demo Credentials (Pre-Seeded)

- **Administrator**: `admin@dealership.com` (`admin123`)
- **Regular Customer**: `user@dealership.com` (`user123`)

---

## Screenshots

> Drop screenshot images into the `docs/` folder to view them rendered below.

![Dashboard View](docs/dashboard.png)
*Figure 1: Main Dealership Inventory Dashboard displaying available vehicle stock.*

![Vehicle Search & Filtering](docs/search_filter.png)
*Figure 2: Integrated top bar search and filter controls by maker, model, category, and price range.*

![Admin Controls & Restock](docs/admin_modal.png)
*Figure 3: Administrator layered card controls (Edit, Delete, Restock) and modal interfaces.*

![Auth & Profile Flow](docs/auth_flow.png)
*Figure 4: User authentication modal and profile dropdown menu.*

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
- `DEVELOPMENT_LOG.docx`: Private local logbook documenting development iterations.
- `backend_test_report.txt`: Output log for backend pytest execution.
- `frontend_test_report.txt`: Output log for frontend Vitest execution.
