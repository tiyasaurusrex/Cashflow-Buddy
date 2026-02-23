const expenseService = require("../services/expense.service");

exports.add = async (req, res) => {
  try {
    const { amount, category, weekIndex, note } = req.body;

    if (!amount || !category || weekIndex === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await expenseService.addExpense(
      req.userId,
      Number(amount),
      category,
      weekIndex,
      note || ''
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
