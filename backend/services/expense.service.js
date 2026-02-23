const budgetRepository = require("../repository/budget.repository");
const { applyExpenseToWeeklyBudget } = require("./budget.service");

const ALLOWED_CATEGORIES = ["food", "transport", "fun", "other"];

async function addExpense(userId, amount, category, weekIndex, note = '') {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error("Invalid expense category");
  }

  const budget = await budgetRepository.getBudget(userId);
  if (!budget) {
    throw new Error("Budget not initialized");
  }

  // Apply weekly snowball logic (mutates budget.weeks in-place)
  const updatedBudget = applyExpenseToWeeklyBudget(budget, amount, weekIndex);

  // Update category totals
  updatedBudget.categoryTotals[category] += amount;

  const expenseEntry = {
    amount,
    category,
    weekIndex,
    date: new Date().toISOString(),
    note,
  };

  // Atomic $push keeps the note field intact — never lost by array replacement
  const result = await budgetRepository.addExpenseToBudget(
    userId,
    updatedBudget.weeks,
    updatedBudget.categoryTotals,
    updatedBudget.isOverdrawn,
    expenseEntry
  );

  return result;
}

module.exports = { addExpense };
