# AI Projects Portfolio Monorepo

This monorepo contains Qasim’s AI-powered full-stack project portfolio, built using Vite, React, Material UI, and Firebase. Each app lives in its own folder under `apps/` and is structured with separate `frontend` and `backend` directories when applicable.

---

## 📁 Folder Structure

ai-projects-portfolio/
├── apps/
│ ├── glaze/
│ │ ├── frontend/ ← Vite + React UI
│ │ └── backend/ ← Express API server
│ ├── portfolio/
│ │ ├── frontend/ ← Vite + React UI for portfolio
│ │ └── backend/ ← (Planned) Email/contact or analytics server
│ └── [other-apps]/ ← Placeholder folders for future projects
├── firebase.json ← Hosting config (multi-site support)
├── .firebaserc ← Firebase project aliasing
└── package.json ← Root scripts for running/building projects

---

## 🔧 Tech Stack

- **Frontend:** Vite + React + Material UI
- **Backend:** Node.js + Express (per app where needed)
- **Auth & DB:** Firebase Auth, Firestore
- **AI Integration:** OpenAI GPT-4 API (planned)
- **Hosting:** Firebase Hosting (multi-site configuration)

---

## 🚀 Projects

### 1. Ceramic Glaze Website `/glaze`
AI-powered tool to generate and manage ceramic glaze formulas based on prompts or images.

### 2. Portfolio Site `/`
Main hub to showcase all projects, interactive resume, DevHub, and analytics.

Future additions include:
- Career Hub
- Jewellery Toolkit
- Building Operator App
- Fridge Manager
- Content Creator Toolkit

---

## 📦 Commands

| Script | Description |
|--------|-------------|
| `npm run dev:glaze` | Run frontend + backend for glaze project |
| `npm run dev:portfolio` | Run frontend for portfolio (backend WIP) |
| `npm run build` | Build all frontends |
| `npm run start:glaze:backend` | Start backend API for glaze (production) |

---

## 🌐 Hosting Setup

Hosting is configured using Firebase’s `rewrites` so each app lives under its own subpath (e.g. `/glaze`, `/career-hub`). All share Firebase Auth and Firestore if needed.

---