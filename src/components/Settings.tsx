import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import ConfirmModal from './ConfirmModal';
import { getBudgetOverview, updateBudgetAllowance, resetMonthData } from '../apis';
import type { OverviewResponse } from '../apis';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentAllowance, setCurrentAllowance] = useState(0);
    const [newAllowance, setNewAllowance] = useState('');
    const [monthStartDate, setMonthStartDate] = useState(1);
    const [showResetModal, setShowResetModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBudgetData();
    }, []);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            const data: OverviewResponse = await getBudgetOverview();
            setCurrentAllowance(data.budget.allowance);
            setNewAllowance(data.budget.allowance.toString());
        } catch (err) {
            console.error('Failed to fetch budget data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAllowance = async () => {
        const allowanceValue = parseFloat(newAllowance);

        if (!allowanceValue || allowanceValue <= 0) {
            alert('Please enter a valid allowance amount');
            return;
        }

        if (allowanceValue === currentAllowance) {
            alert('New allowance is the same as current allowance');
            return;
        }

        try {
            setSaving(true);
            await updateBudgetAllowance(allowanceValue);
            setCurrentAllowance(allowanceValue);
            alert('✅ Budget allowance updated successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update allowance');
        } finally {
            setSaving(false);
        }
    };

    const handleResetMonth = async () => {
        try {
            setSaving(true);
            await resetMonthData();
            alert('✅ Month data has been reset!');
            navigate('/dashboard');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to reset month data');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings">
                <div className="settings__container">
                    <div className="settings__loading">Loading settings...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="settings">
            <div className="settings__container">
                <h1 className="settings__title">⚙️ Settings</h1>

                {/* Budget Settings Section */}
                <div className="settings__section">
                    <h2 className="settings__section-title">Budget Settings</h2>

                    {/* Current Allowance Display */}
                    <div className="settings__card settings__card--info">
                        <div className="settings__info">
                            <span className="settings__label">Current Monthly Allowance</span>
                            <span className="settings__value">₹{currentAllowance.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Edit Allowance */}
                    <div className="settings__card">
                        <label htmlFor="allowance" className="settings__label">
                            Edit Monthly Allowance
                        </label>
                        <div className="settings__input-group">
                            <div className="settings__input-wrapper">
                                <span className="settings__currency">₹</span>
                                <input
                                    id="allowance"
                                    type="number"
                                    className="settings__input"
                                    placeholder="0"
                                    value={newAllowance}
                                    onChange={(e) => setNewAllowance(e.target.value)}
                                />
                            </div>
                            <button
                                className="settings__btn settings__btn--primary"
                                onClick={handleUpdateAllowance}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Update Allowance'}
                            </button>
                        </div>
                    </div>

                    {/* Month Start Date */}
                    <div className="settings__card">
                        <label htmlFor="monthStart" className="settings__label">
                            Month Start Date
                        </label>
                        <p className="settings__description">
                            Choose which day of the month your budget cycle starts
                        </p>
                        <select
                            id="monthStart"
                            className="settings__select"
                            value={monthStartDate}
                            onChange={(e) => setMonthStartDate(parseInt(e.target.value))}
                            disabled
                        >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day}>
                                    Day {day} of the month
                                </option>
                            ))}
                        </select>
                        <p className="settings__note">
                            ⓘ Month start date customization coming soon
                        </p>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings__section settings__section--danger">
                    <h2 className="settings__section-title settings__section-title--danger">
                        ⚠️ Danger Zone
                    </h2>

                    <div className="settings__card settings__card--danger">
                        <div className="settings__danger-content">
                            <div>
                                <h3 className="settings__danger-title">Reset Current Month Data</h3>
                                <p className="settings__danger-description">
                                    This will permanently delete all expenses for the current month.
                                    This action cannot be undone.
                                </p>
                            </div>
                            <button
                                className="settings__btn settings__btn--danger"
                                onClick={() => setShowResetModal(true)}
                                disabled={saving}
                            >
                                Reset Month Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={handleResetMonth}
                title="Reset Month Data?"
                message="Are you sure you want to reset all data for the current month? This will delete all your expenses and cannot be undone."
                confirmText="Yes, Reset Data"
                cancelText="Cancel"
                isDanger={true}
            />
        </div>
    );
};

export default Settings;
