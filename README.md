# AI Projects Portfolio Monorepo

This monorepo contains Qasim’s AI-powered project portfolio built with Vite, React and Firebase. Each application lives under `apps/` with its own `frontend` and `backend` packages, while a shared `functions/` directory exposes serverless APIs that integrate with OpenAI and Firebase.

---

## 📁 Folder Structure

ai-projects-portfolio/
├── apps/
│   ├── glaze/
│   │   ├── frontend/ ← React + MUI interface
│   │   └── backend/  ← Express API for local development
│   └── portfolio/
│       ├── frontend/ ← React + Tailwind site
│       └── backend/  ← Express server with Firebase Admin
├── functions/        ← Cloud Functions with OpenAI endpoints
├── public/           ← Compiled static assets for Hosting
├── copy-static.js    ← Copies build output into `public/`
├── firebase.json     ← Hosting & rewrite configuration
├── .firebaserc       ← Firebase project aliasing
└── package.json      ← Root scripts for running/building projects

---

## 🔧 Tech Stack

- **Frontend:** Vite + React (MUI in the glaze app, Tailwind in the portfolio)
- **Backend:** Node.js + Express for each app, plus Firebase Cloud Functions
- **Auth & DB:** Firebase Auth, Firestore and Admin SDK
- **AI Integration:** OpenAI API via Cloud Functions
- **Hosting:** Firebase Hosting with multi-site rewrites

---

## 🚀 Projects

### 1. Ceramic Glaze Website `/glaze`
React + MUI interface with an Express backend. Uses Cloud Functions and OpenAI to generate glaze recipes and images.

### 2. Portfolio Site `/`
React + Tailwind site with an Express API that connects to Firebase for data and authentication.

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
| `npm run dev:glaze` | Run glaze frontend and backend |
| `npm run dev:portfolio` | Run portfolio frontend and backend |
| `npm run dev:glaze:frontend` | Dev glaze frontend only |
| `npm run dev:glaze:backend` | Dev glaze backend only |
| `npm run dev:portfolio:frontend` | Dev portfolio frontend only |
| `npm run dev:portfolio:backend` | Dev portfolio backend only |
| `npm run build` | Build all frontends |
| `npm run build-all` | Build all apps and copy to `public/` |
| `npm run start:glaze:backend` | Start glaze backend in production |
| `npm run start:portfolio:backend` | Start portfolio backend in production |

---

## 🌐 Hosting Setup

Firebase Hosting serves the built apps from `public/` and rewrites API calls to the `functions` directory. Paths like `/glaze` and `/portfolio` load their respective single-page apps while `/api/**` is handled by the Cloud Functions API.

---
