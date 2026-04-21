# Mthandizi — Student Profiling Platform

Frontend UI for the Mthandizi student support profiling system built with Next.js 16, Tailwind CSS, and Framer Motion.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20.x |
| npm | >= 10.x |

If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in this directory to automatically switch to the correct Node version.

---

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd frontend/ui

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## Login Credentials (Mock — no backend yet)

| Role | Email | Password |
|------|-------|----------|
| Student | any `@unima.ac.mw` address | any value |
| Admin | `admin@unima.ac.mw` | any value |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Verify
│   ├── (student)/       # Student portal pages
│   ├── (admin)/         # Admin portal pages
│   └── page.tsx         # Landing page
├── components/
│   ├── student/wizard/  # Multi-step application form
│   ├── student/nav.tsx  # Student sidebar
│   └── ui/              # Shared UI primitives
├── hooks/               # Custom React hooks
├── lib/
│   ├── constants/       # Malawi districts & T/As data
│   ├── store/           # Zustand state (application form)
│   └── utils.ts         # Utility functions
└── types/               # TypeScript types
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
