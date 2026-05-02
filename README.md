# 🎵 Песмарка (Pesmarka)

**Your personal digital songbook.** A web application for discovering, browsing, and saving songs and lyrics.

A project for the **Advanced Web Design 2025/26** course.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![MUI](https://img.shields.io/badge/Material_UI-007FFF?style=flat&logo=mui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)

---

## ✨ Features

- 🎶 Browse and search a rich collection of songs and chords
- 📖 View full lyrics and chords with clean, readable formatting
- ❤️ Save your favourite songs to a personal songbook
- 🔍 Filter songs by artist, genre, or difficulty
- 👤 User authentication and profile management
- 📝 Submit songs for admin review
- 🛠️ Admin panel for managing songs, artists, and submissions

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Material UI, Emotion
- **Backend**: Node.js, Express, Telefunc
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Build Tool**: Vite

---

## 📋 Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL 16](https://www.postgresql.org/) running locally

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/naumovvm/Pesmarka.git
cd Pesmarka
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

**Copy the example environment file:**

```bash
cp .env.example .env
```

**Update `.env` with your settings:**

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/pesmarka
PORT=3000
SESSION_SECRET=YOUR_GENERATED_SECRET_KEY_HERE
```

> **Tip**: Generate a secure `SESSION_SECRET` with `openssl rand -base64 32`.

### 4. Set Up the Database

**Run migrations** to create the database tables:

```bash
npm run db:migrate
```

**Seed the default admin user:**

```bash
npm run db:seed
```

This creates a default admin account:

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Admin |

> ⚠️ **Important:** Change the admin password after the first login.

### 5. Start the App

```bash
npm run dev
```

**Access the application at:** [http://localhost:3000](http://localhost:3000)

---

## 💻 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```bash
Pesmarka/
├── drizzle/                # Auto-generated database migrations
├── public/                 # Static assets
├── scripts/
│   └── seed.ts             # Seeds the default admin user
├── server/                 # Telefunc server handler
├── src/
│   ├── api/
│   │   └── auth/           # Telefunc functions
│   ├── assets/             # Images, fonts, and media
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── db/                 # Drizzle schema and database setup
│   ├── pages/              # Page-level views / routes
│   └── main.tsx            # Application entry point
├── .env.example            # Example environment variables
├── drizzle.config.ts       # Drizzle ORM configuration
├── vite.config.ts          # Vite configuration
└── package.json
```

---

## 👤 Admin Setup

The project includes a seed script that creates a default admin account.

When `npm run db:seed` is executed, the script:

- connects to PostgreSQL using the `DATABASE_URL` from `.env`
- hashes the admin password using `bcrypt`
- inserts a default admin user into the `user` table
- uses Drizzle ORM to perform the database insert
- safely avoids duplicate admins if the script is run more than once

This makes the project easier to set up for development and testing.

---

## 🔧 Environment Variables

| Variable         | Description               | Default                                                     | Should Change?        |
|------------------|---------------------------|-------------------------------------------------------------|-----------------------|
| `DATABASE_URL`   | PostgreSQL connection URL | `postgresql://postgres:yourpassword@localhost:5432/pesmarka` | ✅ **Yes (required)** |
| `PORT`           | Application port          | `3000`                                                      | ❌ No                 |
| `SESSION_SECRET` | Session encryption secret | —                                                           | ✅ **Yes (required)** |

---

## 📚 Course Information

This project was developed for the **Advanced Web Design 2025/26** course. It demonstrates:

- Component-based UI design with React and Material UI
- Responsive and accessible web design
- Client-server communication using Telefunc
- User authentication and session management
- Relational database design with PostgreSQL
- Database schema management with Drizzle ORM
- Database migrations and default admin seeding

---

## 📄 License

MIT License
