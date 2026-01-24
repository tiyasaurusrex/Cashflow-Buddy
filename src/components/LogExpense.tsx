import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogExpense.css';
import NeoButton from './NeoButton';
import WarningScreen from './WarningScreen';
import { addExpense, getBudgetOverview, getCurrentWeekIndex } from '../apis';

interface Category {
    id: string;
    icon: string;
    label: string;
}

const LogExpense: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [weekBalance, setWeekBalance] = useState(0);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    const categories: Category[] = [
        { id: 'food', icon: '🍔', label: 'Food' },
        { id: 'transport', icon: '🚕', label: 'Transport' },
        { id: 'fun', icon: '🎮', label: 'Fun' },
        { id: 'other', icon: '📦', label: 'Other' },
    ];

    useEffect(() => {
        fetchCurrentWeekBalance();
    }, []);

    const fetchCurrentWeekBalance = async () => {
        try {
            const data = await getBudgetOverview();
            const weekIdx = getCurrentWeekIndex();
            setCurrentWeekIndex(weekIdx);
            setWeekBalance(data.budget.weeks[weekIdx]?.balance || 0);
        } catch (err) {
            console.error('Failed to fetch week balance:', err);
        }
    };

    const amountNum = parseFloat(amount) || 0;
    const remainingBalance = weekBalance - amountNum;

    const handleAddExpense = async () => {
        if (!amount || !selectedCategory) {
            alert('Please enter amount and select a category');
            return;
        }

        try {
            setLoading(true);
            await addExpense(amountNum, selectedCategory, currentWeekIndex);

            // Check if we should show warning after adding expense
            const overview = await getBudgetOverview();
            if (overview.suggestFreeze) {
                setShowWarning(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    const handleWarningClose = () => {
        setShowWarning(false);
        navigate('/dashboard');
    };

    return (
        <div className="log-expense">
            <div className="log-expense__container">
                <h1 className="log-expense__title">Log Expense</h1>

                {/* Amount Input */}
                <div className="log-expense__section">
                    <label htmlFor="amount" className="log-expense__label">
                        Amount
                    </label>
                    <div className="log-expense__input-wrapper">
                        <span className="log-expense__currency">₹</span>
                        <input
                            id="amount"
                            type="number"
                            className="log-expense__input"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Selection */}
                <div className="log-expense__section">
                    <label className="log-expense__label">Category</label>
                    <div className="log-expense__categories">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className={`log-expense__category ${selectedCategory === category.id ? 'log-expense__category--active' : ''
                                    }`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span className="log-expense__category-icon">{category.icon}</span>
                                <span className="log-expense__category-label">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Optional Note */}
                <div className="log-expense__section">
                    <label htmlFor="note" className="log-expense__label">
                        Note (Optional)
                    </label>
                    <input
                        id="note"
                        type="text"
                        className="log-expense__note"
                        placeholder="e.g., Lunch with friends"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {/* Smart Feedback */}
                {amount && (
                    <div className="log-expense__feedback" style={{
                        backgroundColor: remainingBalance < 0 ? '#fee2e2' : '#fff',
                        borderColor: remainingBalance < 0 ? '#f87171' : '#000'
                    }}>
                        {remainingBalance >= 0
                            ? `This leaves ₹${remainingBalance} for the week.`
                            : `⚠️ This exceeds your weekly balance by ₹${Math.abs(remainingBalance)}!`
                        }
                    </div>
                )}

                {/* CTA Button */}
                <div className="log-expense__button-wrapper">
                    <NeoButton
                        variant="primary"
                        size="large"
                        onClick={handleAddExpense}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Expense'}
                    </NeoButton>
                </div>
            </div>

            {/* Warning Modal */}
            <WarningScreen isOpen={showWarning} onClose={handleWarningClose} />
        </div>
    );
};

export default LogExpense;
