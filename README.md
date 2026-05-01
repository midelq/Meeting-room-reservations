# meeting-room-reservations

Book meeting rooms, manage members, track schedules.

---

## Stack

**Client** — React 19, TypeScript, Vite  
**Server** — Express, TypeORM, PostgreSQL  
**Auth** — JWT (localStorage)

---

## Libraries

### client

| package | what for |
|---|---|
| `react-router-dom` | routing |
| `@tanstack/react-query` | server state, caching |
| `react-hook-form` | form state |
| `@hookform/resolvers` + `zod` | schema validation |
| `axios` | HTTP client |
| `react-datepicker` | date/time picker |
| `react-hot-toast` | toast notifications |
| `date-fns` | date formatting |
| `lucide-react` | icons |
| `tailwindcss` v4 | utility classes |

### server

| package | what for |
|---|---|
| `express` | HTTP server |
| `typeorm` | ORM |
| `pg` | PostgreSQL driver |
| `bcryptjs` | password hashing |
| `jsonwebtoken` | JWT |
| `zod` | request validation |
| `helmet` | security headers |
| `cors` | cross-origin |
| `dotenv` | env vars |
| `reflect-metadata` | TypeORM decorators |

---

## Setup

**1. Start the database**
```bash
docker-compose up -d
```

**2. Server**
```bash
cd server
cp .env.example .env
npm install
npm run dev
# runs on :3001
```

**3. Client**
```bash
cd client
npm install
npm run dev
# runs on :5173
```

---

## Roles

- **Admin** — creates/edits/deletes bookings, manages members  
- **User** — views room, joins/leaves bookings  

Room creator gets admin automatically.

---

## DB access

```bash
docker exec -it meeting-room-db psql -U postgres -d meeting_rooms
```
