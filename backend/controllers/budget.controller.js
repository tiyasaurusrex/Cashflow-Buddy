const budgetService = require("../services/budget.service");
const budgetRepository = require("../repository/budget.repository");
const { getCurrentWeek } = require("../utils/weekCalculator");

const { calculateBurnRate } = require("../services/burnRate.service");
const { predictRunOutDate } = require("../services/prediction.service");
const { shouldSuggestFreeze } = require("../services/freeze.service");


// -------- INIT BUDGET --------
exports.init = async (req, res) => {
  const { allowance, weeklyAllocations, monthStartDate } = req.body;

  try {
    const data = budgetService.initBudget(allowance, weeklyAllocations, monthStartDate);

    // Preserve existing expenses and category totals if a budget already exists
    const existing = await budgetRepository.getBudget(req.userId);
    if (existing) {
      data.expenses = existing.expenses;
      data.categoryTotals = existing.categoryTotals;
      data.isOverdrawn = existing.isOverdrawn;
    }

    await budgetRepository.saveBudget(req.userId, data);

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// -------- OVERVIEW / SUMMARY --------
exports.overview = async (req, res) => {
  const budget = await budgetRepository.getBudget(req.userId);

  if (!budget) {
    return res.status(404).json({ error: "No budget found" });
  }

  res.json({
    budget,
    burnRate: calculateBurnRate(budget),
    prediction: predictRunOutDate(budget),
    suggestFreeze: shouldSuggestFreeze(budget.expenses)
  });
};

// -------- RESET / UPDATE ALLOWANCE --------
exports.resetAllowance = async (req, res) => {
  try {
    const { newAllowance, currentWeekIndex } = req.body;

    if (newAllowance == null || currentWeekIndex == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const budget = await budgetRepository.getBudget(req.userId);

    if (!budget) {
      return res.status(404).json({ error: "No budget found" });
    }

    const updatedBudget = budgetService.resetAllowance(
      budget,
      Number(newAllowance),
      Number(currentWeekIndex)
    );

    await budgetRepository.saveBudget(req.userId, updatedBudget);

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------- UPDATE ALLOWANCE (from settings) --------
exports.updateAllowance = async (req, res) => {
  try {
    const { allowance } = req.body;

    if (allowance == null) {
      return res.status(400).json({ error: "Missing allowance field" });
    }

    const budget = await budgetRepository.getBudget(req.userId);

    if (!budget) {
      return res.status(404).json({ error: "No budget found" });
    }

    // Derive the actual current week index from today's date and month start
    const today = new Date();
    const monthStart = budget.monthStartDate || 1;
    const startDate = new Date(today.getFullYear(), today.getMonth(), monthStart).getTime();
    const currentWeekIndex = Math.min(getCurrentWeek(startDate, 4) - 1, 3); // 1-indexed → 0-indexed, cap at 3

    const updatedBudget = budgetService.resetAllowance(
      budget,
      Number(allowance),
      currentWeekIndex
    );

    await budgetRepository.saveBudget(req.userId, updatedBudget);

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------- UPDATE MONTH START DATE --------
exports.updateMonthStartDate = async (req, res) => {
  try {
    const { monthStartDate } = req.body;

    if (monthStartDate == null) {
      return res.status(400).json({ error: "Missing monthStartDate field" });
    }

    const budget = await budgetRepository.getBudget(req.userId);

    if (!budget) {
      return res.status(404).json({ error: "No budget found" });
    }

    const updatedBudget = budgetService.updateMonthStartDate(
      budget,
      Number(monthStartDate)
    );

    await budgetRepository.saveBudget(req.userId, updatedBudget);

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// -------- RESET MONTH --------
exports.resetMonth = async (req, res) => {
  try {
    await budgetRepository.clearBudget(req.userId);
    res.json({ message: "Budget reset successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
