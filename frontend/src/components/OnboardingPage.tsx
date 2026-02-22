import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';
import NeoButton from './NeoButton';
import { initBudget, getBudgetOverview } from '../apis';

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const [allowance, setAllowance] = useState('');
    const [customizeWeeks, setCustomizeWeeks] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // If the user already has a budget, go straight to the dashboard
    useEffect(() => {
        const checkExistingBudget = async () => {
            try {
                await getBudgetOverview();
                navigate('/dashboard', { replace: true });
            } catch {
                // 404 = no budget yet — show onboarding form
                setLoading(false);
            }
        };
        checkExistingBudget();
    }, [navigate]);

    const handleStartBudgeting = async () => {
        if (!allowance) {
            alert('Please enter your monthly allowance');
            return;
        }

        const allowanceNum = parseFloat(allowance);
        if (isNaN(allowanceNum) || allowanceNum <= 0) {
            alert('Please enter a valid allowance amount');
            return;
        }

        if (customizeWeeks) {
            navigate('/weekly-split', { state: { allowance: allowanceNum } });
        } else {
            try {
                setLoading(true);
                setError(null);
                await initBudget(allowanceNum);
                navigate('/dashboard');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize budget');
            } finally {
                setLoading(false);
            }
        }
    };

    // Still checking for existing budget
    if (loading) {
        return (
            <div className="onboarding">
                <div className="onboarding__container">
                    <p style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Space Grotesk, sans-serif', color: '#111' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="onboarding">
            <div className="onboarding__container">
                {/* App Branding */}
                <div className="onboarding__header">
                    <h1 className="onboarding__title">Cashflow Buddy</h1>
                    <p className="onboarding__tagline">
                        Make your month last till your next allowance.
                    </p>
                </div>

                {/* Envelope Illustration */}
                <div className="onboarding__illustration">
                    <img
                        src="/envelope_illustration.png"
                        alt="Money split into 4 weekly envelopes"
                        className="onboarding__image"
                    />
                </div>

                {/* Input Card */}
                <div className="onboarding__card">
                    <label htmlFor="allowance" className="onboarding__label">
                        Monthly Allowance
                    </label>
                    <div className="onboarding__input-wrapper">
                        <span className="onboarding__currency">₹</span>
                        <input
                            id="allowance"
                            type="number"
                            className="onboarding__input"
                            placeholder="3000"
                            value={allowance}
                            onChange={(e) => setAllowance(e.target.value)}
                        />
                    </div>

                    {/* Toggle */}
                    <div className="onboarding__toggle">
                        <label className="onboarding__checkbox-label">
                            <input
                                type="checkbox"
                                checked={customizeWeeks}
                                onChange={(e) => setCustomizeWeeks(e.target.checked)}
                                className="onboarding__checkbox"
                            />
                            <span className="onboarding__checkbox-text">
                                Customize weekly splits
                            </span>
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{ color: '#f87171', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {/* CTA Button */}
                    <div className="onboarding__button-wrapper">
                        <NeoButton
                            variant="primary"
                            size="large"
                            onClick={handleStartBudgeting}
                            disabled={loading}
                        >
                            {loading ? 'Setting up...' : 'Start Budgeting'}
                        </NeoButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
