# Comprehensive AI Interaction Log & Prompt History (PROMPTS.md)

This document provides a detailed, chronological record of all prompts, instructions, system directives, architectural decisions, and AI actions executed throughout the development of the **Car Dealership Inventory System**.

---

## Project Specifications & Core Directives

- **Target System**: Car Dealership Inventory System
- **Architecture**: Full-Stack (FastAPI + PostgreSQL + React SPA + Tailwind CSS)
- **Methodology**: Strict Test-Driven Development (Red -> Green -> Refactor cycle)
- **Git Authorship**: Exclusive human authorship (`sunnyrajsu <sunnyrajrvr@gmail.com>`) with trailer `Co-authored-by: AI Assistant <copilot@users.noreply.github.com>`.

---

## Chronological Interactive Prompt Log

### Phase 1: Database & Environment Setup
- **User Prompt**:
  > "System Role: You are an expert Full-Stack Developer (FastAPI + React + PostgreSQL) and a strict practitioner of Test-Driven Development (TDD). You are tasked with building a Car Dealership Inventory System... FIRST READ the 'TDD Kata for srs-dealership.docx' and then the implementation plan start according to the instructions given above."
- **Context & Intent**: Initialize repository, establish TDD approval loop, verify Git author identity (`sunnyrajsu`), and provide PostgreSQL DDL commands for `srs_dealership` database and `dealership_admin` role.
- **AI Actions Executed**:
  1. Inspected `TDD Kata for srs-dealership.docx` using Python `zipfile` XML parsing.
  2. Verified Git user configuration (`sunnyrajsu <sunnyrajrvr@gmail.com>`).
  3. Created `schema.sql` with strict database-level `CHECK` constraints (`quantity >= 0`, `price >= 0`, `role IN ('user', 'admin')`).
  4. Scaffolded Python virtual environment in `backend/venv` and installed dependencies (`fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `pydantic`, `python-jose`, `passlib`, `pytest`, `httpx`).
  5. Created `backend/app/core/config.py`, `backend/app/db/database.py`, `.env`, and `backend/tests/conftest.py` with PostgreSQL session isolation fixtures.

---

### Phase 2: Backend Auth Module (TDD Cycle 1)

#### RED Phase
- **User Prompt**:
  > "i did all the sql things in my windows terminal, now tell me what to do next?"
- **Context & Intent**: Execute RED Phase for authentication endpoints (`POST /api/auth/register` and `POST /api/auth/login`).
- **Failing Tests Written (`backend/tests/test_auth.py`)**:
  - `test_register_user_success`: Register regular user (`user@example.com`), expect 201 Created.
  - `test_register_admin_success`: Register admin user (`admin@example.com`), expect 201 Created.
  - `test_register_duplicate_email_fails`: Register duplicate email, expect 400 Bad Request ("Email already registered").
  - `test_login_success`: Valid login returns JWT token (`access_token`, `token_type: "bearer"`).
  - `test_login_invalid_password_fails`: Wrong password returns 401 Unauthorized ("Invalid credentials").
  - `test_login_nonexistent_user_fails`: Unregistered email returns 401 Unauthorized.
- **Empirical Test Verification**: Ran `pytest tests/test_auth.py` -> 6/6 tests failed with HTTP 404 Not Found (RED).
- **Approval Checkpoint**: Explicitly requested and received user approval.
- **Git Action**: Committed & force-pushed to GitHub (`test: add failing unit tests for auth register and login endpoints`).

#### GREEN & REFACTOR Phase
- **User Prompt**:
  > "yes but also keep in mind that..." (Instructions on co-author formatting and Git history rewrite).
- **Implementation Code Delivered**:
  - `backend/app/models/user.py`: SQLAlchemy `User` model mapping to `users` table.
  - `backend/app/schemas/user.py` & `token.py`: Pydantic v2 schemas with `ConfigDict(from_attributes=True)` and `email-validator`.
  - `backend/app/core/security.py`: Password hashing using `passlib` + `bcrypt` and JWT encoding using `python-jose`.
  - `backend/app/api/deps.py`: `get_current_user` and `require_admin` dependency injections.
  - `backend/app/api/endpoints/auth.py`: Implemented `/register` and `/login` handlers.
- **Empirical Test Verification**: Ran `pytest tests/test_auth.py` -> 6/6 tests **PASSED** (GREEN).
- **Git History Correction**: Executed `git filter-branch` to apply exact `Co-authored-by: AI Assistant <copilot@users.noreply.github.com>` trailer across all commits.
- **Git Action**: Committed & pushed (`feat: implement user registration and login endpoints`).

---

### Phase 3: Vehicles Module (TDD Cycle 2)

#### RED Phase
- **User Prompt**:
  > "yes" (Proceeding to Vehicles module).
- **Failing Tests Written (`backend/tests/test_vehicles.py`)**:
  - `test_create_vehicle_success`: Authenticated user creates vehicle, expects 201 Created.
  - `test_create_vehicle_unauthenticated_fails`: Request without token expects 401 Unauthorized.
  - `test_get_all_vehicles`: Fetching all vehicles expects HTTP 200 OK.
  - `test_search_vehicles_filters`: Search by make (`Toyota`) and max price (`30000`) returns filtered list.
  - `test_update_vehicle_success`: `PUT /api/vehicles/{id}` updates price and quantity.
  - `test_delete_vehicle_admin_only_success`: Admin deletes vehicle, expects HTTP 200 OK.
  - `test_delete_vehicle_regular_user_forbidden`: Regular user deletion attempt expects 403 Forbidden ("Admin privileges required").
- **Empirical Test Verification**: Ran `pytest tests/test_vehicles.py` -> 7/7 tests failed with 404 / KeyError (RED).
- **Approval Checkpoint**: Explicitly requested and received user approval.
- **Git Action**: Committed & pushed (`test: add failing unit tests for vehicles CRUD and search endpoints`).

#### GREEN & REFACTOR Phase
- **User Prompt**:
  > "yes"
- **Implementation Code Delivered**:
  - `backend/app/models/vehicle.py`: SQLAlchemy `Vehicle` model (`make`, `model`, `year`, `category`, `price`, `quantity`).
  - `backend/app/schemas/vehicle.py`: Pydantic v2 validation schemas (`VehicleCreate`, `VehicleUpdate`, `VehicleResponse`).
  - `backend/app/api/endpoints/vehicles.py`: CRUD endpoints and dynamic search query builder.
- **Empirical Test Verification**: Ran `pytest tests/test_auth.py tests/test_vehicles.py` -> 13/13 tests **PASSED** (GREEN).
- **Git Action**: Committed & pushed (`feat: implement vehicles CRUD and search filtering endpoints`).

---

### Phase 4: Inventory Module (TDD Cycle 3)

#### RED Phase
- **User Prompt**:
  > "start" / "add documentations further in the logbook and also explain here"
- **Failing Tests Written (`backend/tests/test_inventory.py`)**:
  - `test_purchase_vehicle_success`: Purchase vehicle with `quantity=2` -> quantity decreases to 1.
  - `test_purchase_vehicle_out_of_stock_fails`: Purchase vehicle with `quantity=0` -> blocked with 400 Bad Request ("Vehicle out of stock").
  - `test_purchase_nonexistent_vehicle_fails`: Purchase missing vehicle -> 404 Not Found.
  - `test_restock_vehicle_admin_success`: Admin restocks vehicle by `amount=5` -> quantity increases.
  - `test_restock_vehicle_regular_user_forbidden`: Regular user restock attempt -> 403 Forbidden.
- **Empirical Test Verification**: Ran `pytest tests/test_inventory.py` -> 5/5 tests failed (RED).
- **Approval Checkpoint**: Explicitly requested and received user approval.
- **Git Action**: Committed & pushed (`test: add failing unit tests for inventory purchase and restock endpoints`).

#### GREEN & REFACTOR Phase
- **User Prompt**:
  > "push with appropriate feats"
- **Implementation Code Delivered**:
  - Added `purchase_vehicle` (`POST /api/vehicles/{id}/purchase`) with stock depletion check.
  - Added `restock_vehicle` (`POST /api/vehicles/{id}/restock`) with `require_admin` dependency.
- **Empirical Test Verification**: Ran `pytest tests/test_auth.py tests/test_vehicles.py tests/test_inventory.py` -> 18/18 tests **PASSED** (GREEN).
- **Git Action**: Committed & pushed (`feat: implement vehicle purchase and restock inventory endpoints`).

---

### Phase 5: Frontend Module (TDD Cycle 4)

#### RED Phase
- **User Prompt**:
  > "first updte the prompts, readme, and development log" / "i need detailed prompt, and development logs, especially the prompts.md"
- **Scaffolding & Configuration Executed**:
  - Scaffolded React 19 + Vite app in `frontend/`.
  - Installed Tailwind CSS, Lucide icons, Vitest, and React Testing Library.
  - Configured `tailwind.config.js`, `postcss.config.js`, `vite.config.js`, `src/index.css`, and `src/test/setup.js`.
- **Failing Component Tests Written (`frontend/src/test/App.test.jsx`)**:
  - `VehicleCard`: Verifies rendering of details and disabled "Out of Stock" button when `quantity == 0`.
  - `Navbar`: Verifies brand title, login links, user identity, and admin badge display.
- **Empirical Test Verification**: Ran `npm test` -> Vitest failed due to missing components (RED).
- **Approval Checkpoint**: Awaiting approval to commit RED phase.
