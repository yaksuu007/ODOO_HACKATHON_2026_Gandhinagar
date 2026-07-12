from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str
    hashed_password: str
    role: str = "EMPLOYEE"  # ADMIN, AUDITOR, EMPLOYEE
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Organization(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    department_count: int = 0
    employee_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Department(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    manager: str
    location: str

class Asset(SQLModel, table=True):
    id: str = Field(primary_key=True)  # e.g., AST-1042
    name: str
    category: str
    department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    status: str = "ACTIVE"  # ACTIVE, MAINTENANCE, RETIRED
    assigned_to: Optional[str] = None
    avatar_url: Optional[str] = None
    description: Optional[str] = None
    serial_number: Optional[str] = None
    cost: float = 0.0
    purchase_date: Optional[str] = None

class Allocation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    asset_id: str = Field(foreign_key="asset.id")
    employee_name: str
    department: str
    allocated_at: str
    returned_at: Optional[str] = None
    notes: Optional[str] = None

class Resource(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str  # VEHICLE, ROOM, DEVICE
    capacity: int = 0
    location: str
    status: str = "AVAILABLE"  # AVAILABLE, BOOKED, MAINTENANCE

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resource_id: int = Field(foreign_key="resource.id")
    employee_name: str
    purpose: str
    start_time: str
    end_time: str
    status: str = "PENDING"  # PENDING, APPROVED, CANCELLED

class MaintenanceTicket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    asset_id: str = Field(foreign_key="asset.id")
    description: str
    priority: str = "MEDIUM"  # HIGH, MEDIUM, LOW
    status: str = "PENDING"  # PENDING, IN_PROGRESS, COMPLETED
    scheduled_date: str
    cost: Optional[float] = 0.0

class Audit(SQLModel, table=True):
    id: str = Field(primary_key=True)  # e.g., AD-332
    title: str
    auditor_name: str
    scheduled_date: str
    status: str = "ACTIVE"  # ACTIVE, COMPLETED
    results: Optional[str] = None

class ActivityLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    action: str
    entity_type: str
    entity_id: str
    timestamp: str
    details: Optional[str] = None

class SupportTicket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject: str
    message: str
    username: str
    status: str = "OPEN"  # OPEN, RESOLVED
    priority: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reply: Optional[str] = None

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    message: str
    category: str = "SYSTEM"  # SYSTEM, ASSET, MAINTENANCE, AUDIT
    is_read: bool = Field(default=False)
    username: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

