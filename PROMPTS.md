# AI Interaction Log & Prompt History (PROMPTS.md)

This log documents all prompts and interactive workflows used in building the **Car Dealership Inventory System**.

---

## Module 1: Database & Environment Setup
- **Prompt**: Requested project setup, confirmation of strict Git authorship and TDD approval workflow, and `psql` instructions to create `srs_dealership` database and `dealership_admin` role.
- **AI Action**: Provided DDL `schema.sql` with domain `CHECK` constraints, setup backend directory structure, `requirements.txt`, `.env`, and test fixtures in `backend/tests/conftest.py`.

---

## Module 2: Backend Auth Module (TDD Cycle 1)
- **Prompt (RED Phase)**: Write failing unit tests for user registration (`/api/auth/register`) and login (`/api/auth/login`).
- **AI Action**: Created `backend/tests/test_auth.py` with 6 test cases testing user registration, admin registration, duplicate email rejection, login success, invalid password rejection, and nonexistent user failure. All 6 tests failed with HTTP 404 (RED).
- **Commit (RED)**: `test: add failing unit tests for auth register and login endpoints`

- **Prompt (GREEN Phase)**: Implement minimum code to pass all 6 auth tests, refactor for Pydantic v2 `ConfigDict` cleanliness, and push GREEN commit.
- **AI Action**: Implemented `User` model, Pydantic schemas (`UserCreate`, `UserResponse`, `LoginRequest`, `Token`), `passlib` bcrypt password hashing, `python-jose` JWT creation, auth dependencies (`get_current_user`, `require_admin`), and endpoints in `app/api/endpoints/auth.py`. All 6 tests passed (GREEN).
- **Commit (GREEN)**: `feat: implement user registration and login endpoints`

---

## Module 3: Vehicles Module (TDD Cycle 2)
- **Prompt (RED Phase)**: Write failing unit tests for vehicle CRUD operations and search filtering.
- **AI Action**: Created `backend/tests/test_vehicles.py` with 7 test cases covering vehicle creation, unauthenticated rejection, fetching all vehicles, dynamic search filtering (by make, model, category, and price range), updating vehicle details, admin-only deletion, and regular user deletion prohibition (403 Forbidden). All 7 tests failed (RED).
- **Commit (RED)**: `test: add failing unit tests for vehicles CRUD and search endpoints`

- **Prompt (GREEN Phase)**: Implement minimum code to pass all 7 vehicle tests, integrate search query building, enforce admin privileges on deletion, and verify test suite passes.
- **AI Action**: Implemented `Vehicle` model, Pydantic schemas (`VehicleCreate`, `VehicleUpdate`, `VehicleResponse`), and endpoints in `app/api/endpoints/vehicles.py`. Registered router in `main.py`. All 13 tests passed (GREEN).
- **Commit (GREEN)**: `feat: implement vehicles CRUD and search filtering endpoints`

---

## Module 4: Inventory Module (TDD Cycle 3)
- **Prompt (RED Phase)**: Write failing unit tests for `/purchase` and `/restock` endpoints.
- **AI Action**: Created `backend/tests/test_inventory.py` with 5 test cases covering stock decrement on purchase, stock depletion blocking at 0 quantity (HTTP 400), 404 handling, admin stock restocking, and regular user restocking prohibition (403 Forbidden). All 5 tests failed (RED).
- **Commit (RED)**: `test: add failing unit tests for inventory purchase and restock endpoints`

- **Prompt (GREEN Phase)**: Implement `/purchase` and `/restock` endpoints in `app/api/endpoints/vehicles.py`, enforce database & application level quantity guards, and verify full test suite passes.
- **AI Action**: Implemented `purchase_vehicle` and `restock_vehicle` endpoints. Verified all 18 backend tests passed (GREEN).
- **Commit (GREEN)**: `feat: implement vehicle purchase and restock inventory endpoints`
