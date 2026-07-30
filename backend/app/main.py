from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.vehicles import router as vehicles_router
from app.api.endpoints.purchases import router as purchases_router

app = FastAPI(title="Car Dealership Inventory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(vehicles_router, prefix="/api/vehicles", tags=["Vehicles"])
app.include_router(purchases_router, prefix="/api/purchases", tags=["Purchases"])


@app.get("/")
def read_root():
    return {"message": "Car Dealership API is operational"}
