import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import NeoNav from './components/NeoNav'
import NeoBackground from './components/NeoBackground'
import OnboardingPage from './components/OnboardingPage'
import Dashboard from './components/Dashboard'
import MonthlyOverview from './components/MonthlyOverview'
import LogExpense from './components/LogExpense'
import WarningScreen from './components/WarningScreen'
import WeeklySplit from './components/WeeklySplit'


function AppContent() {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Log Expense', href: '/log-expense' },
    { label: 'Weekly Split', href: '/weekly-split' },
    { label: 'Monthly Overview', href: '/monthly-overview' },
    { label: 'Warning', href: '/warning' },
    
  ];

  const handleNavClick = (item: { label: string; href: string }) => {
    navigate(item.href);
  };

  return (
    <NeoBackground>
      <NeoNav logo="CASHFLOW BUDDY" items={navItems} onItemClick={handleNavClick} />
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/log-expense" element={<LogExpense />} />
        <Route path="/monthly-overview" element={<MonthlyOverview />} />
        <Route path="/warning" element={<WarningScreen />} />
        <Route path="/weekly-split" element={<WeeklySplit />} />
        
      </Routes>
    </NeoBackground>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App
