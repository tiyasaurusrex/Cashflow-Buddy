function calculateBurnRate(budget) {
  const today = new Date();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // Include today in the remaining days (today still has budget to spend)
  const daysRemaining = daysInMonth - today.getDate() + 1;

  const remainingMoney = budget.weeks.reduce(
    (sum, week) => sum + week.balance,
    0
  );

  const safeDailySpend =
    daysRemaining > 0
      ? Math.floor(remainingMoney / daysRemaining)
      : 0;

  return {
    daysRemaining,
    remainingMoney,
    safeDailySpend
  };
}

module.exports = { calculateBurnRate };
