const budgetService = require("../services/budget.service");
const budgetRepository = require("../repository/budget.repository");

const { calculateBurnRate } = require("../services/burnRate.service");
const { predictRunOutDate } = require("../services/prediction.service");
const { shouldSuggestFreeze } = require("../services/freeze.service");


// -------- INIT BUDGET --------
exports.init = (req, res) => {
  const { allowance, weeklyAllocations } = req.body;

  try {
    const data = budgetService.initBudget(allowance, weeklyAllocations);

    budgetRepository.saveBudget(data);

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// -------- OVERVIEW / SUMMARY --------
exports.overview = (req, res) => {
  const budget = budgetRepository.getBudget();

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
exports.resetAllowance = (req, res) => {
  try {
    const { newAllowance, currentWeekIndex } = req.body;

    if (newAllowance == null || currentWeekIndex == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const budget = budgetRepository.getBudget();

    if (!budget) {
      return res.status(404).json({ error: "No budget found" });
    }

    const updatedBudget = budgetService.resetAllowance(
      budget,
      Number(newAllowance),
      Number(currentWeekIndex)
    );

    budgetRepository.saveBudget(updatedBudget);

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

