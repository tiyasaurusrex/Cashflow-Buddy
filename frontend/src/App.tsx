import './App.css'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import NeoNav from './components/NeoNav'
import NeoBackground from './components/NeoBackground'
import OnboardingPage from './components/OnboardingPage'
import Dashboard from './components/Dashboard'
import MonthlyOverview from './components/MonthlyOverview'
import LogExpense from './components/LogExpense'
import Settings from './components/Settings'
import WeeklySplit from './components/WeeklySplit'
import AuthPage from './components/AuthPage'
import { logoutUser } from './apis'

const GOOGLE_CLIENT_ID = '323999838773-563iargt4rtrtgq6dr0tqemc15d0nl8o.apps.googleusercontent.com';

// Redirect to /login if no JWT is stored
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Log Expense', href: '/log-expense' },
    { label: 'Weekly Split', href: '/weekly-split' },
    { label: 'Monthly Overview', href: '/monthly-overview' },
    { label: 'Settings', href: '/settings' },
    { label: 'Logout', href: '#logout' },
  ];

  const handleNavClick = (item: { label: string; href: string }) => {
    if (item.href === '#logout') {
      handleLogout();
    } else {
      navigate(item.href);
    }
  };

  return (
    <NeoBackground>
      {!isLoginPage && (
        <NeoNav items={navItems} onItemClick={handleNavClick} />
      )}
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/log-expense" element={<ProtectedRoute><LogExpense /></ProtectedRoute>} />
        <Route path="/monthly-overview" element={<ProtectedRoute><MonthlyOverview /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/weekly-split" element={<ProtectedRoute><WeeklySplit /></ProtectedRoute>} />
      </Routes>
    </NeoBackground>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App
