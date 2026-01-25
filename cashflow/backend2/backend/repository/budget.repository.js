const Budget = require("../models/Budget");

async function saveUser(user) {
  let existing = await Budget.findOne();

  if (!existing) {
    return await Budget.create(user);
  }

  existing.allowance = user.allowance;
  existing.startDate = user.startDate;
  existing.savingsPot = user.savingsPot;
  existing.weeks = user.weeks;
  existing.expenses = user.expenses;

  return await existing.save();
}

async function getUser() {
  return await Budget.findOne();
}

module.exports = { saveUser, getUser };
