# 📌 Overview

AssetFlow is a modern Enterprise Asset & Resource Management System (ERP) that helps organizations efficiently manage their physical assets and shared resources.

The system enables organizations to register assets, allocate them to employees or departments, manage maintenance workflows, schedule resource bookings, perform audits, and monitor operations through dashboards and reports.

Unlike traditional spreadsheet-based asset tracking, AssetFlow provides a centralized, secure, and role-based platform with real-time visibility into asset status and utilization.

---

# 🎯 Problem Statement

Organizations often struggle with:

- Manual asset tracking
- Double allocation of assets
- Poor maintenance scheduling
- Resource booking conflicts
- Lack of audit records
- No centralized monitoring

AssetFlow solves these problems by providing a complete ERP-based Asset Management platform.

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- Employee Signup
- Forgot Password
- Session Management
- Role-Based Authentication

---

## 🏢 Organization Management

- Department Management
- Asset Category Management
- Employee Directory
- Role Assignment
- Department Hierarchy

---

## 💻 Asset Management

- Register Assets
- Asset Tag Generation
- QR Code Support
- Asset Images/Documents
- Asset Lifecycle Tracking
- Asset History

Asset Status:

- Available
- Allocated
- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

---

## 🔄 Asset Allocation

- Allocate Assets
- Return Assets
- Transfer Requests
- Conflict Detection
- Expected Return Date
- Overdue Tracking

---

## 📅 Resource Booking

- Meeting Room Booking
- Vehicle Booking
- Equipment Booking
- Calendar View
- Overlap Validation
- Booking Reminders

---

## 🔧 Maintenance Management

- Raise Maintenance Requests
- Approval Workflow
- Technician Assignment
- Maintenance History
- Asset Status Update

Workflow:

Pending
→ Approved / Rejected
→ Technician Assigned
→ In Progress
→ Resolved

---

## 📋 Asset Audit

- Create Audit Cycle
- Assign Auditors
- Verify Assets
- Missing Asset Detection
- Damage Reporting
- Discrepancy Reports

---

## 📊 Reports & Analytics

- Asset Utilization
- Maintenance Reports
- Department-wise Reports
- Booking Heatmaps
- Export Reports

---

## 🔔 Notifications

- Asset Assigned
- Transfer Approved
- Maintenance Updates
- Booking Confirmation
- Return Reminder
- Audit Notifications

---

# 👥 User Roles

## 👑 Admin

- Manage Departments
- Manage Categories
- Manage Employees
- Assign Roles
- View Reports
- Create Audit Cycles

---

## 📦 Asset Manager

- Register Assets
- Allocate Assets
- Approve Transfers
- Approve Maintenance
- Verify Asset Returns

---

## 🏢 Department Head

- View Department Assets
- Approve Requests
- Book Shared Resources

---

## 👤 Employee

- View Assigned Assets
- Book Resources
- Raise Maintenance Requests
- Request Transfers
- Return Assets

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Flask
- Flask JWT Authentication
- SQLAlchemy

## Database

- PostgreSQL

## Storage

- Cloudinary / Local Storage

## Authentication

- JWT Authentication

---

# 📂 Project Structure

```
AssetFlow/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── config/
│   └── requirements.txt
│
├── database/
│
├── docs/
│
├── README.md
│
└── .gitignore
```

---

# 📄 Major Modules

- Authentication
- Dashboard
- Organization Setup
- Asset Directory
- Asset Allocation
- Resource Booking
- Maintenance Management
- Asset Audit
- Reports & Analytics
- Notifications

---

# 🔄 Asset Lifecycle

```
Available
     │
     ▼
Allocated
     │
     ▼
Returned
     │
     ▼
Available

OR

Available
     │
     ▼
Under Maintenance
     │
     ▼
Available

OR

Available
     │
     ▼
Lost

OR

Available
     │
     ▼
Retired
```

---

# 🚦 Workflow

```
Admin
   │
   ▼
Create Departments

   │
   ▼
Register Employees

   │
   ▼
Assign Roles

   │
   ▼
Asset Manager Registers Assets

   │
   ▼
Allocate Assets

   │
   ▼
Employees Use Assets

   │
   ▼
Maintenance / Booking

   │
   ▼
Audit

   │
   ▼
Reports
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AssetFlow.git
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

## Database

Create PostgreSQL database:

```sql
CREATE DATABASE assetflow;
```

Update database configuration in the backend and run migrations.

---

# 📈 Future Improvements

- QR Code Scanner
- Barcode Support
- Email Notifications
- SMS Notifications
- Mobile Application
- AI-based Asset Prediction
- Predictive Maintenance
- RFID Integration
- Multi-Organization Support

---

# 🤝 Contributors

- **MIKEY**
- Team Members

---

# 📜 License

This project is developed for educational and hackathon purposes.

---

# ⭐ Acknowledgements

Inspired by modern Enterprise Resource Planning (ERP) systems for efficient Asset & Resource Management.