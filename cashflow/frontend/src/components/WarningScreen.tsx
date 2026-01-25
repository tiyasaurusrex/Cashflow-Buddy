import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WarningScreen.css";
import { getBudget, activateFreeze } from "../api";

const WarningScreen: React.FC = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    getBudget().then(setBudget);
  }, []);

  if (!budget) return <div>Loading...</div>;

  const totalBudget = budget.allowance;

  const totalSpent = budget.expenses.reduce(
    (sum: number, e: any) => sum + e.amount,
    0
  );

  const budgetRemaining = totalBudget - totalSpent;

  const daysLeft = 30 - new Date().getDate();

  const dailyRemaining = Math.floor(
    budgetRemaining / Math.max(daysLeft, 1)
  );

  const percentLeft = Math.max(
    0,
    (budgetRemaining / totalBudget) * 100
  );

  const handleFreeze = async () => {
    await activateFreeze();
    navigate("/dashboard");
  };

  return (
    <div className="warning-screen">
      <div className="warning-container">
        <span className="warning-icon">⚠️</span>

        <h1 className="warning-headline">₹{dailyRemaining}/day</h1>
        <p className="warning-subtext">Remaining</p>

        <p className="warning-explanation-text">
          You are spending too fast to last the month.
        </p>

        <div className="warning-visual">
          <div className="countdown-section">
            <div className="countdown-label">Days Left</div>
            <div className="countdown-value">{daysLeft}</div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentLeft}%` }}
            >
              {Math.round(percentLeft)}%
            </div>
          </div>
        </div>

        <div className="warning-controls">
          <button className="warning-btn warning-btn-primary" onClick={handleFreeze}>
            🔒 Freeze Spending for 24h
          </button>

          <button
            className="warning-btn warning-btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            I’ll be careful
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningScreen;
