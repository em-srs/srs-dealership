import pytest

@pytest.fixture
def user_token_headers(client):
    """
    Registers and logs in a standard test user, returning HTTP Authorization Bearer headers.
    Connected to: Auth endpoints (POST /api/auth/register, POST /api/auth/login)
    Requires: Pytest client fixture
    """
    client.post(
        "/api/auth/register",
        json={"email": "regularuser@example.com", "password": "password123", "role": "user"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "regularuser@example.com", "password": "password123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_token_headers(client):
    """
    Registers and logs in an admin test user, returning HTTP Authorization Bearer headers.
    Connected to: Auth endpoints (POST /api/auth/register, POST /api/auth/login)
    Requires: Pytest client fixture
    """
    client.post(
        "/api/auth/register",
        json={"email": "adminuser@example.com", "password": "adminpassword123", "role": "admin"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "adminuser@example.com", "password": "adminpassword123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_vehicle_success(client, user_token_headers):
    """
    Tests creating a new vehicle in the inventory as an authenticated user.
    Connected to: Vehicles API (POST /api/vehicles), Add Vehicle Form in Frontend
    Requires: Pytest client and user_token_headers fixtures
    """
    payload = {
        "maker": "Toyota",
        "model": "Camry",
        "year": 2023,
        "category": "Sedan",
        "price": 26000.00,
        "quantity": 5
    }
    response = client.post("/api/vehicles", json=payload, headers=user_token_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["maker"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["price"] == 26000.00
    assert "id" in data

def test_create_vehicle_unauthenticated_fails(client):
    """
    Tests that creating a vehicle without authorization headers returns HTTP 401 Unauthorized.
    Connected to: Vehicles API (POST /api/vehicles), Auth middleware
    Requires: Pytest client fixture
    """
    payload = {
        "maker": "Honda",
        "model": "Civic",
        "year": 2022,
        "category": "Sedan",
        "price": 22000.00,
        "quantity": 3
    }
    response = client.post("/api/vehicles", json=payload)
    assert response.status_code == 401

def test_get_all_vehicles_requires_authentication(client, user_token_headers):
    """
    Tests fetching all vehicles, verifying unauthenticated requests fail (401) and authenticated ones succeed (200).
    Connected to: Vehicles API (GET /api/vehicles), Vehicle Catalog in Frontend
    Requires: Pytest client and user_token_headers fixtures
    """
    client.post("/api/vehicles", json={"maker": "Ford", "model": "Mustang", "year": 2021, "category": "Coupe", "price": 35000.00, "quantity": 2}, headers=user_token_headers)

    # Unauthenticated GET request must fail with 401 Unauthorized
    unauth_response = client.get("/api/vehicles")
    assert unauth_response.status_code == 401

    # Authenticated GET request must succeed with 200 OK
    auth_response = client.get("/api/vehicles", headers=user_token_headers)
    assert auth_response.status_code == 200
    assert len(auth_response.json()) >= 1

def test_search_vehicles_requires_authentication(client, user_token_headers):
    """
    Tests vehicle search and filtering, verifying unauthenticated requests fail (401) and authenticated ones succeed (200).
    Connected to: Vehicles Search API (GET /api/vehicles/search), Search Bar in Frontend
    Requires: Pytest client and user_token_headers fixtures
    """
    client.post("/api/vehicles", json={"maker": "Toyota", "model": "Corolla", "year": 2020, "category": "Sedan", "price": 18000.00, "quantity": 3}, headers=user_token_headers)

    # Unauthenticated search request must fail with 401 Unauthorized
    unauth_response = client.get("/api/vehicles/search?maker=Toyota&max_price=30000")
    assert unauth_response.status_code == 401

    # Authenticated search request must succeed with 200 OK
    auth_response = client.get("/api/vehicles/search?maker=Toyota&max_price=30000", headers=user_token_headers)
    assert auth_response.status_code == 200
    results = auth_response.json()
    assert len(results) == 1
    assert results[0]["model"] == "Corolla"

def test_update_vehicle_success(client, user_token_headers):
    """
    Tests updating vehicle fields (price, quantity) for an existing vehicle record.
    Connected to: Vehicles API (PUT /api/vehicles/{id}), Edit Vehicle Modal in Frontend
    Requires: Pytest client and user_token_headers fixtures
    """
    res = client.post("/api/vehicles", json={"maker": "Subaru", "model": "Outback", "year": 2022, "category": "SUV", "price": 29000.00, "quantity": 2}, headers=user_token_headers)
    vehicle_id = res.json()["id"]

    update_payload = {"price": 27500.00, "quantity": 5}
    response = client.put(f"/api/vehicles/{vehicle_id}", json=update_payload, headers=user_token_headers)
    assert response.status_code == 200
    assert response.json()["price"] == 27500.00
    assert response.json()["quantity"] == 5

def test_delete_vehicle_admin_only_success(client, admin_token_headers):
    """
    Tests admin privilege deletion of a vehicle record.
    Connected to: Vehicles API (DELETE /api/vehicles/{id}), Vehicle List in Frontend
    Requires: Pytest client and admin_token_headers fixtures
    """
    res = client.post("/api/vehicles", json={"maker": "Mazda", "model": "CX-5", "year": 2023, "category": "SUV", "price": 28000.00, "quantity": 2}, headers=admin_token_headers)
    vehicle_id = res.json()["id"]

    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_token_headers)
    assert response.status_code == 200 or response.status_code == 204

def test_delete_vehicle_regular_user_forbidden(client, user_token_headers, admin_token_headers):
    """
    Tests that a regular non-admin user attempting to delete a vehicle is denied with HTTP 403 Forbidden.
    Connected to: Vehicles API (DELETE /api/vehicles/{id}), require_admin dependency
    Requires: Pytest client, user_token_headers, and admin_token_headers fixtures
    """
    res = client.post("/api/vehicles", json={"maker": "Audi", "model": "A4", "year": 2023, "category": "Sedan", "price": 40000.00, "quantity": 1}, headers=admin_token_headers)
    vehicle_id = res.json()["id"]

    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=user_token_headers)
    assert response.status_code == 403
    assert "Admin privileges required" in response.json()["detail"]
