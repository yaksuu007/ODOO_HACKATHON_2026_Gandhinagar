from sqlmodel import Session, create_engine, select
from datetime import datetime
import auth
from models import (
    User, Asset, Allocation, Resource, Booking,
    MaintenanceTicket, Audit, ActivityLog, Department, Organization
)

sqlite_file_name = "assetflow.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

def seed_db():
    with Session(engine) as session:
        # Check if users already seeded
        if session.exec(select(User)).first():
            print("Database already seeded!")
            return

        print("Seeding database...")

        # 1. Users
        admin_user = User(
            username="admin",
            email="admin@assetflow.com",
            hashed_password=auth.hash_password("password123"),
            role="ADMIN"
        )
        auditor_user = User(
            username="auditor",
            email="auditor@assetflow.com",
            hashed_password=auth.hash_password("password123"),
            role="AUDITOR"
        )
        session.add(admin_user)
        session.add(auditor_user)
        session.commit()

        # 2. Organization
        org = Organization(
            name="AssetFlow Enterprise",
            department_count=4,
            employee_count=296
        )
        session.add(org)
        session.commit()

        # 3. Departments
        d1 = Department(name="Engineering", manager="Sarah Jenkins", location="Building A, 3rd Floor")
        d2 = Department(name="Logistics", manager="John Doe", location="Warehouse B")
        d3 = Department(name="Design", manager="Marcus Chen", location="Studio C")
        d4 = Department(name="Finance", manager="Alice Smith", location="Building A, 4th Floor")
        session.add(d1)
        session.add(d2)
        session.add(d3)
        session.add(d4)
        session.commit()

        # 4. Assets
        a1 = Asset(
            id="AST-1042",
            name="MacBook Pro 16\" M2",
            category="Laptops",
            department_id=d1.id,
            status="ACTIVE",
            assigned_to="Sarah Jenkins",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuCI8uqMF4p1IjWfeB7dHVrpNtwIIJmlJD759tfWPEjNCnlTZkVBk2na4vi43LzdPPa0h2tJZrb9RcVxFLeZv3RKVSbbs0cB6F9rGs28pbaepWNByahtwZs06oA6uiG90M2WhCq8bVp8GiS0bWkgDGbiy-haFEMI_oJiL0Dd5K3I8EyVHAIJdMbkwCcKyhmA_fSWMsd3Q54j1MyAsB4LMOXpOL-IaTYYC2S8PI2wHH41W3AtauNoiO9JZA",
            description="M2 Max chip, 32GB RAM, 1TB SSD",
            serial_number="C02GG555Q05D",
            cost=2499.00,
            purchase_date="2023-01-15"
        )
        a2 = Asset(
            id="AST-1043",
            name="Ford Transit Connect 2023",
            category="Vehicles",
            department_id=d2.id,
            status="MAINTENANCE",
            assigned_to="Fleet Pool A",
            description="Logistics delivery van",
            serial_number="1FTYR258933214",
            cost=32000.00,
            purchase_date="2023-03-10"
        )
        a3 = Asset(
            id="AST-1088",
            name="Dell XPS 15",
            category="Laptops",
            department_id=d3.id,
            status="ACTIVE",
            assigned_to="Marcus Chen",
            avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuAVwbFJhePF0FdSUullxJlDQp2WOqhKLhmY1IEaaazHU4v1uS0KAMjPIQPBG-LrcMg8oa_GqGHeM4h1153RW7zk53BS7ZvHMqvtb9QndABRwbgF6YyKBXHeXXZjPU5eAgxnyV07XSa2A_GX1Aj4F3K0GIuiL0bfHGz5vj3A5N45mbO6EOfZtgzmrU1Dhej1V--zqURvsp-q9SvCcblAqCwUbYIzWD0rgMDnnQPRyLceo4gFlaiTMlthbg",
            description="Core i9, 32GB RAM, OLED Screen",
            serial_number="DXPS15-9988",
            cost=1899.00,
            purchase_date="2023-05-18"
        )
        a4 = Asset(
            id="AST-0932",
            name="ThinkPad T14 Gen 3",
            category="Laptops",
            department_id=d4.id,
            status="RETIRED",
            assigned_to="IT Storage",
            description="Standard corporate laptop",
            serial_number="PF-32115",
            cost=1200.00,
            purchase_date="2021-08-22"
        )
        a5 = Asset(
            id="AST-8839",
            name="Industrial Printer A1",
            category="Heavy Equipment",
            department_id=d1.id,
            status="ACTIVE",
            assigned_to="Production Line",
            description="High-volume printing unit",
            serial_number="IP-8839-XYZ",
            cost=7500.00,
            purchase_date="2022-11-05"
        )
        session.add(a1)
        session.add(a2)
        session.add(a3)
        session.add(a4)
        session.add(a5)
        session.commit()

        # 5. Allocations
        al1 = Allocation(asset_id=a1.id, employee_name="Sarah Jenkins", department="Engineering", allocated_at="2023-01-16 09:00", notes="Primary development machine")
        al2 = Allocation(asset_id=a3.id, employee_name="Marcus Chen", department="Design", allocated_at="2023-05-19 10:00", notes="UI/UX prototyping")
        session.add(al1)
        session.add(al2)
        session.commit()

        # 6. Resources
        r1 = Resource(name="HVAC System", type="DEVICE", capacity=0, location="Building A, Roof", status="MAINTENANCE")
        r2 = Resource(name="Fleet Vehicle Bay 4", type="VEHICLE", capacity=1, location="Bay 4", status="AVAILABLE")
        r3 = Resource(name="Network Switch B2", type="DEVICE", capacity=24, location="Server Room B", status="AVAILABLE")
        r4 = Resource(name="Main Conference Room", type="ROOM", capacity=18, location="Building A, 1st Floor", status="AVAILABLE")
        session.add(r1)
        session.add(r2)
        session.add(r3)
        session.add(r4)
        session.commit()

        # 7. Bookings
        b1 = Booking(resource_id=r4.id, employee_name="Sarah Jenkins", purpose="Q3 Engineering Retrospective", start_time="2023-10-24 14:00", end_time="2023-10-24 16:00", status="APPROVED")
        session.add(b1)
        session.commit()

        # 8. Maintenance Tickets
        t1 = MaintenanceTicket(asset_id=a2.id, description="Fleet Vehicle Calibration - Bay 4 routine checks", priority="MEDIUM", status="PENDING", scheduled_date="2023-10-26", cost=150.0)
        t2 = MaintenanceTicket(asset_id=a1.id, description="HVAC System Check / Fan repair", priority="HIGH", status="PENDING", scheduled_date="2023-10-24", cost=320.0)
        session.add(t1)
        session.add(t2)
        session.commit()

        # 9. Audits
        aud1 = Audit(id="AD-332", title="Q3 Safety Audit", auditor_name="Sarah Jenkins", scheduled_date="2023-10-24", status="ACTIVE")
        session.add(aud1)
        session.commit()

        # 10. Activity Logs
        logs = [
            ActivityLog(username="admin", action="UPDATE_STATUS", entity_type="ASSET", entity_id="AST-8839", timestamp="2026-07-12T10:42:00Z", details="Industrial Printer A1 status updated to ACTIVE"),
            ActivityLog(username="admin", action="CREATE_MAINTENANCE", entity_type="ASSET", entity_id="AST-1043", timestamp="2026-07-12T09:15:00Z", details="Forklift Unit 04 maintenance ticket created"),
            ActivityLog(username="admin", action="DECOMMISSION", entity_type="ASSET", entity_id="AST-0932", timestamp="2026-07-11T16:30:00Z", details="ThinkPad T14 Gen 3 decommissioned and RETIRED"),
            ActivityLog(username="admin", action="CREATE_AUDIT", entity_type="AUDIT", entity_id="AD-332", timestamp="2026-07-11T11:00:00Z", details="Q3 Safety Audit scheduled for 2023-10-24")
        ]
        for l in logs:
            session.add(l)
        session.commit()

        print("Database seeding completed successfully!")

if __name__ == "__main__":
    # Create tables if not existing
    from models import SQLModel
    SQLModel.metadata.create_all(engine)
    seed_db()
