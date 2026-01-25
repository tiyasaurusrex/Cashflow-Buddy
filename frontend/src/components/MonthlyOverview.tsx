import React, { useState, useEffect, useMemo } from 'react';
import './MonthlyOverview.css';
import { getBudgetOverview } from '../apis';
import type { OverviewResponse, Expense } from '../apis';

interface Transaction {
    id: string;
    amount: number;
    category: string;
    categoryIcon: string;
    date: string;
    note?: string;
}

const getCategoryIcon = (category: string): string => {
    switch (category.toLowerCase()) {
        case 'food': return '🍔';
        case 'transport': return '🚕';
        case 'fun': return '🎮';
        default: return '📦';
    }
};

const MonthlyOverview: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allowance, setAllowance] = useState(0);
    const [weeklySpends, setWeeklySpends] = useState<{ week: number; spent: number; allocated: number }[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        try {
            setLoading(true);
            const data: OverviewResponse = await getBudgetOverview();
            
            setAllowance(data.budget.allowance);
            
            // Map weeks data
            const weeksData = data.budget.weeks.map((week) => ({
                week: week.week + 1,
                spent: week.spent,
                allocated: week.allocated,
            }));
            setWeeklySpends(weeksData);
            
            // Map expenses to transactions
            const txns: Transaction[] = data.budget.expenses.map((expense: Expense, index: number) => ({
                id: `exp-${index}`,
                amount: expense.amount,
                category: expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
                categoryIcon: getCategoryIcon(expense.category),
                date: expense.date ? new Date(expense.date).toLocaleDateString() : 'Recent',
                note: undefined,
            }));
            setTransactions(txns);
            
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load overview');
        } finally {
            setLoading(false);
        }
    };

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    // Calculations
    const totalSpent = weeklySpends.reduce((acc, curr) => acc + curr.spent, 0);
    const saved = allowance - totalSpent;

    const getStatusColor = (spent: number, allocated: number) => {
        if (spent > allocated) return '#FF006E'; // Vibrant Pink/Red
        if (spent > allocated * 0.9) return '#FFD60A'; // Vibrant Yellow
        return '#00D9FF'; // Vibrant Cyan
    };

    // Insight Logic
    const insightMessage = useMemo(() => {
        if (weeklySpends.length < 4) return "Keep tracking to see your monthly patterns!";
        
        const w1 = weeklySpends[0];
        const w2 = weeklySpends[1];
        const w3 = weeklySpends[2];
        const w4 = weeklySpends[3];

        if (w1.spent > w1.allocated && w3.spent < w3.allocated) {
            return "Week 1 overspending caused tight Week 3.";
        } else if (w2.spent < w2.allocated && w4.spent < w4.allocated) {
            return "Great job! Consistent saving in Week 2 & 4.";
        } else if (weeklySpends.every(w => w.spent <= w.allocated)) {
            return "Steady spending! You stayed within budget all month.";
        }
        return "Keep tracking to see your monthly patterns!";
    }, [weeklySpends]);

    if (loading) {
        return (
            <div className="monthly-overview">
                <div className="monthly-container">
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Loading overview...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="monthly-overview">
                <div className="monthly-container">
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#f87171' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="monthly-overview">
            <div className="monthly-container">
                <header>
                    <h1 className="monthly-header">Monthly Overview</h1>
                </header>

                {/* Summary Stats */}
                <section className="monthly-summary">
                    <div className="summary-card">
                        <span className="summary-label">Allowance</span>
                        <span className="summary-value">₹{allowance}</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Spent</span>
                        <span className="summary-value">₹{totalSpent}</span>
                    </div>
                    <div className="summary-card" style={{ backgroundColor: saved >= 0 ? '#00D9FF' : '#FF006E' }}>
                        <span className="summary-label">Saved</span>
                        <span className="summary-value">₹{saved}</span>
                    </div>
                </section>

                {/* Weekly Breakdown Chart */}
                <section className="monthly-chart-section">
                    <h2 className="section-title">Weekly Breakdown</h2>
                    <div className="chart-container">
                        {weeklySpends.map((week) => {
                            const maxSpent = Math.max(...weeklySpends.map(w => w.spent), week.allocated);
                            const heightPercent = maxSpent > 0 ? (week.spent / maxSpent) * 100 : 0;
                            return (
                                <div key={week.week} className="chart-bar-group">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            height: `${Math.max(heightPercent, 5)}%`,
                                            backgroundColor: getStatusColor(week.spent, week.allocated)
                                        }}
                                    >
                                        <span className="chart-bar-value">₹{week.spent}</span>
                                    </div>
                                    <span className="chart-label">W{week.week}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Insight Section */}
                <section className="monthly-insight">
                    <div className="insight-header">
                        <span className="insight-icon">💡</span>
                        <span>Insight</span>
                    </div>
                    <p className="insight-text">
                        {insightMessage}
                    </p>
                </section>

                {/* Transaction History Section */}
                <section className="monthly-transactions">
                    <h2 className="section-title">Transaction History</h2>
                    <p className="transactions-subtitle">Your money story lives here</p>

                    <div className="transactions-list">
                        {Object.entries(groupedTransactions).map(([date, txns]) => (
                            <div key={date} className="transactions-group">
                                <div className="transactions-date">{date}</div>
                                {txns.map((transaction) => (
                                    <div key={transaction.id} className="transaction-item neo-list-item">
                                        <div className="transaction-left">
                                            <span className="neo-list-item__icon">
                                                {transaction.categoryIcon}
                                            </span>
                                            <div className="transaction-details">
                                                <span className="transaction-category">
                                                    {transaction.category}
                                                </span>
                                                {transaction.note && (
                                                    <span className="transaction-note">
                                                        {transaction.note}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="transaction-amount">
                                            ₹{transaction.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MonthlyOverview;
