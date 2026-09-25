# AI Prompts Used

This is a condensed log of the key prompts used with Claude (Anthropic) while building this project. Some back-and-forth debugging (error messages pasted, small clarifications) is summarized rather than quoted in full.

## Planning
- Asked how many days the assignment would take, then whether it could be done in 1.5 days, and what the minimum required feature set was.
- Asked whether to use TypeScript, given existing experience with the stack.

## Project Setup
- Asked for step-by-step project installation (Express, TypeScript, Prisma, Zod, cookie-parser, React + Vite + Tailwind).
- Debugged several Prisma CLI/version issues (schema config errors, `prisma.config.ts` changes across Prisma versions, pinning to a stable version) by pasting exact terminal errors and asking for fixes.
- Asked about project structure — whether a `services` layer was needed — and settled on a routes → controllers → services pattern.

## Backend: Auth API
- Asked for the auth API (signup, login, logout, `/me`) following the established pattern, with JWT in an httpOnly cookie.
- Debugged a missing `JWT_SECRET` causing a 500 error, and a "user already registered" issue caused by that.

## Backend: Task API
- Asked for the Task CRUD API (create, list, get, update, delete) with per-user ownership checks.
- Asked for confirmation on how many total backend routes were needed, and which were optional vs. required per the assignment.

## Backend: Time Log API
- Asked for the start/stop time tracking API, storing each session as a log entry with duration.
- Asked for a rule to block starting a timer on a completed task, and to auto-stop a running timer if a task is marked completed.

## Backend: Daily Summary API
- Asked for a `/api/summary/today` endpoint returning total time, tasks worked on, completed tasks, and pending/in-progress tasks for a given day range.
- Asked why the endpoint was slow, and applied a fix to run its database queries in parallel.
- Asked about database latency in general, and moved the Neon database to a Singapore region for better performance from India.

## Frontend: Auth Pages
- Asked for Login and Signup pages with an auth context, protected routes, and public-route redirect for already-logged-in users.
- Asked for client-side form validation (name, email, password) in addition to server-side validation.

## Frontend: Task Management
- Asked for the task list page: create, edit, delete, status change, and a live timer that recalculates from a stored start time (so it survives a page refresh).
- Asked to disable/show loading state on Start/Stop, status dropdown, and Add Task buttons to prevent duplicate submissions from repeated clicks.
- Asked to convert inline task editing and delete confirmation into modal dialogs instead of inline forms and `window.confirm`.

## Frontend: Time Logs & Summary Pages
- Asked for a page listing all time logs, and a daily summary page showing the same data as the backend summary endpoint.

## UI/UX Polish
- Asked for a gradient background and fade-in animation on the auth pages.
- Asked for a shared navbar, then iterated on its design (icon-based pill navigation, layout using flexbox instead of a fixed grid to fix tablet-width wrapping issues).
- Asked for shared skeleton loading components (list, table, cards) reused across all pages, and improved their visibility with a shimmer animation.
- Asked for a redesigned branded page loader for auth-check loading states.
- Asked for a redesigned Time Logs page using status-coded cards instead of a plain table.

## Deployment
- Asked for step-by-step deployment instructions for Render (backend) and Vercel (frontend), including required build/start commands and environment variables.
- Debugged a 404 on page refresh on Vercel, fixed with a `vercel.json` rewrite rule for client-side routing.

## Documentation
- Asked for a complete README structure (setup, tech stack, features, API overview) and this prompts log.