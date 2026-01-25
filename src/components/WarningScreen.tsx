import React, { useState, useEffect } from 'react';
import './WarningScreen.css';
import { getBudgetOverview } from '../apis';
import type { OverviewResponse } from '../apis';

interface WarningScreenProps {
    isOpen: boolean;
    onClose: () => void;
}

const WarningScreen: React.FC<WarningScreenProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progressWidth, setProgressWidth] = useState(100);

    // State from backend
    const [dailyRemaining, setDailyRemaining] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);
    const [budgetRemaining, setBudgetRemaining] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0);
    const [dailyAvg, setDailyAvg] = useState(0);
    const [suggestFreeze, setSuggestFreeze] = useState(false);

    useEffect(() => {
        fetchWarningData();
    }, []);

    const fetchWarningData = async () => {
        try {
            setLoading(true);
            const data: OverviewResponse = await getBudgetOverview();

            setDailyRemaining(Math.round(data.burnRate.safeDailySpend));
            setDaysLeft(data.burnRate.daysRemaining);
            setBudgetRemaining(data.burnRate.remainingMoney);
            setTotalBudget(data.budget.allowance);
            setDailyAvg(data.prediction?.dailyAvg || 0);
            setSuggestFreeze(data.suggestFreeze);

            // Calculate progress percentage
            const percentage = (data.burnRate.remainingMoney / data.budget.allowance) * 100;
            setProgressWidth(Math.max(0, Math.min(100, percentage)));

            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load budget data');
        } finally {
            setLoading(false);
        }
    };

    const getTriggerType = (): 'overspending' | 'low-balance' | 'heavy-days' => {
        if (suggestFreeze) return 'heavy-days';
        if (progressWidth < 30) return 'low-balance';
        if (dailyAvg > dailyRemaining) return 'overspending';
        return 'low-balance';
    };

    const getWarningMessage = () => {
        const currentTriggerType = getTriggerType();
        switch (currentTriggerType) {
            case 'overspending':
                return 'Your spending rate is above budget. Slow down to avoid running out!';
            case 'heavy-days':
                return 'Two heavy spending days detected. Take a breather to stay on track.';
            case 'low-balance':
            default:
                return 'To last till month-end.';
        }
    };

    const handleFreeze = () => {
        console.log('Budget frozen');
        onClose();
    };

    const handleIgnore = () => {
        console.log('Warning ignored');
        onClose();
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="warning-modal-overlay">
                <div className="warning-screen">
                    <div className="warning-container">
                        <div className="loading">Loading budget data...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="warning-modal-overlay">
                <div className="warning-screen">
                    <div className="warning-container">
                        <div className="error-message">
                            <p>⚠️ {error}</p>
                            <button onClick={onClose} className="neo-button">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="warning-modal-overlay" onClick={onClose}>
            <div className="warning-screen" onClick={(e) => e.stopPropagation()}>
                <div className="warning-container">
                    <button className="warning-close-btn" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                    <span className="warning-icon">⚠️</span>

                    {/* Headline */}
                    <h1 className="warning-headline">
                        ₹{dailyRemaining}/day
                    </h1>
                    <p className="warning-subtext">Remaining</p>

                    {/* Explanation */}
                    <div className="warning-explanation">
                        <p className="warning-explanation-text">
                            {getWarningMessage()}
                        </p>
                    </div>

                    {/* Visual Indicators */}
                    <div className="warning-visual">
                        {/* Countdown */}
                        <div className="countdown-section">
                            <div className="countdown-label">Days Until Month-End</div>
                            <div className="countdown-value">{daysLeft}</div>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill animated"
                                style={{
                                    '--progress-width': `${progressWidth}%`,
                                    width: `${progressWidth}%`
                                } as React.CSSProperties}
                            >
                                {progressWidth > 20 && `${Math.round(progressWidth)}%`}
                            </div>
                        </div>
                    </div>

                    {/* Soft Controls */}
                    <div className="warning-controls">
                        <button
                            className="warning-btn warning-btn-primary"
                            onClick={handleFreeze}
                        >
                            🔒 Freeze Spending for 24h
                        </button>
                        <button
                            className="warning-btn warning-btn-secondary"
                            onClick={handleIgnore}
                        >
                            I'll Be Careful
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarningScreen;
