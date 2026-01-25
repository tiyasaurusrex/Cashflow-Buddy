# CashFlow Buddy 💰

A student-focused budgeting web app that helps users manage a fixed monthly allowance by breaking it into weekly budgets and tracking daily expenses.

## 🎯 Problem Statement

Many students receive a fixed monthly allowance but often spend too much too early — leading to stress and financial shortages later in the month. Existing budgeting tools can be too complex or not tailored to student spending patterns.

## 💡 Solution

CashFlow Buddy solves this by:

- **Splitting allowance into weekly budgets** — Breaking down your monthly allowance into manageable weekly chunks
- **Simple expense logging** — Log daily expenses in straightforward categories (Food, Transport, Fun, Other)
- **Dynamic budget adjustment** — Overspending in one week automatically reduces future week budgets
- **Safe daily spending limit** — Calculates a "burn rate" to help you pace spending throughout the month
- **Prediction engine** — Estimates when you might run out of money based on current spending patterns

## ✨ Features

- 📊 **Dashboard** — View your current budget status at a glance
- 📅 **Weekly Split View** — See how your allowance is distributed across weeks
- 💸 **Expense Logging** — Quick and easy expense entry with categories
- 📈 **Monthly Overview** — Track spending patterns and remaining balance
- 🔥 **Burn Rate Calculator** — Know your safe daily spending limit
- ⚠️ **Spending Warnings** — Get alerts when you're overspending
- ❄️ **Freeze Suggestions** — Recommendations when spending needs to pause

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and builds
- **React Router** for navigation
- **React Compiler** via Babel plugin

### Backend
- **Node.js** with Express
- **RESTful API** architecture
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tiyasaurusrex/Cashflow-Buddy.git
cd Cashflow-Buddy
```

### 2. Set Up the Backend

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:8080`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory for local development:

```env
VITE_API_BASE_URL=http://localhost:8080
```

> **Note:** This is just the local backend URL, not a secret key. Never commit actual API keys or sensitive credentials to version control.

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite's default port)

### 4. Open in Browser

Navigate to `http://localhost:5173` to start using Cashflow Buddy!

## 📁 Project Structure

```
Cashflow-Buddy/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── repository/        # Data access layer
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic
│   │   ├── budget.service.js
│   │   ├── burnRate.service.js
│   │   ├── expense.service.js
│   │   ├── freeze.service.js
│   │   └── prediction.service.js
│   ├── utils/             # Helper functions
│   └── server.js          # Express app entry point
│
├── frontend/
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       │   ├── Dashboard.tsx
│       │   ├── LogExpense.tsx
│       │   ├── MonthlyOverview.tsx
│       │   ├── OnboardingPage.tsx
│       │   ├── Settings.tsx
│       │   ├── WarningScreen.tsx
│       │   └── WeeklySplit.tsx
│       ├── apis.ts        # API client functions
│       ├── App.tsx        # Main app component
│       └── main.tsx       # App entry point
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/budget/init` | Initialize budget with monthly allowance |
| GET | `/budget/overview` | Get complete budget overview with burn rate |
| POST | `/expense/add` | Log a new expense |

## 📖 Usage Guide

1. **Enter your monthly allowance** — Start by setting your total budget for the month
2. **View weekly breakdown** — The app automatically splits your allowance into weekly budgets
3. **Log daily expenses** — Record what you spend in simple categories
4. **Monitor your burn rate** — See your safe daily spending limit update in real-time
5. **Watch dynamic adjustments** — If you overspend one week, future weeks adjust automatically

## 🧪 Available Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |

## 🗺️ Roadmap / Future Enhancements

- [ ] Add user authentication
- [ ] Historical spending charts and analytics
- [ ] Mobile responsiveness / PWA support
- [ ] Push notifications for budget alerts
- [ ] Savings goal planner
- [ ] Export spending data (CSV/PDF)
- [ ] Multiple currency support
- [ ] Recurring expense tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

