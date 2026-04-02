import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WeeklySplit.css';
import NeoButton from './NeoButton';
import { initBudget, getBudgetOverview } from '../apis';

interface WeekData {
    week: number;
    dateRange: string;
    amount: string;
}

const WeeklySplit: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [monthlyAllowance, setMonthlyAllowance] = useState(
        location.state?.allowance ? parseFloat(location.state.allowance) : 4000
    );
    const generateWeekDateRanges = (existingWeeks?: { allocated: number }[]) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed
        const lastDay = new Date(year, month + 1, 0).getDate(); // actual last day of current month
        const monthName = now.toLocaleDateString('en-US', { month: 'short' });
        return [
            { week: 1, dateRange: `1-7 ${monthName}`, amount: existingWeeks?.[0]?.allocated?.toString() || '' },
            { week: 2, dateRange: `8-14 ${monthName}`, amount: existingWeeks?.[1]?.allocated?.toString() || '' },
            { week: 3, dateRange: `15-21 ${monthName}`, amount: existingWeeks?.[2]?.allocated?.toString() || '' },
            { week: 4, dateRange: `22-${lastDay} ${monthName}`, amount: existingWeeks?.[3]?.allocated?.toString() || '' },
        ];
    };

    const [weeks, setWeeks] = useState<WeekData[]>(generateWeekDateRanges());

    const [totalAssigned, setTotalAssigned] = useState(0);
    const [remaining, setRemaining] = useState(monthlyAllowance);

    useEffect(() => {
        const fetchExistingBudget = async () => {
            try {
                const data = await getBudgetOverview();
                if (data.budget) {
                    setMonthlyAllowance(data.budget.allowance);
                    setWeeks(generateWeekDateRanges(data.budget.weeks));
                }
            } catch {
                console.log('No existing budget found, using defaults');
            }
        };
        if (!location.state?.allowance) {
            fetchExistingBudget();
        }
    }, [location.state?.allowance]);
    useEffect(() => {
        const total = weeks.reduce((sum, week) => {
            const amount = parseFloat(week.amount) || 0;
            return sum + amount;
        }, 0);
        setTotalAssigned(total);
        setRemaining(monthlyAllowance - total);
    }, [weeks, monthlyAllowance]);

    const handleAmountChange = (weekIndex: number, value: string) => {
        const newWeeks = [...weeks];
        newWeeks[weekIndex].amount = value;
        setWeeks(newWeeks);
    };

    const getPercentage = (amount: string) => {
        const num = parseFloat(amount) || 0;
        return monthlyAllowance > 0 ? Math.round((num / monthlyAllowance) * 100) : 0;
    };

    const getStatus = () => {
        if (totalAssigned === monthlyAllowance) {
            return { type: 'perfect', emoji: '🟢', message: 'Your full budget is distributed.' };
        } else if (totalAssigned < monthlyAllowance) {
            return { type: 'unassigned', emoji: '🟡', message: `₹${remaining} still needs to be assigned.` };
        } else {
            return { type: 'over', emoji: '🔴', message: "You've exceeded your monthly allowance." };
        }
    };

    const handleAutoSplit = () => {
        const evenSplit = Math.floor(monthlyAllowance / 4);
        const remainder = monthlyAllowance % 4;
        const newWeeks = weeks.map((week, index) => ({
            ...week,
            amount: (evenSplit + (index < remainder ? 1 : 0)).toString(),
        }));
        setWeeks(newWeeks);
    };

    const handleReset = () => {
        setWeeks(generateWeekDateRanges(undefined));
        setError(null);
    };

    const handleSave = async () => {
        if (!canSave) {
            setError('Please allocate the full budget amount before saving.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const weeklyAllocations = weeks.map(week => parseFloat(week.amount) || 0);
            console.log('Saving budget:', { monthlyAllowance, weeklyAllocations });
            const result = await initBudget(monthlyAllowance, weeklyAllocations);
            console.log('Budget saved successfully:', result);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error saving budget:', err);
            setError(err instanceof Error ? err.message : 'Failed to save budget');
        } finally {
            setLoading(false);
        }
    };

    const status = getStatus();
    const canSave = totalAssigned === monthlyAllowance;

    return (
        <div className="weekly-split">
            <div className="weekly-split__container">
                {/* Header Section */}
                <div className="weekly-split__header">
                    <div className="weekly-split__header-content">
                        <h1 className="weekly-split__title">WEEKLY BUDGET SPLIT</h1>
                        <p className="weekly-split__subtitle">Divide ₹{monthlyAllowance} across your weeks</p>
                    </div>
                    <button className="weekly-split__back-btn" onClick={() => navigate('/')}>
                        ← Back
                    </button>
                </div>

                {/* Fixed Monthly Allowance Bar */}
                <div className="weekly-split__allowance-bar">
                    <div className="weekly-split__allowance-info">
                        <span className="weekly-split__allowance-label">Monthly Allowance</span>
                        <span className="weekly-split__allowance-value">₹{monthlyAllowance}</span>
                    </div>
                    <div className="weekly-split__remaining">
                        <span className="weekly-split__remaining-label">Remaining to assign:</span>
                        <span className={`weekly-split__remaining-value ${remaining < 0 ? 'weekly-split__remaining-value--negative' : ''}`}>
                            ₹{remaining}
                        </span>
                    </div>
                </div>

                {/* Week Cards */}
                <div className="weekly-split__weeks">
                    {weeks.map((week, index) => (
                        <div key={week.week} className="weekly-split__week-card">
                            <div className="weekly-split__week-left">
                                <span className="weekly-split__week-number">WEEK {week.week}</span>
                                <span className="weekly-split__week-dates">({week.dateRange})</span>
                            </div>
                            <div className="weekly-split__week-center">
                                <span className="weekly-split__currency">₹</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="weekly-split__input"
                                    placeholder="0"
                                    value={week.amount}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        handleAmountChange(index, value);
                                    }}
                                />
                            </div>
                            <div className="weekly-split__week-right">
                                <span className="weekly-split__percentage">{getPercentage(week.amount)}% of total</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Distribution Status Bar */}
                <div className={`weekly-split__status weekly-split__status--${status.type}`}>
                    <span className="weekly-split__status-emoji">{status.emoji}</span>
                    <span className="weekly-split__status-label">
                        {status.type === 'perfect' && 'Perfect Split'}
                        {status.type === 'unassigned' && 'Unassigned Money'}
                        {status.type === 'over' && 'Over Budget'}
                    </span>
                    <span className="weekly-split__status-message">{status.message}</span>
                </div>

                {/* Smart Assist Buttons */}
                <div className="weekly-split__assist-buttons">
                    <button className="weekly-split__assist-btn" onClick={handleAutoSplit}>
                         Auto Split Evenly
                    </button>
                    <button className="weekly-split__assist-btn" onClick={handleReset}>
                         Reset Splits
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {/* Visual Summary */}
                <div className="weekly-split__summary">
                    <h3 className="weekly-split__summary-title">Budget Breakdown</h3>
                    <div className="weekly-split__chart">
                        {weeks.map((week) => {
                            const percentage = getPercentage(week.amount);
                            return (
                                <div key={week.week} className="weekly-split__chart-row">
                                    <span className="weekly-split__chart-label">Week {week.week}</span>
                                    <div className="weekly-split__chart-bar-container">
                                        <div
                                            className="weekly-split__chart-bar"
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                    <span className="weekly-split__chart-percent">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="weekly-split__cta">
                    <NeoButton
                        variant="primary"
                        size="large"
                        onClick={handleSave}
                        disabled={!canSave || loading}
                    >
                        {loading ? 'Saving...' : ' SAVE WEEKLY SPLIT'}
                    </NeoButton>
                </div>
            </div>
        </div>
    );
};

export default WeeklySplit;
