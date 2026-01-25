import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useEffect, useState } from "react";
import { getBudget } from "../api";




interface EnvelopeData {
    week: number;
    allocated: number;
    spent: number;
    remaining: number;
    status: 'safe' | 'warning' | 'danger';
}

const Dashboard: React.FC = () => {
    const [budget, setBudget] = useState<any>(null);

    const navigate = useNavigate();

    

useEffect(() => {
  getBudget().then((data) => {
    setBudget(data);

    if (data.isFrozen || data.suggestFreeze) {
      navigate("/warning");
    }
  });
}, []);


    // Sample data - in real app, this would come from state/props
  if (!budget) return <div>Loading...</div>;

const weeks = budget.weeks.map((w: any, i: number) => {
  const remaining = w.allocated - w.spent;

  let status: "safe" | "warning" | "danger" = "safe";
  if (remaining < w.allocated * 0.3) status = "danger";
  else if (remaining < w.allocated * 0.6) status = "warning";

  return {
    week: i + 1,
    allocated: w.allocated,
    spent: w.spent,
    remaining,
    status
  };
});

const currentWeek = 1; // for now
const current = weeks[currentWeek - 1];

const balanceLeft = current.remaining;
const daysLeft = 7; // simple for now
const dailySafeSpend = Math.round(balanceLeft / daysLeft);


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'safe':
                return '#4ade80'; // Green
            case 'warning':
                return '#fbbf24'; // Yellow
            case 'danger':
                return '#f87171'; // Red
            default:
                return '#88aaee';
        }
    };

    const handleLogExpense = () => {
        navigate('/log-expense');
    };


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

                {/* Micro Nudge */}
                <div className="dashboard__nudge">
                    <span className="dashboard__nudge-emoji">👍</span>
                    <span className="dashboard__nudge-text">
                        You're doing okay. ₹{dailySafeSpend}/day left
                    </span>
                </div>

                {/* Envelope Cards */}
                <div className="dashboard__envelopes">
                    <h2 className="dashboard__section-title">Weekly Envelopes</h2>
                    <div className="dashboard__envelope-grid">
                        {weeks.map((envelope: any) => (
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
                                            width: `${(envelope.remaining / envelope.allocated) * 100}%`,
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
        </div>
    );
};

export default Dashboard;
