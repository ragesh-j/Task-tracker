# Task and Time Tracker

A full-stack app to manage tasks, track time spent on them with a real-time timer, and view daily productivity summaries.

## Live Demo

- **App:** https://task-tracker-omega-lac-56.vercel.app/
- **API:** https://task-tracker-r4iv.onrender.com/

## Test Credentials

```
Email: demo@tasktracker.com
Password: demo123
```

## Tech Stack

**Backend:** Node.js, Express 5, TypeScript, PostgreSQL (Neon), Prisma, Zod, JWT auth with httpOnly cookies, Groq API (AI task suggestions)

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Axios

**Deployment:** Render (backend), Vercel (frontend)

## Features

- Email/password signup, login, logout with JWT stored in an httpOnly cookie
- Full task CRUD: create, edit (via modal), delete (with confirmation modal), and status changes (Pending / In Progress / Completed)
- Each user only sees and manages their own tasks and time logs
- AI-powered task suggestion: turns a rough task note (e.g. "follow up with designer") into a clearer title and description, using Groq's API (optional feature, triggered on demand via a "Suggest" button)
- Start/Stop time tracking per task, with a live elapsed timer that keeps counting correctly even after a page refresh
- Time tracking is blocked on completed tasks, and a running timer auto-stops when a task is marked Completed
- Time logs page showing every tracked session, with a live indicator for a running timer
- Daily summary page: total time tracked today, tasks worked on with time breakdown, completed tasks, and pending/in-progress tasks
- Input validation and clear error messages on both client and server
- Loading skeletons for a smoother experience on slower connections

## Project Structure

```
task-tracker/
├── server/    # Express + TypeScript API
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── schemas/
│       └── lib/
└── client/    # React + Vite frontend
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        ├── hooks/
        └── api/
```

## Local Setup

### Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
```
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=any-long-random-string
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your-groq-api-key
```

`GROQ_API_KEY` is only needed for the AI task suggestion feature — get a free key at [console.groq.com](https://console.groq.com). The rest of the app works without it.

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```
Server runs at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
cp .env.example .env
```

Fill in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```
App runs at `http://localhost:5173`.

## API Overview

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Current user |

**Tasks**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | List your tasks |
| GET | `/api/tasks/:id` | Get one task |
| PATCH | `/api/tasks/:id` | Update title, description, or status |
| DELETE | `/api/tasks/:id` | Delete a task |

**Time Logs**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/timelogs/start` | Start tracking a task |
| POST | `/api/timelogs/stop` | Stop tracking a task |
| GET | `/api/timelogs` | List your time logs |
| DELETE | `/api/timelogs/:id` | Delete a time log |

**Summary**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/summary/today?from=&to=` | Today's summary (client sends the day's start/end in ISO format) |

**AI Suggestion**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/suggest` | Turn rough task input into a clearer title and description |

All routes above except signup/login require authentication (JWT cookie). Every task and time log endpoint is scoped to the logged-in user.

## AI Usage

This project was built with help from Claude (Anthropic) — used for scaffolding, debugging real errors, and UI iteration, while I made the architecture, feature, and scope decisions myself.

Prompts used are listed in [`prompts.md`](./prompts.md).
