# Budget Tracker App 💰

A modern, neo-brutalist styled budget tracking application that helps you manage your monthly allowance using a 4-week envelope budgeting system with intelligent spending insights.

## 🎯 Features

### Core Functionality
- **4-Week Envelope Budgeting**: Split your monthly allowance across 4 weeks with customizable allocations
- **Real-time Spending Tracking**: Log expenses by category (Food, Transport, Fun, Other)
- **Smart Burn Rate Calculation**: See how many days until month-end and safe daily spending limit
- **Predictive Analytics**: Get predictions on when your budget will run out based on spending patterns
- **Spending Freeze Alerts**: Automatic warnings when detecting heavy spending days
- **Snowball Deficit Logic**: Overspending in one week automatically reduces allocation from future weeks

### User Experience
- **Neo-Brutalist Design**: Bold, colorful UI with strong shadows and clear typography
- **Interactive Dashboard**: Visual envelopes showing weekly spending status with color-coded alerts
- **Monthly Overview**: Track all transactions and see weekly spending patterns
- **Smart Warnings**: Contextual alerts based on overspending, low balance, or heavy spending days

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite 7.3.1** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Custom styling with neo-brutalist design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **In-Memory Storage** - Lightweight data persistence

## 📁 Project Structure

```
Front-end/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard with weekly envelopes
│   │   ├── OnboardingPage.tsx     # Initial budget setup
│   │   ├── WeeklySplit.tsx        # Custom weekly allocation
│   │   ├── LogExpense.tsx         # Expense logging interface
│   │   ├── MonthlyOverview.tsx    # Transaction history & insights
│   │   ├── WarningScreen.tsx      # Smart spending warnings
│   │   ├── NeoNav.tsx             # Navigation component
│   │   ├── NeoButton.tsx          # Reusable button component
│   │   └── NeoBackground.tsx      # Animated background
│   ├── apis.ts                    # API integration layer
│   ├── App.tsx                    # Main app component with routing
│   ├── theme.css                  # Global design system
│   └── main.tsx                   # App entry point
├── public/                        # Static assets
├── package.json
└── vite.config.ts

backend/
├── controllers/
│   ├── budget.controller.js       # Budget endpoints
│   └── expense.controller.js      # Expense endpoints
├── services/
│   ├── budget.service.js          # Budget logic
│   ├── expense.service.js         # Expense logic
│   ├── burnRate.service.js        # Days remaining calculation
│   ├── prediction.service.js      # Spending prediction
│   └── freeze.service.js          # Freeze suggestion logic
├── repository/
│   └── budget.repository.js       # In-memory data storage
└── server.js                      # Express server setup
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Front-end
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root with:
```env
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend && node server.js
```

**Terminal 2 (Frontend):**
```bash
cd Front-end && npm run dev
```

## 📡 API Endpoints

### Budget Endpoints

#### Initialize Budget
```http
POST /budget/init
Content-Type: application/json

{
  "allowance": 8000,
  "weeklyAllocations": [2000, 2000, 2000, 2000]  // Optional
}
```

#### Get Budget Overview
```http
GET /budget/overview

Response:
{
  "budget": {
    "allowance": 8000,
    "weeks": [...],
    "expenses": [...],
    "categoryTotals": {...},
    "isOverdrawn": false
  },
  "burnRate": {
    "daysRemaining": 7,
    "remainingMoney": 6000,
    "safeDailySpend": 857
  },
  "prediction": {
    "dailyAvg": 200,
    "runOutDate": "2026-01-27T13:55:22.507Z"
  },
  "suggestFreeze": false
}
```

### Expense Endpoints

#### Add Expense
```http
POST /expense/add
Content-Type: application/json

{
  "amount": 150,
  "category": "food",      // food, transport, fun, or other
  "weekIndex": 0           // 0-3 for weeks 1-4
}
```

## 💡 How It Works

### Budget System

1. **Initialization**: User sets monthly allowance (e.g., ₹8000)
2. **Week Allocation**: Budget split into 4 weeks (auto: equal split, or custom allocations)
3. **Expense Tracking**: Log expenses in categories (Food, Transport, Fun, Other)
4. **Snowball Logic**: If Week 1 overspends by ₹500, Week 2's allocation reduces by ₹500

### Smart Insights

**Burn Rate Analysis**
- Calculates days remaining in month
- Computes remaining money across all weeks
- Suggests safe daily spending limit

**Predictive Analytics**
- Tracks spending patterns (requires 3+ expenses)
- Calculates daily average spending
- Predicts when budget will run out

**Freeze Suggestions**
- Detects if last 2 expenses are from today
- Suggests 24-hour spending freeze to reset behavior

### Week Index Calculation

Weeks are calculated based on the day of the month:
- **Week 1**: Days 1-7
- **Week 2**: Days 8-14
- **Week 3**: Days 15-21
- **Week 4**: Days 22-end of month

## 🎨 Design System

### Color Palette
- **Primary**: `#88aaee` (Neo Blue)
- **Success**: `#4ade80` (Green)
- **Warning**: `#fbbf24` (Yellow)
- **Danger**: `#f87171` (Red)
- **Background**: `#ffffff` (White)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Bold, large sizes with tight spacing
- **Body**: Regular weight, comfortable line-height

### Shadows
```css
--neo-shadow: 4px 4px 0px rgba(0, 0, 0, 0.8);
--neo-shadow-hover: 6px 6px 0px rgba(0, 0, 0, 0.8);
```

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
TypeScript is configured with React Compiler support for optimized builds.

## 📝 Future Enhancements

- [ ] Persistent database storage (MongoDB/PostgreSQL)
- [ ] User authentication and multi-user support
- [ ] Category customization
- [ ] Expense editing and deletion
- [ ] Export data to CSV/PDF
- [ ] Budget comparison across months
- [ ] Savings goals tracking
- [ ] Bill reminders and recurring expenses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

Built with ❤️ for smart budget management

---

**Happy Budgeting! 💰✨
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
