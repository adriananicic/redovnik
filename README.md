# Project Name

Redovnik: a web app for creating queues and counters

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```
git clone https://github.com/adriananicic/redovnik.git
cd redovnik
```

### 2. Set Up the Server

create an .env file in /server and paste
```
DATABASE_URL="postgresql://neondb_owner:npg_RIiKpg4mjY5N@ep-hidden-wave-a9eovke5-pooler.gwc.azure.neon.tech/neondb?sslmode=require"
JWT_SECRET="supersupertajna"
FRONTEND_ORIGIN="http://localhost:3000"
```

in your terminal:
```
cd server
npm install
npx prisma generate
npm run dev
```

### 3. Set Up the Client

create an .env.local file in /frontend and paste 
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

```
cd ../frontend
npm install
npm run dev
```

### 4. Open the Application

Open your browser and go to:

```
http://localhost:3000
```

## Tech Stack

- Frontend: React, NextJs
- Backend: Node.js, Express, PrismaORM
- Database: PostgreSQL
