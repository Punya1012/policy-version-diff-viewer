# Policy Version Diff Viewer — Tool-91

A full-stack AI-powered web application for managing
and comparing policy versions.

## Team
- Team: 5 Members
- Sprint: 14 April – 9 May 2026
- Demo Day: 9 May 2026

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- PostgreSQL 15
- Flyway migrations
- Spring Security
- Spring AOP

### Frontend
- React 18 + Vite
- Tailwind CSS
- Axios
- Recharts

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│  Spring     │────▶│ PostgreSQL  │
│  Frontend   │     │   Boot      │     │  Database   │
│  Port 5173  │     │  Port 8080  │     │  Port 5432  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │   Flask     │
                    │ AI Service  │
                    │  Port 5000  │
                    └─────────────┘
```

## Prerequisites

Before running this project make sure you have:
- Java 17
- Node.js 22.x
- PostgreSQL 15
- Maven 3.9.x

## Setup Instructions

### Step 1 — Clone the repository
```bash
git clone https://github.com/Punya1012/policy-version-diff-viewer.git
cd policy-version-diff-viewer
```

### Step 2 — Create .env file
```bash
cp .env.example .env
```
Edit .env with your actual values.

### Step 3 — Create database
```bash
psql -U postgres
CREATE DATABASE tooldb;
\q
```

### Step 4 — Start Backend
```bash
cd backend/tool
.\mvnw spring-boot:run
```
- Backend runs on: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Step 5 — Start Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on: http://localhost:5173

## Demo Credentials
- Username: admin
- Password: admin

## Key Features

### Backend Features
- Full CRUD REST API for policy versions
- Spring Security authentication
- Flyway database migrations
- Spring AOP audit logging
- Swagger/OpenAPI documentation
- CSV export endpoint
- File upload with validation
- Statistics and analytics endpoints

### Frontend Features
- React 18 + Vite + Tailwind CSS
- Login page with AuthContext
- Dashboard with KPI cards and Recharts
- Analytics page with period selector
- List page with search and filter
- Create/Edit form with validation
- Detail page with AI panel
- Responsive design for mobile tablet desktop

### AI Features
- AI description generation
- AI recommendations
- AI report generation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/policy-versions | List all policies |
| POST | /api/policy-versions | Create policy |
| PUT | /api/policy-versions/{id} | Update policy |
| DELETE | /api/policy-versions/{id} | Delete policy |
| GET | /api/policy-versions/search?q= | Search |
| GET | /api/policy-versions/stats | Statistics |
| GET | /api/policy-versions/analytics | Analytics |
| GET | /api/policy-versions/export | CSV export |
| POST | /api/policy-versions/upload | File upload |
| GET | /api/policy-versions/audit-logs | Audit logs |

## Testing
- 10 MockMvc integration tests
- All tests passing with BUILD SUCCESS

## GitHub Repository
https://github.com/Punya1012/policy-version-diff-viewer