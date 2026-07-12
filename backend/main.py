import jwt
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlmodel import Session, SQLModel, create_engine, select

import auth
from models import (
    User, Asset, Allocation, Resource, Booking,
    MaintenanceTicket, Audit, ActivityLog, Department, Organization,
    SupportTicket, Notification
)

sqlite_file_name = "assetflow.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="AssetFlow ERP Backend", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Auth Dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)) -> Optional[User]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

# ─── Pydantic Request Schemas ──────────────────────────────────────────────────

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    role: str = "EMPLOYEE"

class AssetCreate(BaseModel):
    id: str
    name: str
    category: str
    department_id: Optional[int] = None
    status: str = "ACTIVE"
    assigned_to: Optional[str] = None
    avatar_url: Optional[str] = None
    description: Optional[str] = None
    serial_number: Optional[str] = None
    cost: float = 0.0
    purchase_date: Optional[str] = None

class AllocationCreate(BaseModel):
    asset_id: str
    employee_name: str
    department: str
    notes: Optional[str] = None

class BookingCreate(BaseModel):
    resource_id: int
    employee_name: str
    purpose: str
    start_time: str
    end_time: str

class MaintenanceCreate(BaseModel):
    asset_id: str
    description: str
    priority: str = "MEDIUM"
    scheduled_date: str
    cost: Optional[float] = 0.0

class MaintenanceStatusUpdate(BaseModel):
    """BUG FIX #1: Validated status update via request body instead of raw query param."""
    status: str

    def validate_status(self):
        allowed = {"PENDING", "IN_PROGRESS", "COMPLETED"}
        if self.status not in allowed:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid status '{self.status}'. Must be one of: {sorted(allowed)}"
            )

class AuditCreate(BaseModel):
    id: str
    title: str
    auditor_name: str
    scheduled_date: str

class AuditComplete(BaseModel):
    """BUG FIX #2: Move audit results to request body to handle special characters and long text."""
    results: str

class DepartmentCreate(BaseModel):
    name: str
    manager: str
    location: str

class SupportTicketCreate(BaseModel):
    subject: str
    message: str
    priority: str = "MEDIUM"

class SupportTicketReply(BaseModel):
    reply: str

class NotificationCreate(BaseModel):
    title: str
    message: str
    category: str = "SYSTEM"
    username: str


# ─── DB Initialization ─────────────────────────────────────────────────────────

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# ─── Auth Routes ───────────────────────────────────────────────────────────────

@app.post("/api/auth/register")
def register(user_data: UserRegister, db: Session = Depends(get_session)):
    existing_user = db.exec(select(User).where(User.username == user_data.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=auth.hash_password(user_data.password),
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    log = ActivityLog(
        username=db_user.username,
        action="REGISTER",
        entity_type="USER",
        entity_id=str(db_user.id),
        timestamp=datetime.utcnow().isoformat(),
        details=f"User {db_user.username} registered with role {db_user.role}"
    )
    db.add(log)
    db.commit()
    return {"status": "success", "username": db_user.username}

@app.post("/api/auth/login")
def login(login_data: UserLogin, db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.username == login_data.username)).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.get("/api/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at
    }


# ─── Dashboard Routes ──────────────────────────────────────────────────────────

@app.get("/api/dashboard/stats")
def get_stats(
    # BUG FIX #7: Added auth guard — dashboard stats were publicly accessible.
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    total_assets = len(db.exec(select(Asset)).all())
    active_assets = len(db.exec(select(Asset).where(Asset.status == "ACTIVE")).all())
    maintenance_assets = len(db.exec(select(Asset).where(Asset.status == "MAINTENANCE")).all())
    retired_assets = len(db.exec(select(Asset).where(Asset.status == "RETIRED")).all())

    resources = db.exec(select(Resource)).all()
    available_resources = len([r for r in resources if r.status == "AVAILABLE"])
    capacity_pct = int((available_resources / len(resources)) * 100) if resources else 0

    pending_maint = len(db.exec(select(MaintenanceTicket).where(MaintenanceTicket.status != "COMPLETED")).all())
    critical_maint = len(db.exec(select(MaintenanceTicket).where(MaintenanceTicket.status != "COMPLETED").where(MaintenanceTicket.priority == "HIGH")).all())

    active_audits = len(db.exec(select(Audit).where(Audit.status == "ACTIVE")).all())

    return {
        "totalAssets": total_assets,
        "activeAssets": active_assets,
        "maintenanceAssets": maintenance_assets,
        "retiredAssets": retired_assets,
        "resourceCapacity": capacity_pct,
        "pendingMaintenance": pending_maint,
        "criticalMaintenance": critical_maint,
        "activeAudits": active_audits
    }

@app.get("/api/dashboard/utilization")
def get_utilization(
    # BUG FIX #7: Added auth guard — utilization was publicly accessible.
    current_user: User = Depends(get_current_user)
):
    return [
        {"day": "Mon", "value": 45},
        {"day": "Tue", "value": 60},
        {"day": "Wed", "value": 85},
        {"day": "Thu", "value": 70},
        {"day": "Fri", "value": 50},
        {"day": "Sat", "value": 65}
    ]


# ─── Asset Routes ──────────────────────────────────────────────────────────────

@app.get("/api/assets", response_model=List[Asset])
def get_assets(
    # BUG FIX #8: Added auth guard — asset listing was publicly accessible.
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    return db.exec(select(Asset)).all()

@app.post("/api/assets", response_model=Asset)
def create_asset(asset_data: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    existing = db.get(Asset, asset_data.id)
    if existing:
        raise HTTPException(status_code=400, detail="Asset ID already exists")

    db_asset = Asset(**asset_data.dict())
    db.add(db_asset)

    log = ActivityLog(
        username=current_user.username,
        action="CREATE_ASSET",
        entity_type="ASSET",
        entity_id=db_asset.id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Asset {db_asset.name} registered under {db_asset.category}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.put("/api/assets/{asset_id}", response_model=Asset)
def update_asset(asset_id: str, asset_data: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_asset = db.get(Asset, asset_id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    for key, val in asset_data.dict().items():
        setattr(db_asset, key, val)

    log = ActivityLog(
        username=current_user.username,
        action="UPDATE_ASSET",
        entity_type="ASSET",
        entity_id=db_asset.id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Asset {db_asset.name} updated: Status={db_asset.status}, Assigned={db_asset.assigned_to}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.delete("/api/assets/{asset_id}")
def delete_asset(asset_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_asset = db.get(Asset, asset_id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # BUG FIX #3: Check for FK-linked records before deleting to prevent constraint violations.
    linked_allocs = db.exec(select(Allocation).where(Allocation.asset_id == asset_id)).all()
    linked_tickets = db.exec(select(MaintenanceTicket).where(MaintenanceTicket.asset_id == asset_id)).all()
    if linked_allocs:
        raise HTTPException(
            status_code=409,
            detail=f"Cannot delete asset '{asset_id}' — it has {len(linked_allocs)} allocation record(s). Remove them first."
        )
    if linked_tickets:
        raise HTTPException(
            status_code=409,
            detail=f"Cannot delete asset '{asset_id}' — it has {len(linked_tickets)} maintenance ticket(s). Resolve them first."
        )

    db.delete(db_asset)
    log = ActivityLog(
        username=current_user.username,
        action="DELETE_ASSET",
        entity_type="ASSET",
        entity_id=asset_id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Asset {db_asset.name} deleted"
    )
    db.add(log)
    db.commit()
    return {"status": "success"}


# ─── Allocation Routes ─────────────────────────────────────────────────────────

@app.get("/api/allocations", response_model=List[Allocation])
def get_allocations(
    # BUG FIX #8: Added auth guard — allocations were publicly accessible.
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    return db.exec(select(Allocation)).all()

@app.post("/api/allocations", response_model=Allocation)
def allocate_asset(alloc_data: AllocationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_asset = db.get(Asset, alloc_data.asset_id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # BUG FIX #4: Prevent double-allocation — check if asset is already assigned.
    if db_asset.assigned_to:
        raise HTTPException(
            status_code=400,
            detail=f"Asset '{alloc_data.asset_id}' is already allocated to '{db_asset.assigned_to}'. Return it before re-allocating."
        )

    db_alloc = Allocation(
        asset_id=alloc_data.asset_id,
        employee_name=alloc_data.employee_name,
        department=alloc_data.department,
        allocated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        notes=alloc_data.notes
    )
    db.add(db_alloc)

    db_asset.assigned_to = alloc_data.employee_name
    db_asset.status = "ACTIVE"
    db.add(db_asset)

    log = ActivityLog(
        username=current_user.username,
        action="ALLOCATE_ASSET",
        entity_type="ASSET",
        entity_id=db_asset.id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Asset {db_asset.name} ({db_asset.id}) allocated to {alloc_data.employee_name} ({alloc_data.department})"
    )
    db.add(log)
    db.commit()
    db.refresh(db_alloc)
    return db_alloc


# ─── Resource Routes ───────────────────────────────────────────────────────────

@app.get("/api/resources", response_model=List[Resource])
def get_resources(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return db.exec(select(Resource)).all()

@app.get("/api/resources/bookings", response_model=List[Booking])
def get_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return db.exec(select(Booking)).all()

@app.post("/api/resources/bookings", response_model=Booking)
def create_booking(booking_data: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_resource = db.get(Resource, booking_data.resource_id)
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    db_booking = Booking(
        resource_id=booking_data.resource_id,
        employee_name=booking_data.employee_name,
        purpose=booking_data.purpose,
        start_time=booking_data.start_time,
        end_time=booking_data.end_time,
        status="APPROVED"
    )
    db.add(db_booking)

    db_resource.status = "BOOKED"
    db.add(db_resource)

    log = ActivityLog(
        username=current_user.username,
        action="CREATE_BOOKING",
        entity_type="RESOURCE",
        entity_id=str(db_resource.id),
        timestamp=datetime.utcnow().isoformat(),
        details=f"Booked resource {db_resource.name} for {booking_data.employee_name}. Purpose: {booking_data.purpose}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.delete("/api/resources/bookings/{booking_id}")
def cancel_booking(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    """BUG FIX #6: Release the resource back to AVAILABLE when a booking is cancelled."""
    db_booking = db.get(Booking, booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Cancel the booking
    db_booking.status = "CANCELLED"
    db.add(db_booking)

    # Release resource — only if no other active bookings exist for this resource
    other_active = db.exec(
        select(Booking).where(
            Booking.resource_id == db_booking.resource_id,
            Booking.id != booking_id,
            Booking.status == "APPROVED"
        )
    ).first()

    if not other_active:
        db_resource = db.get(Resource, db_booking.resource_id)
        if db_resource and db_resource.status == "BOOKED":
            db_resource.status = "AVAILABLE"
            db.add(db_resource)

    log = ActivityLog(
        username=current_user.username,
        action="CANCEL_BOOKING",
        entity_type="RESOURCE",
        entity_id=str(db_booking.resource_id),
        timestamp=datetime.utcnow().isoformat(),
        details=f"Booking #{booking_id} cancelled. Resource released."
    )
    db.add(log)
    db.commit()
    return {"status": "success", "booking_id": booking_id}


# ─── Maintenance Routes ────────────────────────────────────────────────────────

@app.get("/api/maintenance", response_model=List[MaintenanceTicket])
def get_maintenance(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return db.exec(select(MaintenanceTicket)).all()

@app.post("/api/maintenance", response_model=MaintenanceTicket)
def create_maintenance(maint_data: MaintenanceCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_asset = db.get(Asset, maint_data.asset_id)
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    db_ticket = MaintenanceTicket(
        asset_id=maint_data.asset_id,
        description=maint_data.description,
        priority=maint_data.priority,
        status="PENDING",
        scheduled_date=maint_data.scheduled_date,
        cost=maint_data.cost
    )
    db.add(db_ticket)

    db_asset.status = "MAINTENANCE"
    db.add(db_asset)

    log = ActivityLog(
        username=current_user.username,
        action="LOG_MAINTENANCE",
        entity_type="ASSET",
        entity_id=db_asset.id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Maintenance logged for {db_asset.name} ({db_asset.id}). Priority: {maint_data.priority}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@app.put("/api/maintenance/{ticket_id}", response_model=MaintenanceTicket)
def update_maintenance(
    ticket_id: int,
    # BUG FIX #1: Accept status via validated query param (backward compat with frontend).
    ticket_status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    # Validate allowed status values
    allowed_statuses = {"PENDING", "IN_PROGRESS", "COMPLETED"}
    if ticket_status not in allowed_statuses:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid status '{ticket_status}'. Must be one of: {sorted(allowed_statuses)}"
        )

    ticket = db.get(MaintenanceTicket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = ticket_status
    db.add(ticket)

    if ticket_status == "COMPLETED":
        asset = db.get(Asset, ticket.asset_id)
        if asset:
            asset.status = "ACTIVE"
            db.add(asset)

    log = ActivityLog(
        username=current_user.username,
        action="UPDATE_MAINTENANCE",
        entity_type="MAINTENANCE_TICKET",
        entity_id=str(ticket_id),
        timestamp=datetime.utcnow().isoformat(),
        details=f"Maintenance ticket #{ticket_id} status updated to {ticket_status}"
    )
    db.add(log)
    db.commit()
    db.refresh(ticket)
    return ticket


# ─── Audit Routes ──────────────────────────────────────────────────────────────

@app.get("/api/audits", response_model=List[Audit])
def get_audits(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return db.exec(select(Audit)).all()

@app.post("/api/audits", response_model=Audit)
def create_audit(audit_data: AuditCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    existing = db.get(Audit, audit_data.id)
    if existing:
        raise HTTPException(status_code=400, detail="Audit ID already exists")

    db_audit = Audit(
        id=audit_data.id,
        title=audit_data.title,
        auditor_name=audit_data.auditor_name,
        scheduled_date=audit_data.scheduled_date,
        status="ACTIVE"
    )
    db.add(db_audit)

    log = ActivityLog(
        username=current_user.username,
        action="CREATE_AUDIT",
        entity_type="AUDIT",
        entity_id=db_audit.id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"New Audit '{db_audit.title}' ({db_audit.id}) scheduled by {db_audit.auditor_name}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_audit)
    return db_audit

@app.put("/api/audits/{audit_id}", response_model=Audit)
def complete_audit(
    audit_id: str,
    # BUG FIX #2: Accept results via JSON body — query strings break with special characters
    # and have URL length limits that can silently truncate long audit findings.
    body: AuditComplete,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    audit = db.get(Audit, audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")

    audit.status = "COMPLETED"
    audit.results = body.results
    db.add(audit)

    log = ActivityLog(
        username=current_user.username,
        action="COMPLETE_AUDIT",
        entity_type="AUDIT",
        entity_id=audit_id,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Audit '{audit.title}' ({audit_id}) marked completed"
    )
    db.add(log)
    db.commit()
    db.refresh(audit)
    return audit


# ─── Organization Routes ───────────────────────────────────────────────────────

@app.get("/api/organization/departments", response_model=List[Department])
def get_departments(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return db.exec(select(Department)).all()

@app.post("/api/organization/departments", response_model=Department)
def create_department(dept_data: DepartmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_dept = Department(**dept_data.dict())
    db.add(db_dept)

    org = db.exec(select(Organization)).first()
    if org:
        org.department_count += 1
        db.add(org)

    log = ActivityLog(
        username=current_user.username,
        action="CREATE_DEPT",
        entity_type="DEPARTMENT",
        entity_id=dept_data.name,
        timestamp=datetime.utcnow().isoformat(),
        details=f"Department {dept_data.name} created. Manager: {dept_data.manager}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_dept)
    return db_dept

@app.get("/api/organization/metrics")
def get_org_metrics(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    org = db.exec(select(Organization)).first()
    if not org:
        org = Organization(name="AssetFlow Enterprise", department_count=6, employee_count=296)
        db.add(org)
        db.commit()
        db.refresh(org)
    return org


# ─── Activity Log Routes ───────────────────────────────────────────────────────

@app.get("/api/activity", response_model=List[ActivityLog])
def get_activity(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    # BUG FIX #5: Order by id DESC (auto-increment integer) — reliable insertion order,
    # avoids broken sort when timestamp strings have inconsistent formats.
    return db.exec(select(ActivityLog).order_by(ActivityLog.id.desc())).all()


# ─── Support Ticket Routes ─────────────────────────────────────────────────────
# BUG FIX #10: SupportTicket model existed but had no routes. Added full CRUD.

@app.get("/api/support", response_model=List[SupportTicket])
def get_support_tickets(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    if current_user.role == "ADMIN":
        return db.exec(select(SupportTicket).order_by(SupportTicket.id.desc())).all()
    # Non-admins only see their own tickets
    return db.exec(select(SupportTicket).where(SupportTicket.username == current_user.username).order_by(SupportTicket.id.desc())).all()

@app.post("/api/support", response_model=SupportTicket)
def create_support_ticket(ticket_data: SupportTicketCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    db_ticket = SupportTicket(
        subject=ticket_data.subject,
        message=ticket_data.message,
        priority=ticket_data.priority,
        username=current_user.username,
        status="OPEN"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@app.put("/api/support/{ticket_id}/reply", response_model=SupportTicket)
def reply_support_ticket(ticket_id: int, body: SupportTicketReply, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can reply to support tickets.")
    ticket = db.get(SupportTicket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
    ticket.reply = body.reply
    ticket.status = "RESOLVED"
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


# ─── Notification Routes ───────────────────────────────────────────────────────
# BUG FIX #10: Notification model existed but had no routes. Added full CRUD.

@app.get("/api/notifications", response_model=List[Notification])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return db.exec(
        select(Notification)
        .where(Notification.username == current_user.username)
        .order_by(Notification.id.desc())
    ).all()

@app.post("/api/notifications", response_model=Notification)
def create_notification(notif_data: NotificationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can broadcast notifications.")
    db_notif = Notification(
        title=notif_data.title,
        message=notif_data.message,
        category=notif_data.category,
        username=notif_data.username,
        is_read=False
    )
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

@app.put("/api/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    notif = db.get(Notification, notif_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notif.username != current_user.username:
        raise HTTPException(status_code=403, detail="Cannot mark another user's notification as read.")
    notif.is_read = True
    db.add(notif)
    db.commit()
    return {"status": "success"}
