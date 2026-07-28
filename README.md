# Car Dealership Inventory System (TDD Kata)

A full-stack Car Dealership Inventory System built following strict **Test-Driven Development (TDD)** principles, featuring a **FastAPI** backend with **PostgreSQL** relational database storage, **JWT authentication**, role-based access control (`user` and `admin`), and a **React + Tailwind CSS** frontend.

---

## Features

- **User & Admin Authentication**: JWT token-based authentication with password hashing using `bcrypt`.
- **Role-Based Access Control**:
  - `user`: Browse vehicles, search & filter inventory, purchase vehicles.
  - `admin`: Full CRUD permissions, delete vehicles, and restock vehicle inventory.
- **Dynamic Search & Filtering**: Filter inventory by make, model, category, minimum price, and maximum price.
- **Inventory Protection**: Purchasing decrements stock quantity by 1. Out-of-stock items (`quantity == 0`) block purchase attempts at both application and database layers (`CHECK (quantity >= 0)`).
- **Strict TDD Cycle**: Developed using Red -> Green -> Refactor methodology for both backend (`pytest`) and frontend (`Vitest` + RTL).

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
4. Verify environment configuration (`.env`):
   ```env
   DATABASE_URL=postgresql://dealership_admin:dealership_pass@localhost:5432/srs_dealership
   TEST_DATABASE_URL=postgresql://dealership_admin:dealership_pass@localhost:5432/srs_dealership
   SECRET_KEY=supersecretkeyforjwtauthenticationdealership12345
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```
5. Run tests:
   ```bash
   pytest
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
   npm test
   ```
4. Start Vite development server:
   ```bash
   npm run dev
   ```

---

## Test Report

### Backend Test Suite (`pytest`)
- **Total Tests**: 18 passed
- **Auth Module**: 6 passed (`test_auth.py`)
- **Vehicles Module**: 7 passed (`test_vehicles.py`)
- **Inventory Module**: 5 passed (`test_inventory.py`)

```
======================= 18 passed in 9.18s =======================
```

---

## My AI Usage

### AI Tools Employed
- **Gemini 3.6 Flash (High)** via Google DeepMind Agentic Assistant CLI.

### How AI Was Used
1. **Boilerplate & Test Generation**: Used AI to scaffold initial FastAPI endpoints, Pydantic schemas, and write comprehensive pytest and Vitest test fixtures.
2. **Database Schema Design**: Assisted in drafting DDL schema with domain `CHECK` constraints to ensure strict data validation at the database layer.
3. **Refactoring**: Assisted in modernizing Pydantic v1 configurations to Pydantic v2 `ConfigDict` and resolving package deprecation warnings.
4. **Git Workflow Integration**: Automatically maintained Conventional Commit standards and tracked interaction history in `PROMPTS.md`.

### Reflection on AI Impact
Leveraging AI inside a strict Test-Driven Development (TDD) workflow significantly accelerated the Red-Green-Refactor loop. Writing failing tests first with AI assistance ensured high test coverage without sacrificing code quality or architectural cleanliness.

---

## Deliverables & Documentation

- `PROMPTS.md`: Complete interactive prompt log.
- `schema.sql`: Hand-written DDL for PostgreSQL setup.
- `DEVELOPMENT_LOG.docx`: Private local logbook documenting development iterations.
