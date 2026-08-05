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
        json={"email": "buyer@example.com", "password": "buyerpassword123", "role": "user"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "buyer@example.com", "password": "buyerpassword123"}
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
        json={"email": "inventoryadmin@example.com", "password": "adminpass123", "role": "admin"}
    )
    res = client.post(
        "/api/auth/login",
        json={"email": "inventoryadmin@example.com", "password": "adminpass123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_purchase_vehicle_success(client, user_token_headers, admin_token_headers):
    """
    Tests purchasing an available vehicle and verifies inventory stock decrements.
    Connected to: Vehicle Purchase endpoint (POST /api/vehicles/{id}/purchase), PurchaseModal in Frontend
    Requires: Pytest client, user_token_headers, and admin_token_headers fixtures
    """
    # Create vehicle with quantity = 2
    res = client.post(
        "/api/vehicles",
        json={"maker": "Honda", "model": "Accord", "year": 2023, "category": "Sedan", "price": 28000.00, "quantity": 2},
        headers=admin_token_headers
    )
    vehicle_id = res.json()["id"]

    # Purchase vehicle
    purchase_res = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_token_headers)
    assert purchase_res.status_code == 200
    assert purchase_res.json()["quantity"] == 1

def test_purchase_vehicle_out_of_stock_fails(client, user_token_headers, admin_token_headers):
    """
    Tests that purchasing an out-of-stock vehicle (quantity 0) returns HTTP 400 Bad Request.
    Connected to: Vehicle Purchase endpoint (POST /api/vehicles/{id}/purchase), PurchaseModal in Frontend
    Requires: Pytest client, user_token_headers, and admin_token_headers fixtures
    """
    # Create vehicle with quantity = 0
    res = client.post(
        "/api/vehicles",
        json={"maker": "Tesla", "model": "Model Y", "year": 2024, "category": "Electric", "price": 48000.00, "quantity": 0},
        headers=admin_token_headers
    )
    vehicle_id = res.json()["id"]

    # Purchase attempt should be blocked
    purchase_res = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_token_headers)
    assert purchase_res.status_code == 400
    assert "out of stock" in purchase_res.json()["detail"].lower()

def test_purchase_nonexistent_vehicle_fails(client, user_token_headers):
    """
    Tests purchasing a non-existent vehicle ID, expecting HTTP 404 Not Found error.
    Connected to: Vehicle Purchase endpoint (POST /api/vehicles/{id}/purchase)
    Requires: Pytest client and user_token_headers fixtures
    """
    response = client.post("/api/vehicles/99999/purchase", headers=user_token_headers)
    assert response.status_code == 404
    assert "Vehicle not found" in response.json()["detail"]

def test_restock_vehicle_admin_success(client, admin_token_headers):
    """
    Tests admin functionality to restock a vehicle's quantity.
    Connected to: Vehicle Restock endpoint (POST /api/vehicles/{id}/restock)
    Requires: Pytest client and admin_token_headers fixtures
    """
    # Create vehicle with quantity = 1
    res = client.post(
        "/api/vehicles",
        json={"maker": "Chevrolet", "model": "Tahoe", "year": 2023, "category": "SUV", "price": 55000.00, "quantity": 1},
        headers=admin_token_headers
    )
    vehicle_id = res.json()["id"]

    # Restock by 5
    restock_res = client.post(
        f"/api/vehicles/{vehicle_id}/restock?amount=5",
        headers=admin_token_headers
    )
    assert restock_res.status_code == 200
    assert restock_res.json()["quantity"] == 6

def test_restock_vehicle_regular_user_forbidden(client, user_token_headers, admin_token_headers):
    """
    Tests that non-admin users attempting to restock inventory receive HTTP 403 Forbidden.
    Connected to: Vehicle Restock endpoint (POST /api/vehicles/{id}/restock)
    Requires: Pytest client, user_token_headers, and admin_token_headers fixtures
    """
    res = client.post(
        "/api/vehicles",
        json={"maker": "Ford", "model": "F-150", "year": 2023, "category": "Truck", "price": 45000.00, "quantity": 2},
        headers=admin_token_headers
    )
    vehicle_id = res.json()["id"]

    # Regular user attempt to restock
    response = client.post(f"/api/vehicles/{vehicle_id}/restock?amount=3", headers=user_token_headers)
    assert response.status_code == 403
    assert "Admin privileges required" in response.json()["detail"]
