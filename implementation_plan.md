# Implementation Plan - Car Dealership Inventory System (TDD Kata)

Full-stack Car Dealership Inventory System built with Test-Driven Development,
a FastAPI backend on PostgreSQL, role-based access control, a React + Tailwind
frontend, and transparent AI co-authorship documentation.

---

## Confirmed Tech Stack

- **Backend**: Python 3.11+ + FastAPI + Pydantic v2 + SQLAlchemy ORM + **PostgreSQL** (`srs_dealership` database)
- **Backend Testing (TDD)**: `pytest` + `httpx` (FastAPI TestClient) + `pytest-cov`
- **Authentication**: JWT (via `python-jose` + `passlib`/`bcrypt`) with `user` and `admin` roles
- **Frontend**: React (JavaScript, `.jsx`) + Vite + Tailwind CSS
- **Frontend Testing**: Vitest + React Testing Library

**Why Postgres over SQLite:** the kata explicitly states an in-memory DB isn't sufficient, and a real relational database with constraints (unique emails, quantity CHECK ≥ 0) is a stronger, more "production-realistic" signal. It also lets us showcase real SQL/JOIN skills already held going into this project.

---

## Progress So Far

- [x] PostgreSQL installed, `psql` added to PATH permanently
- [x] Database `srs_dealership` created
- [x] Dedicated role `dealership_admin` created and granted privileges
- [x] `schema.sql` written and executed (`users`, `vehicles` tables)
- [x] Backend project scaffolded & database connected
- [ ] Everything else below

---

## Guided TDD Execution Strategy

```
      RED (write failing test)
            |
            v
      GREEN (minimal code to pass)
            |
            v
      REFACTOR (clean up, re-run tests)
            |
            v
      COMMIT (with AI co-author trailer if applicable)
```

Every phase is explained conceptually before writing code, so the reasoning
behind each decision can be explained in an interview, not just the code
itself.

---

## Architecture & Directory Structure

```
D:\CODINGBRO\srs-dealership\
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py            # get_current_user, require_admin
│   │   │   └── endpoints/
│   │   │       ├── auth.py        # /api/auth/register, /api/auth/login
│   │   │       ├── vehicles.py    # CRUD + /search
│   │   │       └── inventory.py   # /purchase, /restock
│   │   ├── core/
│   │   │   ├── config.py          # settings, secret key, token expiry (from .env)
│   │   │   └── security.py        # password hashing, JWT encode/decode
│   │   ├── db/
│   │   │   ├── database.py        # SQLAlchemy engine/session (connects to Postgres)
│   │   │   └── init_db.py         # optional: seed an admin user
│   │   ├── models/                # SQLAlchemy models: User, Vehicle
│   │   ├── schemas/                # Pydantic schemas: UserCreate, VehicleOut, etc.
│   │   ├── services/               # business logic: vehicle_service, inventory_service
│   │   └── main.py                 # FastAPI app, CORS, router registration
│   ├── tests/
│   │   ├── conftest.py            # test DB fixture, test client, token fixtures
│   │   ├── test_auth.py
│   │   ├── test_vehicles.py
│   │   └── test_inventory.py
│   ├── schema.sql                  # hand-written DDL (source of truth for tables)
│   ├── .env                        # DB_URL, JWT_SECRET (gitignored)
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── api/                    # fetch wrapper + auth token interceptor
│   │   ├── components/             # Navbar, VehicleCard, FilterBar, AdminModal
│   │   ├── context/                 # AuthContext.jsx
│   │   ├── pages/                   # Home, Login, Register, AdminDashboard
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── PROMPTS.md
└── README.md
```

---

## Step-by-Step Roadmap

### Step 1: Repository & Environment (mostly done)
- [x] Postgres running, database + role created
- [x] `git init`, `.gitignore`, `PROMPTS.md` started
- [x] `schema.sql` finalized and run against `srs_dealership`
- [x] Python venv + backend dependencies installed
- [ ] React + Vite + Tailwind scaffolded (after backend is stable)

### Step 2: Backend Auth Module (TDD Cycle 1) - [x] Completed
1. **RED** — `tests/test_auth.py`: failing tests for register (duplicate email rejected, password hashed) and login (correct/incorrect credentials, JWT returned).
2. **GREEN** — SQLAlchemy `User` model (mirrors `users` table), Pydantic schemas, password hashing, JWT issuing, the two endpoints.
3. **REFACTOR** — extract `get_current_user` / `require_admin` into `deps.py`.
4. **COMMIT** — with AI co-author trailer where applicable.

### Step 3: Vehicles Module (TDD Cycle 2)
1. **RED** — `tests/test_vehicles.py`: list, search (make/model/category/price range), create, update, delete (admin-only).
2. **GREEN** — `Vehicle` model, schemas, dynamic search query building, admin guard on delete.
3. **REFACTOR** — move query/business logic into `services/vehicle_service.py`.
4. **COMMIT**.

### Step 4: Inventory Module (TDD Cycle 3)
1. **RED** — `tests/test_inventory.py`: purchase decrements quantity, blocked at 0 (400), restock increments (admin-only).
2. **GREEN** — endpoints with the `CHECK (quantity >= 0)` constraint as a DB-level safety net, plus an explicit application-level check for a clean error message.
3. **REFACTOR** — consistent error response shape across endpoints.
4. **COMMIT**.

### Step 5: Frontend
1. Scaffold Vite + React + Tailwind.
2. `AuthContext.jsx` — login/logout, JWT persisted, attached to requests.
3. Components: `Navbar`, `VehicleCard` (Purchase button disabled at qty 0), `FilterBar`, admin CRUD forms.
4. Vitest + RTL tests for key components.

### Step 6: Documentation & Deliverables
1. Run `pytest -v --cov=app` and `npm test`, capture output for the README.
2. Fill in `PROMPTS.md` with the real prompt history.
3. Write `README.md`: setup instructions, API reference, screenshots, test report, mandatory **"My AI Usage"** section.

---

## Verification Plan

**Automated:**
- `cd backend && pytest -v --cov=app`
- `cd frontend && npm test`

**Manual:**
- Backend: `uvicorn app.main:app --reload`
- Frontend: `npm run dev`
- User flow: register → login → search/filter → purchase → hits 0 stock → button disabled
- Admin flow: login as admin → add vehicle → edit → restock → delete
