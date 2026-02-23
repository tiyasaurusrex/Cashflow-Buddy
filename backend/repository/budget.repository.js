const Budget = require('../models/Budget');

async function saveBudget(userId, data) {
  const { _id, __v, createdAt, updatedAt, ...saveData } = data;
  const budget = await Budget.findOneAndUpdate(
    { userId },
    { $set: { ...saveData, userId } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  return budget.toObject();
}

// Atomically push a new expense and update week/category data in one operation
async function addExpenseToBudget(userId, updatedWeeks, updatedCategoryTotals, isOverdrawn, expenseEntry) {
  const budget = await Budget.findOneAndUpdate(
    { userId },
    {
      $set: {
        weeks: updatedWeeks,
        categoryTotals: updatedCategoryTotals,
        isOverdrawn,
      },
      $push: { expenses: expenseEntry },
    },
    { returnDocument: 'after' }
  );
  return budget ? budget.toObject() : null;
}

async function getBudget(userId) {
  const budget = await Budget.findOne({ userId });
  return budget ? budget.toObject() : null;
}

async function clearBudget(userId) {
  await Budget.deleteOne({ userId });
}

module.exports = {
  saveBudget,
  addExpenseToBudget,
  getBudget,
  clearBudget
};
