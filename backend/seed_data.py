import os
import random
from app.db.database import SessionLocal
from app.models.vehicle import Vehicle
from app.models.user import User
from app.core.security import get_password_hash

vehicles_data = [
    # Sedans
    {"maker": "Toyota", "model": "Camry", "year": 2023, "category": "Sedan", "price": 26420.00, "quantity": 8},
    {"maker": "Honda", "model": "Civic", "year": 2024, "category": "Sedan", "price": 23950.00, "quantity": 12},
    {"maker": "Honda", "model": "Accord", "year": 2023, "category": "Sedan", "price": 27295.00, "quantity": 5},
    {"maker": "Hyundai", "model": "Elantra", "year": 2024, "category": "Sedan", "price": 21625.00, "quantity": 10},
    {"maker": "Nissan", "model": "Altima", "year": 2023, "category": "Sedan", "price": 25730.00, "quantity": 4},
    {"maker": "BMW", "model": "3 Series", "year": 2024, "category": "Sedan", "price": 44500.00, "quantity": 3},
    {"maker": "Mercedes-Benz", "model": "C-Class", "year": 2024, "category": "Sedan", "price": 46950.00, "quantity": 2},
    {"maker": "Audi", "model": "A4", "year": 2023, "category": "Sedan", "price": 40300.00, "quantity": 6},
    {"maker": "Lexus", "model": "ES 350", "year": 2024, "category": "Sedan", "price": 43190.00, "quantity": 4},
    {"maker": "Subaru", "model": "Legacy", "year": 2023, "category": "Sedan", "price": 24895.00, "quantity": 0},

    # SUVs
    {"maker": "Toyota", "model": "RAV4", "year": 2024, "category": "SUV", "price": 28675.00, "quantity": 15},
    {"maker": "Honda", "model": "CR-V", "year": 2024, "category": "SUV", "price": 29500.00, "quantity": 11},
    {"maker": "Ford", "model": "Explorer", "year": 2023, "category": "SUV", "price": 36760.00, "quantity": 7},
    {"maker": "Jeep", "model": "Grand Cherokee", "year": 2024, "category": "SUV", "price": 40130.00, "quantity": 3},
    {"maker": "Subaru", "model": "Outback", "year": 2024, "category": "SUV", "price": 28895.00, "quantity": 9},
    {"maker": "BMW", "model": "X5", "year": 2024, "category": "SUV", "price": 65200.00, "quantity": 4},
    {"maker": "Mercedes-Benz", "model": "GLE 350", "year": 2024, "category": "SUV", "price": 62650.00, "quantity": 2},
    {"maker": "Audi", "model": "Q7", "year": 2023, "category": "SUV", "price": 59500.00, "quantity": 5},
    {"maker": "Hyundai", "model": "Palisade", "year": 2024, "category": "SUV", "price": 36400.00, "quantity": 8},
    {"maker": "Kia", "model": "Telluride", "year": 2024, "category": "SUV", "price": 36190.00, "quantity": 0},

    # Trucks
    {"maker": "Ford", "model": "F-150", "year": 2024, "category": "Truck", "price": 36570.00, "quantity": 14},
    {"maker": "Chevrolet", "model": "Silverado 1500", "year": 2024, "category": "Truck", "price": 36800.00, "quantity": 10},
    {"maker": "RAM", "model": "1500", "year": 2024, "category": "Truck", "price": 39420.00, "quantity": 6},
    {"maker": "Toyota", "model": "Tacoma", "year": 2024, "category": "Truck", "price": 31500.00, "quantity": 8},
    {"maker": "GMC", "model": "Sierra 1500", "year": 2023, "category": "Truck", "price": 37700.00, "quantity": 5},
    {"maker": "Toyota", "model": "Tundra", "year": 2024, "category": "Truck", "price": 39965.00, "quantity": 4},
    {"maker": "Nissan", "model": "Frontier", "year": 2023, "category": "Truck", "price": 29770.00, "quantity": 7},
    {"maker": "Ford", "model": "Ranger", "year": 2024, "category": "Truck", "price": 32670.00, "quantity": 3},
    {"maker": "Chevrolet", "model": "Colorado", "year": 2024, "category": "Truck", "price": 29500.00, "quantity": 0},
    {"maker": "Jeep", "model": "Gladiator", "year": 2023, "category": "Truck", "price": 38775.00, "quantity": 2},

    # Electric
    {"maker": "Tesla", "model": "Model Y", "year": 2024, "category": "Electric", "price": 44990.00, "quantity": 18},
    {"maker": "Tesla", "model": "Model 3", "year": 2024, "category": "Electric", "price": 38990.00, "quantity": 20},
    {"maker": "Ford", "model": "Mustang Mach-E", "year": 2024, "category": "Electric", "price": 42995.00, "quantity": 6},
    {"maker": "Hyundai", "model": "IONIQ 5", "year": 2024, "category": "Electric", "price": 41800.00, "quantity": 7},
    {"maker": "Kia", "model": "EV6", "year": 2024, "category": "Electric", "price": 42600.00, "quantity": 5},
    {"maker": "Rivian", "model": "R1T", "year": 2024, "category": "Electric", "price": 69900.00, "quantity": 3},
    {"maker": "Lucid", "model": "Air Pure", "year": 2024, "category": "Electric", "price": 69900.00, "quantity": 2},
    {"maker": "BMW", "model": "i4", "year": 2024, "category": "Electric", "price": 52200.00, "quantity": 4},
    {"maker": "Audi", "model": "e-tron GT", "year": 2024, "category": "Electric", "price": 106500.00, "quantity": 1},
    {"maker": "Porsche", "model": "Taycan", "year": 2024, "category": "Electric", "price": 92500.00, "quantity": 0},

    # Coupes & Sports Cars
    {"maker": "Ford", "model": "Mustang GT", "year": 2024, "category": "Coupe", "price": 42495.00, "quantity": 6},
    {"maker": "Chevrolet", "model": "Corvette Stingray", "year": 2024, "category": "Coupe", "price": 68300.00, "quantity": 3},
    {"maker": "Porsche", "model": "911 Carrera", "year": 2024, "category": "Coupe", "price": 114400.00, "quantity": 2},
    {"maker": "Porsche", "model": "718 Cayman", "year": 2024, "category": "Coupe", "price": 68300.00, "quantity": 4},
    {"maker": "Toyota", "model": "GR Supra", "year": 2024, "category": "Coupe", "price": 46440.00, "quantity": 5},
    {"maker": "BMW", "model": "M4 Coupe", "year": 2024, "category": "Coupe", "price": 79100.00, "quantity": 2},
    {"maker": "Nissan", "model": "Z Performance", "year": 2024, "category": "Coupe", "price": 52310.00, "quantity": 3},
    {"maker": "Lexus", "model": "LC 500", "year": 2024, "category": "Coupe", "price": 99800.00, "quantity": 1},
    {"maker": "Dodge", "model": "Challenger R/T", "year": 2023, "category": "Coupe", "price": 41300.00, "quantity": 4},
    {"maker": "Subaru", "model": "BRZ", "year": 2024, "category": "Coupe", "price": 30195.00, "quantity": 7},
]

def seed_database():
    """
    Populates the database with 50 initial vehicles and default demo accounts (admin and user).
    Connected to: Database (vehicles and users tables)
    Requires: SessionLocal, Vehicle model, User model, get_password_hash
    """
    db = SessionLocal()
    try:
        print("Seeding 50 vehicles into PostgreSQL vehicles table...")
        for v in vehicles_data:
            vehicle = Vehicle(
                maker=v["maker"],
                model=v["model"],
                year=v["year"],
                category=v["category"],
                price=v["price"],
                quantity=v["quantity"]
            )
            db.add(vehicle)
        
        # Also seed demo admin and user accounts if not present
        admin_exists = db.query(User).filter(User.email == "admin@dealership.com").first()
        if not admin_exists:
            admin_user = User(
                email="admin@dealership.com",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin_user)

        user_exists = db.query(User).filter(User.email == "user@dealership.com").first()
        if not user_exists:
            reg_user = User(
                email="user@dealership.com",
                hashed_password=get_password_hash("user123"),
                role="user"
            )
            db.add(reg_user)

        db.commit()
        print("Successfully seeded 50 vehicles and demo accounts into database!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
