# CashFlow Buddy

A student-focused budgeting web app that helps users manage a fixed monthly allowance by breaking it into weekly budgets and tracking daily expenses.

## Problem Statement

Many students receive a fixed monthly allowance but often spend too much too early, leading to stress and financial shortages later in the month. Existing budgeting tools are often too complex or not tailored to student spending patterns.

## Solution

CashFlow Buddy solves this by:

- **Splitting allowance into weekly budgets** — Breaking down a monthly allowance into manageable weekly chunks
- **Simple expense logging** — Log daily expenses in straightforward categories (Food, Transport, Fun, Other)
- **Dynamic budget adjustment** — Overspending in one week automatically reduces future week budgets
- **Safe daily spending limit** — Calculates a burn rate to help pace spending throughout the month
- **Prediction engine** — Estimates when the user might run out of money based on current spending patterns

## Features

- **Authentication** — Sign in with Google; sessions managed via JWT
- **Dashboard** — View current budget status at a glance
- **Weekly Split View** — See how the allowance is distributed across weeks
- **Expense Logging** — Quick and easy expense entry with categories
- **Monthly Overview** — Track spending patterns and remaining balance
- **Burn Rate Calculator** — Know the safe daily spending limit
- **Spending Warnings** — Alerts when overspending is detected
- **Freeze Suggestions** — Recommendations when spending needs to pause
- **Settings** — Edit monthly allowance and change the month start date
- **Rate Limiting** — API rate limiting on all routes to prevent abuse

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **React Router v7** for navigation
- **React Compiler** via Babel plugin
- **@react-oauth/google** for Google Sign-In

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose for data persistence
- **JWT** (`jsonwebtoken`) for stateless authentication
- **bcryptjs** for password hashing
- **Google Auth Library** for verifying Google ID tokens
- **express-rate-limit** for API rate limiting
- **CORS** enabled for cross-origin requests

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Google OAuth 2.0 Client ID (from [Google Cloud Console](https://console.cloud.google.com/))

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tiyasaurusrex/Cashflow-Buddy.git
cd Cashflow-Buddy
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CORS_ORIGINS=optional_comma_separated_production_origins
PORT=8080
```

Start the server:

```bash
npm start
```

The backend server runs on `http://localhost:8080` by default, or on `PORT` when provided by your host.

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the repository root (Vite reads from `envDir: '..'`):

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite's default port).

Backend health check endpoint: `GET /health`

### 4. Open in Browser

Navigate to `http://localhost:5173` to start using CashFlow Buddy.

## Project Structure

```
Cashflow-Buddy/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # JWT auth + rate limiting
│   ├── models/          # Mongoose schemas
│   ├── repository/      # Data access layer
│   ├── routes/          # Auth, budget, expense routes
│   ├── services/        # Business logic
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/  # Page and UI components
│       ├── apis.ts      # API client functions
│       ├── App.tsx      # Routing and app shell
│       └── main.tsx
│
└── README.md
```

## API Endpoints

All budget and expense routes require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint       | Description                          | Auth Required |
|--------|----------------|--------------------------------------|---------------|
| POST   | `/auth/google` | Verify Google ID token, receive JWT  | No            |

### Budget

| Method | Endpoint                    | Description                              | Auth Required |
|--------|-----------------------------|------------------------------------------|---------------|
| POST   | `/budget/init`              | Initialize budget with monthly allowance | Yes           |
| GET    | `/budget/overview`          | Get full budget overview with burn rate  | Yes           |
| POST   | `/budget/reset`             | Reset budget for a new month             | Yes           |
| POST   | `/budget/update-allowance`  | Update the monthly allowance             | Yes           |
| POST   | `/budget/month-start-date`  | Update the month start date              | Yes           |

### Expense

| Method | Endpoint       | Description         | Auth Required |
|--------|----------------|---------------------|---------------|
| POST   | `/expense/add` | Log a new expense   | Yes           |

## Usage Guide

1. **Sign in with Google** — Authenticate using your Google account
2. **Enter your monthly allowance** — Set your total budget for the month on the onboarding screen
3. **View weekly breakdown** — The app automatically splits your allowance into weekly budgets
4. **Log daily expenses** — Record what you spend in simple categories (Food, Transport, Fun, Other)
5. **Monitor your burn rate** — See your safe daily spending limit update in real-time
6. **Watch dynamic adjustments** — If you overspend one week, future weeks adjust automatically
7. **Adjust settings** — Update your allowance or month start date at any time from the Settings page

## Available Scripts

### Frontend

| Command           | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start development server     |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview production build     |
| `npm run lint`    | Run ESLint                   |

### Backend

| Command     | Description      |
|-------------|------------------|
| `npm start` | Start the server |

## Roadmap / Future Enhancements

- [ ] Historical spending charts and analytics
- [ ] Mobile responsiveness / PWA support
- [ ] Push notifications for budget alerts
- [ ] Savings goal planner
- [ ] Export spending data (CSV/PDF)
- [ ] Multiple currency support
- [ ] Recurring expense tracking


