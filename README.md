# Diagnostic Testing Lab Management System (MERN Stack)

A full-stack lab management system with 3 roles: **Patient**, **Lab Staff**, and **Admin**.

## Tech Stack
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios, Recharts, Lucide Icons, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer

## Folder Structure
```
lab-management-system/
├── backend/     -> Express + MongoDB API
└── frontend/    -> React (Vite) client
```

---

## 1. Prerequisites (install these first)

| Tool | Why | Check version |
|---|---|---|
| **Node.js** (v18 or newer) | Runs backend + frontend | `node -v` |
| **npm** (comes with Node) | Installs packages | `npm -v` |
| **VS Code** | Editor | — |

Recommended VS Code extensions (optional but helpful):
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (for testing API endpoints)

*Note: For local development, this project uses an in-memory MongoDB database automatically. You do not need to install MongoDB on your machine.*

---

## 2. Open the project in VS Code
Unzip the folder, then:
```
File → Open Folder → select "lab-management-system"
```
Open a terminal in VS Code: `` Ctrl + ` `` (or `View → Terminal`).

---

## 3. Backend Setup

```bash
cd backend
npm install
```

This installs: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer` (+ `nodemon` for dev).

Create your `.env` file (copy the example):
```bash
cp .env.example .env
```
Open `.env` and set:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lab-management
JWT_SECRET=any_long_random_string_here
CLIENT_URL=http://localhost:5173
```
> If using MongoDB Atlas for production, replace `MONGO_URI` with your Atlas connection string. Otherwise, the local environment will automatically use an in-memory database.

**Create the first Admin account** (one-time):
```bash
node seed/createAdmin.js
```
This prints login credentials:
```
Email:    admin@medilab.com
Password: admin123
```

**Run the backend server:**
```bash
npm run dev
```
It should print: `Server running on port 5000` and `MongoDB Connected: ...`.

---

## 4. Frontend Setup

Open a **second terminal** in VS Code (keep the backend running in the first one):

```bash
cd frontend
npm install
```

This installs: `react`, `react-router-dom`, `axios`, `recharts`, `lucide-react`, `framer-motion` (+ `tailwindcss`, `vite` for dev).

Run the frontend:
```bash
npm run dev
```
It should print a local URL, usually:
```
http://localhost:5173
```
Open that URL in your browser.

> The Vite dev server already proxies `/api` and `/uploads` requests to `http://localhost:5000`, so the frontend and backend talk to each other automatically — no extra config needed.

---

## 5. Using the App

1. Go to `http://localhost:5173/register` and create a **Patient** account, OR
2. Login as **Admin** using the seeded credentials (`admin@medilab.com` / `admin123`).
3. As Admin: add some **Tests** (Manage Tests) and add a **Staff** account (Manage Users).
4. As Patient: book a test.
5. As Admin: assign the order to your Staff account (Manage Orders).
6. As Staff (login with the staff account): move the order through **Sample Collected → Processing**, then **Upload Result** to mark it Completed.
7. As Patient: view/download the completed report.

---

## 6. Common Issues

| Problem | Fix |
|---|---|
| `MongoDB Connected` never shows / connection error | If using Atlas, ensure your `MONGO_URI` and IP allowlist are correct. If local, check terminal for memory server download issues. |
| Frontend shows network errors | Make sure the backend terminal is running on port 5000 before starting the frontend |
| `EADDRINUSE` on port 5000 or 5173 | Another process is using the port — close it or change `PORT` in `.env` / `vite.config.js` |
| File upload fails | Make sure `backend/uploads` folder exists (it's included in this zip) |

---

## 7. Building for Production (optional, not required for a demo)
```bash
cd frontend
npm run build
```
This outputs a `dist/` folder that can be served as static files (e.g., via the Express backend or any static host).
