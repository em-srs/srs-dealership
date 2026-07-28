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
