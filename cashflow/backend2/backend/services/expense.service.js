const budgetRepository = require("../repository/budget.repository");

const ALLOWED_CATEGORIES = ["food", "transport", "fun", "other"];
const TOTAL_WEEKS = 4;
const MS_IN_DAY = 1000 * 60 * 60 * 24;

function getCurrentWeekIndex(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  const diffDays = Math.floor((now - start) / MS_IN_DAY);
  const week = Math.floor(diffDays / 7);

  // clamp between 0 and 3
  return Math.max(0, Math.min(TOTAL_WEEKS - 1, week));
}



async function addExpense(amount, category, weekIndex) {
  const cleanCategory = category.toLowerCase().trim();
  if (!ALLOWED_CATEGORIES.includes(cleanCategory)) {
    throw new Error("Invalid category");
  }

  const budget = await budgetRepository.getUser();
  if (!budget) throw new Error("Budget not initialized");

  // 🔒 FREEZE CHECK (THIS WAS MISSING)
  const now = new Date();
  if (budget.freezeUntil && now < new Date(budget.freezeUntil)) {
    throw new Error("Spending is frozen for 24 hours. Try again later.");
  }

  const week = budget.weeks[weekIndex];
  if (!week) throw new Error("Invalid week index");

  if (week.allocated - week.spent < amount) {
    throw new Error("Not enough weekly balance");
  }

  week.spent += amount;

  budget.expenses.push({
    amount,
    category: cleanCategory,
    weekIndex,
    date: new Date()
  });

  await budget.save();
  return budget;
}



module.exports = { addExpense };
