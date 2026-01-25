const expenseService = require("../services/expense.service");

exports.add = async (req, res) => {
  try {
    console.log("EXPENSE BODY:", req.body);   // 🔥 THIS

    const { amount, category, weekIndex } = req.body;

    const budget = await expenseService.addExpense(
      Number(amount),
      category,
      Number(weekIndex)
    );

    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
