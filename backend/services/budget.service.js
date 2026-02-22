// -------- INIT BUDGET --------
function initBudget(allowance, weeklyAllocations, monthStartDate = 1) {
  if (!allowance || allowance <= 0) {
    throw new Error("Invalid allowance");
  }

  const weeklyAmount = Math.floor(allowance / 4);

  const weeks = Array.from({ length: 4 }, (_, i) => ({
    week: i,
    allocated: weeklyAllocations?.[i] ?? weeklyAmount,
    spent: 0,
    balance: weeklyAllocations?.[i] ?? weeklyAmount
  }));

  return {
    allowance,
    monthStartDate,
    weeks,
    expenses: [],
    categoryTotals: {
      food: 0,
      transport: 0,
      fun: 0,
      other: 0
    },
    isOverdrawn: false
  };
}


// -------- APPLY EXPENSE + SNOWBALL --------
function applyExpenseToWeeklyBudget(budget, amount, weekIndex) {
  const weeks = budget.weeks;

  if (!weeks[weekIndex]) {
    throw new Error("Invalid week index");
  }

  let remaining = amount;

  // 1️ Use current week first
  const currentWeek = weeks[weekIndex];
  const usedFromCurrent = Math.min(currentWeek.balance, remaining);
  currentWeek.balance -= usedFromCurrent;
  currentWeek.spent += usedFromCurrent;
  remaining -= usedFromCurrent;

  // 2️ Pull from PREVIOUS weeks (backward)
  for (let i = weekIndex - 1; i >= 0 && remaining > 0; i--) {
    const prevWeek = weeks[i];
    const used = Math.min(prevWeek.balance, remaining);
    prevWeek.balance -= used;
    prevWeek.spent += used;
    remaining -= used;
  }

  // 3️ Pull from NEXT weeks (forward)
  for (let i = weekIndex + 1; i < weeks.length && remaining > 0; i++) {
    const nextWeek = weeks[i];
    const used = Math.min(nextWeek.balance, remaining);
    nextWeek.balance -= used;
    nextWeek.allocated -= used; // important: reduce future allowance
    remaining -= used;
  }

  if (remaining > 0) {
    budget.isOverdrawn = true;
  }

  return budget;
}

// -------- RESET / UPDATE ALLOWANCE --------
function resetAllowance(budget, newAllowance, currentWeekIndex) {
  if (!newAllowance || newAllowance <= 0) {
    throw new Error("Invalid allowance");
  }

  const weeks = budget.weeks;

  if (!weeks[currentWeekIndex]) {
    throw new Error("Invalid week index");
  }

  const totalSpent = weeks.reduce(
    (sum, week) => sum + week.spent,
    0
  );

  budget.allowance = newAllowance;

  let remainingMoney = newAllowance - totalSpent;

  if (remainingMoney < 0) {
    budget.isOverdrawn = true;
    remainingMoney = 0;
  }

  const remainingWeeks = weeks.length - currentWeekIndex;

  if (remainingWeeks <= 0) {
    throw new Error("No weeks left to redistribute allowance");
  }

  const perWeekAllocation = Math.floor(
    remainingMoney / remainingWeeks
  );

  for (let i = currentWeekIndex; i < weeks.length; i++) {
    const week = weeks[i];

    week.allocated = perWeekAllocation;
    week.balance = Math.max(
      perWeekAllocation - week.spent,
      0
    );
  }

  return budget;
}

// -------- UPDATE MONTH START DATE --------
function updateMonthStartDate(budget, newMonthStartDate) {
  if (!newMonthStartDate || newMonthStartDate < 1 || newMonthStartDate > 28) {
    throw new Error("Invalid month start date. Must be between 1 and 28.");
  }

  budget.monthStartDate = newMonthStartDate;
  return budget;
}

module.exports = {
  initBudget,
  applyExpenseToWeeklyBudget,
  resetAllowance,
  updateMonthStartDate
};
