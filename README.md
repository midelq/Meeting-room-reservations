# meeting-room-reservations

Book meeting rooms, manage members, track schedules.

---

## Stack

**Client** — React, TypeScript, Vite, TanStack Query, react-hook-form  
**Server** — Express, TypeORM, PostgreSQL  
**Auth** — JWT (localStorage)

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
