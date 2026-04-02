import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
    getBudgetOverview, 
    getCurrentWeekIndex, 
    getSpendingStatus 
} from '../apis';
import type { OverviewResponse } from '../apis';
import WarningScreen from './WarningScreen';

interface EnvelopeData {
    week: number;
    allocated: number;
    spent: number;
    remaining: number;
    status: 'safe' | 'warning' | 'danger';
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [envelopes, setEnvelopes] = useState<EnvelopeData[]>([]);
    const [currentWeek, setCurrentWeek] = useState(1);
    const [balanceLeft, setBalanceLeft] = useState(0);
    const [daysLeft, setDaysLeft] = useState(1);
    const [dailySafeSpend, setDailySafeSpend] = useState(0);
    const [showHeavySpendingBanner, setShowHeavySpendingBanner] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const data: OverviewResponse = await getBudgetOverview();
            
            const weekData: EnvelopeData[] = data.budget.weeks.map((week) => ({
                week: week.week + 1, 
                allocated: week.allocated,
                spent: week.spent,
                remaining: week.balance,
                status: getSpendingStatus(week.spent, week.allocated),
            }));
            
            setEnvelopes(weekData);
            
            const weekIndex = getCurrentWeekIndex();
            setCurrentWeek(weekIndex + 1);
            setBalanceLeft(data.budget.weeks[weekIndex]?.balance || 0);
            setDaysLeft(data.burnRate.daysRemaining);
            setDailySafeSpend(Math.round(data.burnRate.safeDailySpend));

            const currentWeekData = data.budget.weeks[weekIndex];
            const weekPct = currentWeekData && currentWeekData.allocated > 0
                ? currentWeekData.balance / currentWeekData.allocated
                : 1;
            setShowHeavySpendingBanner(weekPct <= 0.30);
            const warningAlreadyShown = location.state?.warningShown === true;
            if (weekPct <= 0.10 && !warningAlreadyShown) {
                setShowWarning(true);
            }
            
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, [location.state?.warningShown]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe':
                return '#4ade80'; 
            case 'warning':
                return '#fbbf24'; 
            case 'danger':
                return '#f87171'; 
            default:
                return '#88aaee';
        }
    };

    const handleLogExpense = () => {
        navigate('/log-expense');
    };

    const getProgressWidth = (remaining: number, allocated: number) => {
        if (allocated <= 0) return 0;
        const raw = (remaining / allocated) * 100;
        return Math.max(0, Math.min(100, raw));
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard__container">
                    <div className="dashboard__nudge">
                        <span className="dashboard__nudge-text">Loading your budget...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard__container">
                    <div className="dashboard__nudge">
                        <span className="dashboard__nudge-emoji">⚠️</span>
                        <span className="dashboard__nudge-text">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard__container">
                {/* Top Section */}
                <div className="dashboard__top">
                    <div className="dashboard__stat-card">
                        <div className="dashboard__stat-label">Current Week</div>
                        <div className="dashboard__stat-value">Week {currentWeek}</div>
                    </div>
                    <div className="dashboard__stat-card dashboard__stat-card--highlight">
                        <div className="dashboard__stat-label">Balance Left</div>
                        <div className="dashboard__stat-value">₹{balanceLeft}</div>
                    </div>
                    <div className="dashboard__stat-card">
                        <div className="dashboard__stat-label">Days Left</div>
                        <div className="dashboard__stat-value">{daysLeft}</div>
                    </div>
                </div>

                {/* Heavy spending banner — balance ≤ 30% of this week's allocation */}
                {showHeavySpendingBanner && (
                    <div 
                        className="dashboard__nudge" 
                        style={{ backgroundColor: '#fee2e2', borderColor: '#f87171', cursor: 'pointer' }}
                        onClick={() => setShowWarning(true)}
                    >
                        <span className="dashboard__nudge-emoji"></span>
                        <span className="dashboard__nudge-text">
                            Heavy spending detected! Tap to see details.
                        </span>
                    </div>
                )}

                {/* Micro Nudge — informational only, not clickable */}
                <div className="dashboard__nudge">
                    <span className="dashboard__nudge-emoji"></span>
                    <span className="dashboard__nudge-text">
                        You're doing okay. ₹{dailySafeSpend}/day left
                    </span>
                </div>

                {/* Envelope Cards */}
                <div className="dashboard__envelopes">
                    <h2 className="dashboard__section-title">Weekly Envelopes</h2>
                    <div className="dashboard__envelope-grid">
                        {envelopes.map((envelope) => (
                            <div
                                key={envelope.week}
                                className="dashboard__envelope"
                                style={{ borderColor: getStatusColor(envelope.status) }}
                            >
                                <div className="dashboard__envelope-header">
                                    <span className="dashboard__envelope-week">Week {envelope.week}</span>
                                    <span
                                        className="dashboard__envelope-status"
                                        style={{ backgroundColor: getStatusColor(envelope.status) }}
                                    />
                                </div>
                                <div className="dashboard__envelope-amount">₹{envelope.remaining}</div>
                                <div className="dashboard__envelope-label">Remaining</div>
                                <div className="dashboard__envelope-progress">
                                    <div
                                        className="dashboard__envelope-progress-bar"
                                        style={{
                                            width: `${getProgressWidth(envelope.remaining, envelope.allocated)}%`,
                                            backgroundColor: getStatusColor(envelope.status),
                                        }}
                                    />
                                </div>
                                <div className="dashboard__envelope-details">
                                    <span>Spent: ₹{envelope.spent}</span>
                                    <span>of ₹{envelope.allocated}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Button */}
                <button className="dashboard__fab" onClick={handleLogExpense}>
                    <span className="dashboard__fab-icon">➕</span>
                    <span className="dashboard__fab-text">Log Expense</span>
                </button>
            </div>
            
            {/* Warning Screen Modal */}
            <WarningScreen 
                isOpen={showWarning} 
                onClose={() => setShowWarning(false)} 
            />
        </div>
    );
};

export default Dashboard;
