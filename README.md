# 🚗 Car Dealership Inventory System

A production-ready full-stack vehicle inventory management system built using **FastAPI**, **React 19**, **PostgreSQL (Neon)** and **JWT Authentication**, following a strict **Test-Driven Development (TDD)** workflow.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)
![Coverage](https://img.shields.io/badge/Coverage-93%25-brightgreen)
![Tests](https://img.shields.io/badge/Tests-37_Passing-success)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎥 Live Demo

- **Live Application:** [https://srs-dealership.vercel.app](https://srs-dealership.vercel.app)
- **Backend API:** [https://drivehub-dealership.onrender.com](https://drivehub-dealership.onrender.com)
- **Video Walkthrough (2–3 minutes):** [https://drive.google.com/file/d/1DKW8sRqNYMx0oeQTn5PxvSK0mQPkqPs7/view?usp=drive_link](https://drive.google.com/file/d/1tpiJn5c21oQO9OwF0w10JjRMPwBev-ja/view?usp=sharing)
- **Live Cloud Database:** **Neon Serverless PostgreSQL** (51 vehicles seeded + demo accounts)

### 🔑 Demo Credentials
- **Administrator**: `admin@dealership.com` (`admin123`)
- **Regular Customer**: `user@dealership.com` (`user123`)

---

## ✨ Key Features

- **Permission-Gated Single-Page Dashboard**: Customers and administrators share the same single-page dashboard. Controls render dynamically based on `user.role` from `AuthContext`.
- **JWT Authentication & Security**: Password hashing with `bcrypt`, token expiration, and role authorization.
- **Dedicated Search & Filter Bar**: Sleek dark glassmorphism card featuring Maker/Brand, Model, Category, Year, Sort By, and an indigo/blue **Filter & Sort** action button.
- **Brand-Grouped Admin Inventory Controls**: For administrators, clicking **`Manage Inventory`** opens a dedicated inventory management view grouping vehicles by their Brand/Maker (e.g., `Mercedes-Benz`, `Honda`, `BMW`, `Audi`, `Toyota`, etc.), complete with stock summaries and inline `Edit`, `Restock`, and `Delete` action controls.
- **Dynamic E-Commerce Catalog Metrics Banner**: Real-time stats header displaying total Brands, Vehicle Models, and Categories (`Browse among X Brands in Y Vehicles across Z Categories`).
- **Role-Based Permissions**:
  - `user` (Customer): Browse inventory, live search across maker/model, filter by category/price range, purchase vehicles, view personal purchase history in profile.
  - `admin` (Administrator): All customer capabilities + **`Manage Inventory`** view toggle, `+ Add New Vehicle` modal, vehicle editing, stock restocking, and deletion with confirmation.
- **INR Currency Formatting**: All vehicle prices formatted in **INR (₹)** with Lakhs/Crores grouping logic (`Intl.NumberFormat('en-IN')`).
- **Client-Side Vehicle Sorting**: Interactive sorting dropdown by price (Low to High, High to Low), year, and model name.
- **Purchase Checkout & History Module**: Interactive checkout modal taking buyer details (`buyer_name`, `buyer_phone`, `delivery_address`, `note`), price snapshotting (`price_at_purchase`), and purchase history log accessible via profile.
- **Real-Time Inventory Protection**: Stock depletion guard (`quantity >= 0`), greyed-out disabled Purchase buttons when out-of-stock (`quantity == 0`), and database-level `CHECK` constraints.
- **Automated Secret Scanning**: Local Git pre-commit scanner hook preventing secret/key exposure.
- **Full Mobile Responsiveness**: Mobile-friendly hamburger navigation drawer and responsive grid layouts.

---

## 📸 Application Screenshots

A walkthrough of the live production app ([srs-dealership.vercel.app](https://srs-dealership.vercel.app)), from a guest's first visit through customer purchase flow and admin inventory management.

### Guest Access & Authentication

| | |
| :---: | :---: |
| ![Guest view - authentication required](images/01-guest-authentication-required.png) | ![Login modal](images/02-login-modal.png) |
| **Guarded Dashboard (Guest State)** — Before logging in, the catalog is locked behind an "Authentication Required" panel. Guests see the `Login / Register` control in the navbar but no vehicle data, pricing, or search is exposed until authenticated. | **Login Modal** — The "Welcome Back" login form, here mid-entry with the demo customer account (`user@dealership.com`). |

![Guest view - authentication required (catalog empty state)](images/03-guest-authentication-required-alt.png)

*The same locked catalog state shown again immediately before login — confirming no vehicle cards, prices, or filters render for unauthenticated visitors.*

### Customer Experience

![Customer dashboard after login](images/04-customer-dashboard.png)

**Customer Dashboard (Logged In as Customer)** — Once authenticated, the full Vehicle Inventory Catalog unlocks: the stats banner ("Browse among Brands, Vehicles, and Categories"), live search/filter/sort controls, and a grid of vehicle cards with INR-formatted pricing and stock-availability pills. Regular users see only a **Purchase Vehicle** button per card — no Edit, Delete, or Restock controls, since those are admin-gated.

![Purchase checkout modal](images/08-purchase-checkout-modal.png)

**Purchase Checkout Modal** — Clicking "Purchase Vehicle" opens the checkout form, showing the selected vehicle's unit price and total cost, with fields for full name, phone number, quantity (capped at available stock), delivery address, and an optional delivery note. Submitting calls `POST /api/vehicles/{id}/purchase`, which snapshots `price_at_purchase` and decrements stock.

![Profile modal with purchase history tab](images/05-profile-modal.png)

**Profile Modal — Purchase History** — The account profile shows the logged-in user's email, assigned role (`User`), and security status, alongside an **Account Info** / **Purchase History** tab toggle so customers can review their own past orders in isolation from other users.

### Administrator Experience

![Admin dashboard with elevated controls](images/06-admin-dashboard.png)

**Admin Dashboard (Logged In as Admin)** — The same catalog view, but with elevated permissions rendered dynamically from `user.role`: a **+ Add Vehicle** action above the grid, and per-card **Restock**, **Edit**, and **Delete** controls that are completely absent from the customer view above.

| | |
| :---: | :---: |
| ![Add new vehicle modal](images/07-add-vehicle-modal.png) | ![Restock inventory modal](images/09-restock-modal.png) |
| **Add New Vehicle Modal** — Admin-only form (`Maker/Brand`, `Model`, `Year`, `Category`, `Price`, `Initial Stock Quantity`) that calls `POST /api/vehicles` to create a new catalog entry. | **Restock Inventory Modal** — Admin-only form showing the current stock quantity for a selected vehicle with an input for additional units, calling `POST /api/vehicles/{id}/restock`. |

---

## 🏗️ Architecture & System Diagrams

### High-Level System Architecture
```text
React SPA (Vercel) ──► FastAPI Backend (Render) ──► Neon PostgreSQL (Cloud DB)
```

```mermaid
graph TD
    A[React 19 SPA - Vercel] -->|HTTPS REST API / JSON| B[FastAPI Backend - Render]
    B -->|SQLAlchemy / psycopg2| C[(Neon Serverless PostgreSQL)]
    B -->|bcrypt / python-jose| D[JWT Auth & RBAC Guard]
    B -->|pydantic-settings| E[.env Configuration]
```

### 🔄 System Data Flow Diagram
The data flow diagram depicts the end-to-end request lifecycle from user interaction in the React single-page frontend to FastAPI security pipeline verification and database persistence:

```mermaid
graph TD
    subgraph Client Layer [Frontend - React 19 SPA]
        UI[React Dashboard Components]
        AC[Auth Context & State Provider]
        API_CLIENT[Axios / Fetch API Client]
        UI -->|Triggers User Action| AC
        AC -->|Attaches Bearer Token Header| API_CLIENT
    end

    subgraph Middleware & Gateway [FastAPI Infrastructure]
        CORS[CORS Middleware]
        ROUTER[APIRouter Dispatcher]
        API_CLIENT -->|HTTPS Request with JSON / Bearer| CORS
        CORS --> ROUTER
    end

    subgraph Security & Dependency Layer [FastAPI Security Pipeline]
        JWT_GUARD[JWT Token Verification]
        RBAC_GUARD[Role-Based Access Control]
        DB_DEP[SQLAlchemy Session Injector]
        ROUTER --> DB_DEP
        ROUTER --> JWT_GUARD
        JWT_GUARD --> RBAC_GUARD
    end

    subgraph Business Logic Layer [Backend Routers & Services]
        AUTH_EP[Auth Endpoints]
        VEHICLE_EP[Vehicle Endpoints]
        PURCHASE_EP[Purchase Endpoints]
        SERVICE[Purchase & Inventory Services]
        ORM[SQLAlchemy Models]
        
        RBAC_GUARD --> AUTH_EP
        RBAC_GUARD --> VEHICLE_EP
        RBAC_GUARD --> PURCHASE_EP
        
        VEHICLE_EP --> SERVICE
        PURCHASE_EP --> SERVICE
        AUTH_EP --> ORM
        SERVICE --> ORM
    end

    subgraph Database Layer [Cloud Managed Database]
        DB[(Neon PostgreSQL Serverless)]
        ORM -->|SQL Queries via psycopg2| DB
    end
```

---

### 🗺️ User Flow & Journey Diagram
The flowchart illustrates the dual-role user experience — from unauthenticated guest access through customer checkout and administrator inventory management:

```mermaid
flowchart TD
    Start([User visits Application]) --> CheckAuth{Is Authenticated?}
    
    %% Unauthenticated Flow
    CheckAuth -- No --> GuestView[Locked Dashboard Banner]
    GuestView --> OpenAuthModal[Click Login / Register]
    OpenAuthModal --> SubmitAuthForm{Submit Credentials}
    SubmitAuthForm -- Validation Fail --> AuthError[Show Error Notification]
    AuthError --> OpenAuthModal
    SubmitAuthForm -- Success --> IssueJWT[Store JWT & Update AuthContext State]
    IssueJWT --> CheckRole

    %% Authenticated Flow
    CheckAuth -- Yes --> CheckRole{User Role?}

    %% Customer Journey
    CheckRole -- Customer (role: user) --> CustomerDash[Customer Catalog View]
    CustomerDash --> SearchFilter[Use Search & Category Filter Bar]
    SearchFilter --> ViewCards[Browse Vehicle Cards & Prices]
    ViewCards --> ClickBuy{Click Purchase Vehicle}
    ClickBuy --> PurchaseModal[Fill Checkout Form: Name, Phone, Address, Quantity]
    PurchaseModal --> SubmitPurchase[POST /api/vehicles/{id}/purchase]
    SubmitPurchase -- Out of Stock / Invalid --> PurchaseErr[Show Error Notification]
    SubmitPurchase -- Success --> StockDecremented[Stock Decremented & Purchase Snapshot Saved]
    StockDecremented --> ViewHistory[View Order in Profile Purchase History Tab]

    %% Admin Journey
    CheckRole -- Administrator (role: admin) --> AdminDash[Admin Catalog View with Elevated Controls]
    AdminDash --> ToggleView{Select Action}
    ToggleView -- Add Vehicle --> AddModal[+ Add New Vehicle Modal] --> POST_Vehicle[POST /api/vehicles]
    ToggleView -- Manage Inventory --> InventoryGroup[Brand-Grouped Inventory View]
    InventoryGroup --> RestockAction[Click Restock] --> RestockModal[Restock Quantity Form] --> POST_Restock[POST /api/vehicles/{id}/restock]
    InventoryGroup --> EditAction[Click Edit] --> EditModal[Edit Vehicle Details Form] --> PUT_Vehicle[PUT /api/vehicles/{id}]
    InventoryGroup --> DeleteAction[Click Delete] --> DeleteConfirm[Delete Confirmation Prompt] --> DEL_Vehicle[DELETE /api/vehicles/{id}]
    
    POST_Vehicle & POST_Restock & PUT_Vehicle & DEL_Vehicle --> UpdateUI[Live Catalog Refresh & State Re-render]
```

---

## 🔑 JWT Authentication & Security Workflow

### How JWT Authentication Works in this Project

1. **User Authentication & Hashing**:
   - Passwords are encrypted using **`bcrypt`** via `passlib.context.CryptContext` before storing in the database. Raw passwords are never stored.
   - When a user logs in via `POST /api/auth/login`, `verify_password()` hashes the incoming password and checks it against `hashed_password` in the `users` table.

2. **Token Generation (`HS256`)**:
   - Upon successful credential verification, `create_access_token()` builds a signed **JSON Web Token (JWT)** using `python-jose` with the `HS256` algorithm.
   - **Token Payload Claims**:
     ```json
     {
       "sub": "user@dealership.com",   // Subject (User Email)
       "role": "admin",                // Authorization Role ("user" or "admin")
       "id": 1,                        // User ID
       "exp": 1754543100               // Expiration Timestamp (UTC Epoch)
     }
     ```

3. **Client-Side Token Storage & Transmission**:
   - The React frontend receives `{ "access_token": "...", "token_type": "bearer" }` and stores it in `AuthContext` state as well as browser `localStorage`.
   - Every protected API request includes the token in the HTTP request header:
     ```http
     Authorization: Bearer <JWT_ACCESS_TOKEN>
     ```

4. **FastAPI Dependency Injection & RBAC Guards**:
   - **`get_current_user`**: Intercepts the HTTP request, extracts the Bearer token, decodes the JWT using `SECRET_KEY`, checks token expiration, and loads the user record from PostgreSQL. If invalid or expired, returns `HTTP 401 Unauthorized`.
   - **`require_admin`**: Wraps `get_current_user` and inspects `current_user.role`. If `role != "admin"`, raises `HTTP 403 Forbidden` (`"Administrator privileges required"`).

### 🔐 JWT Authentication & RBAC Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (React SPA)
    participant Auth as Auth Endpoint (/login)
    participant Sec as Security Module (bcrypt / jose)
    participant API as Protected Endpoint (/api/vehicles)
    participant Dep as Dependency Guard (get_current_user / require_admin)
    participant DB as Neon PostgreSQL DB

    User->>Auth: POST /api/auth/login (email, password)
    Auth->>DB: Query User by email
    DB-->>Auth: User record (hashed_password, role)
    Auth->>Sec: verify_password(password, hashed_password)
    Sec-->>Auth: True (Password valid)
    Auth->>Sec: create_access_token(sub=email, role=role, id=user_id)
    Sec-->>Auth: Signed JWT Token (HS256)
    Auth-->>User: HTTP 200 OK { access_token, token_type: "bearer" }
    
    Note over User: Frontend stores JWT in AuthContext & localStorage

    User->>API: HTTP Request with Header "Authorization: Bearer <JWT>"
    API->>Dep: Intercept Request
    Dep->>Sec: Decode JWT with SECRET_KEY & check expiration
    Sec-->>Dep: Token Payload (sub, role, id)
    Dep->>DB: Fetch current user
    DB-->>Dep: User Object

    alt Admin Endpoint Guard (e.g. DELETE /api/vehicles/{id})
        Dep->>Dep: Check if user.role == "admin"
        alt Role is NOT admin
            Dep-->>User: HTTP 403 Forbidden {"detail": "Administrator privileges required"}
        end
    end

    Dep->>API: Inject current_user / admin_user into route handler
    API->>DB: Perform database query / mutation
    DB-->>API: Result data
    API-->>User: HTTP 200/201 JSON Response
```

---

## 📁 Project Structure

```text
car_dealing/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Auth & RBAC Dependency Injections
│   │   │   └── endpoints/           # Auth, Vehicles, Purchases Routers
│   │   ├── core/                    # Security & Config Settings
│   │   ├── db/                      # SQLAlchemy Session Builder
│   │   ├── models/                  # User, Vehicle, Purchase Models
│   │   └── schemas/                 # Pydantic Validation Schemas
│   ├── tests/                       # Pytest Backend Unit Test Suite
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, VehicleCard, Modals
│   │   ├── context/                 # AuthContext State Provider
│   │   ├── test/                    # Vitest RTL Component Tests
│   │   └── utils/                   # Currency & Sorting Utilities
│   ├── package.json
│   └── vite.config.js
├── schema.sql                       # PostgreSQL DDL Table Schemas & CHECK Constraints
├── README.md                        # Comprehensive Project Documentation
├── IMPLEMENTATION_PLAN.md           # Architecture & TDD Execution Plan
├── PROMPTS.md                       # Chronological AI Interaction Log
├── DEVELOPMENT_LOG.docx             # Detailed Logbook & Troubleshooting
├── backend_test_report.txt          # Empirical Pytest Execution Output
├── frontend_test_report.txt         # Empirical Vitest Execution Output
└── render.yaml                      # Render Cloud Deployment Manifest
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ PURCHASE_HISTORY : "places (1:N)"
    VEHICLES ||--o{ PURCHASE_HISTORY : "snapshot in (1:N)"
    
    USERS {
        int id PK "Auto-increment Primary Key"
        string email UK "Unique User Email"
        string hashed_password "Bcrypt Hashed Password"
        string role "CHECK (role IN ('user', 'admin'))"
        datetime created_at "Timestamp of Registration"
    }

    VEHICLES {
        int id PK "Auto-increment Primary Key"
        string maker "Vehicle Brand / Manufacturer (e.g. BMW)"
        string model "Vehicle Model Name (e.g. M5 CS)"
        int year "Manufacturing Year (CHECK >= 1886)"
        string category "Category (e.g. Sedan, SUV, Luxury)"
        decimal price "Price in INR (CHECK >= 0.0)"
        int quantity "Available Inventory Stock (CHECK >= 0)"
        datetime created_at "Timestamp of Record Creation"
        datetime updated_at "Timestamp of Last Update"
    }

    PURCHASE_HISTORY {
        int id PK "Auto-increment Primary Key"
        int user_id FK "Foreign Key -> USERS.id"
        int vehicle_id FK "Foreign Key -> VEHICLES.id (Nullable on deletion)"
        string vehicle_maker "Snapshot of Maker at purchase"
        string vehicle_model "Snapshot of Model at purchase"
        decimal price_at_purchase "Price snapshot at checkout (INR)"
        int quantity "Quantity purchased (CHECK >= 1)"
        string buyer_name "Full name of buyer"
        string buyer_phone "Contact phone number"
        string delivery_address "Delivery location address"
        string note "Optional delivery instructions"
        datetime purchased_at "Timestamp of Checkout"
    }
```

> **Deliberate Column Rename**: During domain model design, the column `make` was deliberately renamed to `maker` to provide explicit clarity across database tables, API query parameters, and frontend UI components.

---

## 🔌 API Reference & Endpoints Calling Guide

### Summary Table

| Method | Endpoint | Protected | Access Role | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | No | Public | Backend operational health check |
| `POST` | `/api/auth/register` | No | Public | Register new user account |
| `POST` | `/api/auth/login` | No | Public | Authenticate user & return JWT token |
| `GET` | `/api/vehicles` | Yes | Customer / Admin | Retrieve full vehicle catalog |
| `GET` | `/api/vehicles/search` | Yes | Customer / Admin | Search & filter vehicles by query, category, price |
| `POST` | `/api/vehicles` | Yes | Customer / Admin | Create a new vehicle entry |
| `PUT` | `/api/vehicles/{id}` | Yes | Customer / Admin | Update vehicle details |
| `DELETE` | `/api/vehicles/{id}` | Yes | Admin Only | Delete vehicle entry from catalog |
| `POST` | `/api/vehicles/{id}/purchase` | Yes | Customer / Admin | Checkout vehicle & snapshot purchase history |
| `POST` | `/api/vehicles/{id}/restock` | Yes | Admin Only | Restock vehicle inventory stock |
| `GET` | `/api/purchases/me` | Yes | Customer / Admin | Retrieve logged-in user's purchase history |

---

### Detailed Endpoint Specifications

#### 1. System Health Check
- **Endpoint:** `GET /`
- **Authentication:** None (Public)
- **Headers:** None
- **Response `200 OK`:**
  ```json
  {
    "message": "Car Dealership API is operational"
  }
  ```

---

#### 2. User Registration
- **Endpoint:** `POST /api/auth/register`
- **Authentication:** None (Public)
- **Request Headers:** `Content-Type: application/json`
- **Request Body Schema (`UserCreate`):**
  ```json
  {
    "email": "user@dealership.com",
    "password": "user123",
    "role": "user"                  // Optional: "user" (default) or "admin"
  }
  ```
- **Response `201 Created` (`UserResponse`):**
  ```json
  {
    "id": 1,
    "email": "user@dealership.com",
    "role": "user",
    "created_at": "2026-08-06T12:00:00Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Email already registered
    ```json
    { "detail": "Email already registered" }
    ```
  - `422 Unprocessable Entity`: Invalid email format or missing fields.

---

#### 3. User Login & Token Generation
- **Endpoint:** `POST /api/auth/login`
- **Authentication:** None (Public)
- **Request Headers:** `Content-Type: application/json`
- **Request Body Schema (`LoginRequest`):**
  ```json
  {
    "email": "user@dealership.com",
    "password": "user123"
  }
  ```
- **Response `200 OK` (`Token`):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid credentials
    ```json
    { "detail": "Invalid credentials" }
    ```

---

#### 4. Get Vehicle Catalog
- **Endpoint:** `GET /api/vehicles`
- **Authentication:** Protected (Requires JWT Bearer Token)
- **Request Headers:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Response `200 OK` (`List[VehicleResponse]`):**
  ```json
  [
    {
      "id": 1,
      "maker": "BMW",
      "model": "M5 CS",
      "year": 2023,
      "category": "Sedan",
      "price": 18500000.0,
      "quantity": 3,
      "created_at": "2026-08-06T12:00:00Z",
      "updated_at": "2026-08-06T12:00:00Z"
    }
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized`: Missing or invalid Bearer token.

---

#### 5. Search & Filter Vehicles
- **Endpoint:** `GET /api/vehicles/search`
- **Authentication:** Protected (Requires JWT Bearer Token)
- **Request Headers:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Query Parameters:**
  | Parameter | Type | Required | Description | Example |
  | :--- | :--- | :---: | :--- | :--- |
  | `q` | `string` | No | Case-insensitive search on `maker` OR `model` | `bmw` |
  | `maker` | `string` | No | Filter specifically by vehicle maker/brand | `Mercedes-Benz` |
  | `model` | `string` | No | Filter specifically by model name | `Civic` |
  | `category` | `string` | No | Filter by category | `SUV` |
  | `min_price` | `float` | No | Minimum price bound (INR) | `1000000` |
  | `max_price` | `float` | No | Maximum price bound (INR) | `5000000` |
- **Example Request URL:** `/api/vehicles/search?q=bmw&category=Sedan&max_price=20000000`
- **Response `200 OK` (`List[VehicleResponse]`):**
  ```json
  [
    {
      "id": 1,
      "maker": "BMW",
      "model": "M5 CS",
      "year": 2023,
      "category": "Sedan",
      "price": 18500000.0,
      "quantity": 3,
      "created_at": "2026-08-06T12:00:00Z",
      "updated_at": "2026-08-06T12:00:00Z"
    }
  ]
  ```

---

#### 6. Create New Vehicle
- **Endpoint:** `POST /api/vehicles`
- **Authentication:** Protected (Requires JWT Bearer Token)
- **Request Headers:**
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body Schema (`VehicleCreate`):**
  ```json
  {
    "maker": "Audi",
    "model": "RS6 Avant",
    "year": 2024,
    "category": "Station Wagon",
    "price": 21500000.0,
    "quantity": 2
  }
  ```
- **Response `201 Created` (`VehicleResponse`):**
  ```json
  {
    "id": 52,
    "maker": "Audi",
    "model": "RS6 Avant",
    "year": 2024,
    "category": "Station Wagon",
    "price": 21500000.0,
    "quantity": 2,
    "created_at": "2026-08-06T14:30:00Z",
    "updated_at": null
  }
  ```
- **Error Responses:**
  - `422 Unprocessable Entity`: Validation failure (e.g. `year < 1886`, `price < 0`, `quantity < 0`).

---

#### 7. Update Vehicle Details
- **Endpoint:** `PUT /api/vehicles/{vehicle_id}`
- **Authentication:** Protected (Requires JWT Bearer Token)
- **Request Headers:**
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Path Parameter:** `vehicle_id` (integer)
- **Request Body Schema (`VehicleUpdate` — All fields optional):**
  ```json
  {
    "price": 21000000.0,
    "quantity": 4
  }
  ```
- **Response `200 OK` (`VehicleResponse`):**
  ```json
  {
    "id": 52,
    "maker": "Audi",
    "model": "RS6 Avant",
    "year": 2024,
    "category": "Station Wagon",
    "price": 21000000.0,
    "quantity": 4,
    "created_at": "2026-08-06T14:30:00Z",
    "updated_at": "2026-08-06T14:35:00Z"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Vehicle with given ID does not exist.

---

#### 8. Delete Vehicle (Admin Only)
- **Endpoint:** `DELETE /api/vehicles/{vehicle_id}`
- **Authentication:** Protected (**Admin Only**)
- **Request Headers:** `Authorization: Bearer <ADMIN_JWT_ACCESS_TOKEN>`
- **Path Parameter:** `vehicle_id` (integer)
- **Response `200 OK`:**
  ```json
  {
    "message": "Vehicle deleted successfully"
  }
  ```
- **Error Responses:**
  - `403 Forbidden`: User is authenticated but does not possess admin role (`"Administrator privileges required"`).
  - `404 Not Found`: Vehicle ID not found in database.

---

#### 9. Purchase Vehicle (Checkout & Stock Depletion)
- **Endpoint:** `POST /api/vehicles/{vehicle_id}/purchase`
- **Authentication:** Protected (Requires JWT Bearer Token)
- **Request Headers:**
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Path Parameter:** `vehicle_id` (integer)
- **Request Body Schema (`PurchaseCreate`):**
  ```json
  {
    "buyer_name": "Sunny Raj",
    "buyer_phone": "+91 9876543210",
    "delivery_address": "123 Tech Park, Bangalore, Karnataka",
    "note": "Please deliver during business hours.",
    "quantity": 1
  }
  ```
- **Response `200 OK` (`PurchaseResponse`):**
  ```json
  {
    "id": 10,
    "user_id": 2,
    "vehicle_id": 1,
    "vehicle_maker": "BMW",
    "vehicle_model": "M5 CS",
    "quantity": 1,
    "price_at_purchase": 18500000.0,
    "buyer_name": "Sunny Raj",
    "buyer_phone": "+91 9876543210",
    "delivery_address": "123 Tech Park, Bangalore, Karnataka",
    "note": "Please deliver during business hours.",
    "purchased_at": "2026-08-06T15:00:00Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Out of stock or requested quantity exceeds available stock.
    ```json
    { "detail": "Vehicle out of stock" }
    ```
  - `404 Not Found`: Vehicle ID not found.

---

#### 10. Restock Vehicle Inventory (Admin Only)
- **Endpoint:** `POST /api/vehicles/{vehicle_id}/restock`
- **Authentication:** Protected (**Admin Only**)
- **Request Headers:** `Authorization: Bearer <ADMIN_JWT_ACCESS_TOKEN>`
- **Path Parameter:** `vehicle_id` (integer)
- **Query Parameter:**
  - `amount` (integer, required, default `1`, minimum `1`): Number of stock units to add.
- **Example Request URL:** `/api/vehicles/1/restock?amount=5`
- **Response `200 OK` (`VehicleResponse` with updated stock):**
  ```json
  {
    "id": 1,
    "maker": "BMW",
    "model": "M5 CS",
    "year": 2023,
    "category": "Sedan",
    "price": 18500000.0,
    "quantity": 8,
    "created_at": "2026-08-06T12:00:00Z",
    "updated_at": "2026-08-06T15:15:00Z"
  }
  ```
- **Error Responses:**
  - `403 Forbidden`: Non-admin user attempt.
  - `404 Not Found`: Vehicle ID not found.

---

#### 11. Get User Purchase History
- **Endpoint:** `GET /api/purchases/me`
- **Authentication:** Protected (Requires JWT Bearer Token)
- **Request Headers:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Response `200 OK` (`List[PurchaseResponse]`):**
  ```json
  [
    {
      "id": 10,
      "user_id": 2,
      "vehicle_id": 1,
      "vehicle_maker": "BMW",
      "vehicle_model": "M5 CS",
      "quantity": 1,
      "price_at_purchase": 18500000.0,
      "buyer_name": "Sunny Raj",
      "buyer_phone": "+91 9876543210",
      "delivery_address": "123 Tech Park, Bangalore, Karnataka",
      "note": "Please deliver during business hours.",
      "purchased_at": "2026-08-06T15:00:00Z"
    }
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized`: Missing or invalid Bearer token.

---

## 💻 Installation & Local Setup

### Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m pytest backend/tests -v > ../backend_test_report.txt
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

## 🧪 Testing & Code Coverage (37/37 Tests Passing — 93% Coverage)

The project enforces a strict **Test-Driven Development (TDD)** methodology (Red -> Green -> Refactor) across both backend and frontend layers.

```text
======================= 37 PASSED (100% Pass Rate) =======================
Backend Pytest Suite   : 21 / 21 Passed  (93% Code Coverage)
Frontend Vitest Suite  : 16 / 16 Passed  (100% Component Pass Rate)
==========================================================================
```

### Coverage Summary Table

| Module / Layer | Test File | Passed Tests | Code Coverage | Focus Areas |
| :--- | :--- | :---: | :---: | :--- |
| **Auth Module** | `backend/tests/test_auth.py` | 6 | 100% | Registration, login, duplicate email guards, password hashing |
| **Vehicles Module** | `backend/tests/test_vehicles.py` | 7 | 91% | CRUD operations, OR-based search filters, admin authorization |
| **Inventory Module** | `backend/tests/test_inventory.py` | 5 | 100% | Stock depletion, out-of-stock guards, admin restocking |
| **Purchases Module** | `backend/tests/test_purchases.py` | 3 | 95% | Checkout history creation, user isolation, 401 guards |
| **Frontend Formatters** | `frontend/src/test/currency.test.js` | 3 | 100% | INR formatting (`₹`), Lakh/Crore grouping, exchange multiplier |
| **Frontend Sorting** | `frontend/src/test/sort.test.jsx` | 4 | 100% | Client-side price & year sorting logic |
| **Frontend Layout** | `frontend/src/test/responsive.test.jsx` | 1 | 100% | Mobile drawer navigation & breakpoint rendering |
| **App Components** | `frontend/src/test/App.test.jsx` | 5 | 100% | VehicleCard stock guards, Navbar badges, Auth Required banner |
| **Purchase Checkout** | `frontend/src/test/purchase.test.jsx` | 3 | 100% | PurchaseModal submission, ProfileModal purchase history tab |

- Combined execution report saved in [`TEST_REPORT.docx`](TEST_REPORT.docx).

---

## 🚀 Cloud Deployment Architecture

| Layer | Cloud Provider | Production URL | Configuration |
| :--- | :--- | :--- | :--- |
| **Frontend SPA** | **Vercel** | [srs-dealership.vercel.app](https://srs-dealership.vercel.app) | SPA rewrite rules ([`frontend/vercel.json`](frontend/vercel.json)) |
| **Backend API** | **Render** | [drivehub-dealership.onrender.com](https://drivehub-dealership.onrender.com) | Multi-worker Gunicorn server ([`render.yaml`](render.yaml)) |
| **Database** | **Neon Cloud** | Managed PostgreSQL 16 | SSL connection pooling, DDL relational `CHECK` constraints |

---

## 🤖 AI Usage & Ownership Disclosure

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
  - Wrote TDD unit test suites (`test_auth.py`, `test_vehicles.py`, `test_inventory.py`, `test_purchases.py`) and Vitest RTL component tests (`App.test.jsx`, `currency.test.js`, `sort.test.jsx`, `responsive.test.jsx`, `purchase.test.jsx`).
  - Implemented React 19 SPA components (`Navbar`, `VehicleCard`, `FilterBar`, `AdminModal`, `RestockModal`, `AuthModal`, `ProfileModal`, `PurchaseModal`).
  - Diagnosed and resolved runtime errors (PostCSS v4 deprecation, OR-based search logic, AuthProvider context wiring, Neon DB scripts, Render `render.yaml`, Vercel `vercel.json`, secret audit history purge).

#### 3. Co-Author Trailer Attribution Standard
All AI-assisted commits retain explicit `Co-authored-by:` trailers in compliance with kata requirements. To guarantee GitHub does not misattribute AI trailers to third-party user accounts, all AI trailers use the IANA-reserved top-level domain (`.invalid`):
- `Co-authored-by: Antigravity AI <antigravity-agent@noreply.invalid>`
- `Co-authored-by: Claude AI <claude-agent@noreply.invalid>`

---

## 📑 Documentation & Deliverables

- [`DEVELOPMENT_LOG_BOOK.docx`](DEVELOPMENT_LOG_BOOK.docx): Comprehensive development logbook & engineering documentation.
- [`TEST_REPORT.docx`](TEST_REPORT.docx): Combined Pytest & Vitest empirical test execution report.
- [`PROMPTS.md`](PROMPTS.md): Complete interactive prompt logbook & Phase 8 security audit summary.
- [`schema.sql`](schema.sql): PostgreSQL DDL relational tables, foreign keys, and `CHECK` constraints.
- [`render.yaml`](render.yaml): Infrastructure-as-code deployment manifest for Render backend.
- [`frontend/vercel.json`](frontend/vercel.json): SPA routing manifest for Vercel frontend.

---

## 📄 License

This project is open-source and available under the **[MIT License](LICENSE)**.
