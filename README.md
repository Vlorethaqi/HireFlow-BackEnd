#  HireFlow Backend API

Backend-i i platformës HireFlow është një REST API e ndërtuar me Node.js dhe Express që menaxhon gjithë logjikën e rekrutimit, autentikimit, aplikimeve, kompanive dhe AI analysis.

---

## Teknologjitë

- Node.js
- Express.js
- PostgreSQL (Sequelize ORM)
- Redis (Caching & Permissions)
- JWT Authentication
- bcrypt
- Swagger (OpenAPI 3.0)
- Jest + Supertest
- OpenAI API
- Background Jobs (In-memory queue)

---


```md
## 📁 Project Structure
src/
│
├── app.js
├── server.js
│
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── migrations/
├── config/
```

## 🔐 Authentication & Authorization

- JWT Access Token (15 min)
- JWT Refresh Token (7 ditë)
- Password hashing me bcrypt
- authMiddleware për verifikim të token-it
- roleMiddleware (ADMIN, HR, WORKER, CANDIDATE)
- permissionMiddleware me Redis caching

### Rolet:
- ADMIN
- HR
- WORKER
- CANDIDATE

---

##  AI & Background Jobs

- AI analiza e aplikimeve bëhet në background
- Endpoint:
  - `POST /ai/analyze-application/:applicationId`
- Statuset:
  - QUEUED
  - RUNNING
  - COMPLETED
  - FAILED
- Rezultatet merren me:
  - `GET /ai/jobs/:jobId`

---

##  API Endpoints

### Auth
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`

### Users
- GET `/users`
- POST `/users`
- PUT `/users/:id`
- DELETE `/users/:id`

### Jobs
- GET `/jobs`
- POST `/jobs`

### Applications
- POST `/applications/apply`
- GET `/applications/me`
- GET `/applications/company`
- PUT `/applications/:id/status`

### Companies
- POST `/companies`
- GET `/companies/me`
- PUT `/companies/:id`

### Skills
- GET `/skills`
- POST `/skills`
- DELETE `/skills/:id`

### Departments
- GET `/departments`
- POST `/departments`

### Notifications
- GET `/notifications`
- PUT `/notifications/:id/read`

### Saved Jobs
- POST `/saved-jobs`
- GET `/saved-jobs`
- DELETE `/saved-jobs/:id`

### AI
- POST `/ai/analyze-application/:applicationId`
- GET `/ai/jobs/:jobId`

---

##  Swagger Documentation

- Swagger UI: http://localhost:3000/api-docs

- OpenAPI JSON: http://localhost:3000/api-docs.json

- ---

##  Testing

- Jest + Supertest

### Run tests:
```npm test```
Modulet e testuara:
Auth
Jobs
Applications
Notifications
Skills
Departments
Candidate Profile

##  Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
