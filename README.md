# MUET SW FYP Management System

A full-stack web application for managing Final Year Projects (FYPs) in the Software Engineering department at MUET.

## Modules

- User authentication and role-based access (`admin`, `supervisor`, `student`)
- Proposal submission and evaluation
- Project initialization and tracking
- Presentation and meeting management
- Notifications
- Past FYP archive (PDF view/download)

## Tech Stack

- Frontend: React, Redux Toolkit, Vite, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Realtime: Socket.IO
- File Uploads: Multer

## Project Structure

```text
fyp-client/   # React frontend
fyp-server/   # Node/Express backend
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/muet-sw-fyp-management-system.git
cd muet-sw-fyp-management-system
```

### 2. Setup backend

```bash
cd fyp-server
npm install
```

Create `fyp-server/.env` and set required values (app, db, mail, etc.).

Run backend:

```bash
npm run dev
```

### 3. Setup frontend

```bash
cd ../fyp-client
npm install
```

Create `fyp-client/.env` and set:

```env
VITE_API_BASE_URL=http://localhost:<backend-port>
```

Run frontend:

```bash
npm run dev
```

## Default URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:<APP_PORT>/api`

## Notes

- Keep `node_modules` and `.env` files out of version control.
- Past FYP PDFs are served from backend `public/uploads`.

## License

This project is for academic and educational use.
