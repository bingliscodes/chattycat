# ChattyCat

> A real-time, Slack-style team chat application built from scratch — organizations, channels, direct messages, threads, and file sharing.

ChattyCat is a full-stack chat platform where teams create organizations, spin up channels, and talk in real time. It supports threaded conversations, one-on-one direct messages, file/image attachments, and role-based membership — the core building blocks of a modern workplace messaging tool. The project demonstrates real-time system design with WebSockets, relational data modeling, secure authentication, and cloud file storage.

**🔗 Live demo:** [chattycat.netlify.app](https://chattycat.netlify.app)
**🎥 Video demo:** [Click here](https://www.youtube.com/watch?v=1RhYNEVxVxk)

---

## Highlights

- **Real-time messaging** over Socket.IO — messages, direct messages, and thread replies broadcast live to everyone in a room, with no page refresh.
- **Threaded conversations** — any message can spawn a thread; reply counts update automatically.
- **Optimistic UI** — messages appear instantly with a temporary ID, then reconcile against the server's confirmed record once persisted.
- **Organizations & channels** — workspaces with org-scoped channels and many-to-many user membership.
- **Role-based access** — organization roles (`owner`, `admin`, `member`, `superuser`) enforced by middleware.
- **Direct file uploads to S3** — the browser requests a presigned URL and uploads straight to AWS S3, keeping large files off the app server.
- **Secure auth** — JWT delivered via httpOnly cookies, bcrypt password hashing, and an email-based password reset flow.
- **Permission-checked sockets** — channel send permissions are validated against an in-memory cache (hydrated from the DB on a miss) before any message is broadcast.

---

## Tech Stack

**Frontend**

- React 19 + Vite (rolldown-vite)
- Chakra UI v3
- React Router v7
- Socket.IO client
- React Hook Form, Axios
- Deployed on Netlify

**Backend**

- Node.js + Express 5 (ES modules)
- Socket.IO (real-time layer)
- Sequelize ORM
- JWT auth (jsonwebtoken), bcryptjs, cookie-parser

**Database**

- PostgreSQL / Neon (production)
- MySQL (development)
- SQLite in-memory (tests)

**Infrastructure & Services**

- AWS S3 for file storage (presigned-URL upload flow, AWS SDK v3)
- Sharp for image processing
- Mailgun for transactional email (password resets) via Nodemailer

**Security & Tooling**

- Helmet, express-rate-limit, xss-clean, CORS, compression
- Jest + Supertest for backend tests
- ESLint (Airbnb config) + Prettier

---

## How It Works

ChattyCat splits its traffic across two channels:

- **REST API** (`/api/v1/...`) handles CRUD for users, organizations, channels, messages, auth, and upload URLs.
- **Socket.IO** handles the live messaging path. When a user sends a message, the server validates their channel permission, persists it via Sequelize, confirms back to the sender, then broadcasts to the room. Threads and direct messages use their own socket events and rooms.

```
React (Vite, Chakra UI)  ──REST──▶  Express API  ──▶  Sequelize  ──▶  Postgres / MySQL
        │
        └──────WebSocket──────▶  Socket.IO server (auth + broadcast)
                                          │
   Browser ──presigned PUT──▶  AWS S3  ◀──┘ (URL signed by API)
```

The data model is relational: organizations have many channels and many users (M:N); channels have many members (M:N) and many messages; messages support self-referential threads (`parentMessageId`) and attachments. Frontend state is organized with React Context (`UserContext`, `OrganizationContext`, `ChatContext`).

---

## Running It Locally

The app lives in two packages — `backend/` and `frontend/` — each with its own dependencies. You'll need Node.js and a database (MySQL for local dev), plus AWS S3 and Mailgun credentials for file uploads and email.

```bash
# Backend
cd backend
npm install
# create config.env with DB, JWT, AWS, and Mailgun settings
npm start          # runs on http://localhost:3000

# Frontend (in a second terminal)
cd frontend
npm install
# create .env with VITE_DEV_API_BASE_URL and VITE_SERVER_URL
npm run dev        # runs on http://localhost:5173
```

Run the backend test suite (uses an in-memory SQLite DB) with:

```bash
cd backend && npm test
```

---

_Built by Benjamin Inglis._
