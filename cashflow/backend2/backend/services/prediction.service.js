function predictRunOutDate(budget) {
  const expenses = budget.expenses;

  if (!expenses || expenses.length < 3) return null;

  const firstExpenseDate = new Date(expenses[0].date);
  const today = new Date();

  const daysElapsed =
    (today - firstExpenseDate) / (1000 * 60 * 60 * 24);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const dailyAvg = totalSpent / Math.max(daysElapsed, 1);

  const remainingMoney = budget.weeks.reduce(
    (sum, week) => sum + week.balance,
    0
  );

  const daysLeft = Math.floor(remainingMoney / dailyAvg);

  const runOutDate = new Date();
  runOutDate.setDate(runOutDate.getDate() + daysLeft);

  return {
    dailyAvg: Math.round(dailyAvg),
    runOutDate
  };
}

module.exports = { predictRunOutDate };
