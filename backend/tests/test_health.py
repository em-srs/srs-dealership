import pytest

def test_health_check_endpoints(client):
    """
    Tests that all health check endpoints (/, /health, /healthz, /api/health) return HTTP 200 and operational status.
    Connected to: FastAPI Health Endpoints, UptimeRobot monitoring, Render status checks
    Requires: Pytest client fixture
    """
    endpoints = ["/", "/health", "/healthz", "/api/health"]
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["message"] == "Car Dealership API is operational"
