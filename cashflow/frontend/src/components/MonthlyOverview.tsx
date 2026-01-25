import { useEffect, useMemo, useState } from "react";
import "./MonthlyOverview.css";
import { getBudget } from "../api";

const MonthlyOverview = () => {
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    getBudget().then(setBudget).catch(console.error);
  }, []);

  if (!budget) return <div>Loading...</div>;

  const weeks = budget.weeks;

  const allowance = budget.allowance;
  const totalSpent = weeks.reduce((sum: number, w: any) => sum + w.spent, 0);
  const saved = allowance - totalSpent;

  const weeklyBudget = allowance / 4;

  const getStatusColor = (spent: number) => {
    if (spent > weeklyBudget) return "#FF006E";
    if (spent > weeklyBudget * 0.9) return "#FFD60A";
    return "#00D9FF";
  };

  const insightMessage = useMemo(() => {
    const overspent = weeks.filter((w: any) => w.spent > weeklyBudget).length;
    const savedWeeks = weeks.filter((w: any) => w.spent < weeklyBudget * 0.7).length;

    if (overspent > 0 && savedWeeks > 0)
      return "Some weeks overspent, others compensated. Snowball working.";

    if (overspent > 0)
      return "Overspending detected. You are eating into future weeks.";

    if (savedWeeks >= 2)
      return "Strong discipline. You built a savings buffer.";

    return "Steady spending. Keep tracking.";
  }, [weeks, weeklyBudget]);

  return (
    <div className="monthly-overview">
      <div className="monthly-container">

        <h1 className="monthly-header">Monthly Overview</h1>

        <section className="monthly-summary">
          <div className="summary-card">
            <span>Allowance</span>
            <span>₹{allowance}</span>
          </div>

          <div className="summary-card">
            <span>Spent</span>
            <span>₹{totalSpent}</span>
          </div>

          <div
            className="summary-card"
            style={{ backgroundColor: saved >= 0 ? "#00D9FF" : "#FF006E" }}
          >
            <span>Saved</span>
            <span>₹{saved}</span>
          </div>
        </section>

        <section className="monthly-chart-section">
          <h2>Weekly Breakdown</h2>

          <div className="chart-container">
            {weeks.map((w: any, i: number) => (
              <div key={i} className="chart-bar-group">
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.min((w.spent / w.allocated) * 100, 100)}%`,
                    backgroundColor: getStatusColor(w.spent),
                  }}
                >
                  ₹{w.spent}
                </div>
                <span>W{i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="monthly-insight">
          <h3>💡 Insight</h3>
          <p>{insightMessage}</p>
        </section>

      </div>
    </div>
  );
};

export default MonthlyOverview;
