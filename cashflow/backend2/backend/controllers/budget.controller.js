const budgetService = require("../services/budget.service");
const { shouldSuggestFreeze } = require("../services/freeze.service");

// Init budget
exports.init = async (req, res) => {
  try {
    const budget = await budgetService.initBudget(req.body);
    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Dashboard / overview
exports.overview = async (req, res) => {
  try {
    const budget = await budgetService.getBudget();   // MUST come first

    if (!budget) {
      return res.status(404).json({ error: "Budget not initialized" });
    }

    const isFrozen =
      budget.freezeUntil && new Date() < new Date(budget.freezeUntil);

    res.json({
      ...budget.toObject(),
      suggestFreeze: shouldSuggestFreeze(budget.expenses),
      isFrozen,
      freezeUntil: budget.freezeUntil
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.freeze = async (req, res) => {
  try {
    const budget = await budgetService.getBudget();
    if (!budget) return res.status(404).json({ error: "No budget" });

    // freeze for 24 hours
    budget.freezeUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await budget.save();

    res.json({
      message: "Spending frozen",
      freezeUntil: budget.freezeUntil
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
