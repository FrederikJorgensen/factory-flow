# FactoryFlow

A real-time factory floor monitoring system that allows workers to update equipment states from mobile devices and supervisors to review historical state changes.

## Overview

FactoryFlow solves three problems on the factory floor:

- Workers can update equipment states (Red / Yellow / Green) locally from a mobile device
- Everyone can see the current state of all equipment at a glance
- Supervisors can review a full history of state changes per equipment

## Monorepo Structure
```
apps/
  factory-floor/   # React PWA — worker + supervisor UI
  server/          # Express API server
```

## Getting Started

Install dependencies:
```bash
npm install
```

Run both apps in development:
```bash
npm run dev
```

| App | URL |
|-----|-----|
| Factory Floor | http://localhost:5173 |
| Supervisor View | http://localhost:5173/supervisor |

## Tech Stack

**Frontend** — React, TypeScript, Tailwind CSS, Vite, PWA (via vite-plugin-pwa), React Router

**Backend** — Node.js, Express, TypeScript
