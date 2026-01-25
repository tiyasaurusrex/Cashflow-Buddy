const budgetRepo = require("../repository/budget.repository");

exports.activate = async (req, res) => {
  const budget = await budgetRepo.getUser();
  if (!budget) return res.status(400).json({ error: "No budget" });

  const freezeUntil = new Date();
  freezeUntil.setHours(freezeUntil.getHours() + 24);

  budget.freezeUntil = freezeUntil;
  await budget.save();

  res.json({ freezeUntil });
};
