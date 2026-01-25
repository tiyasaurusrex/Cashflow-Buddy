const Expense = require("../models/Expense");

function addExpense(data) {
  return Expense.create(data);
}

function getExpenses(userId) {
  return Expense.find({ userId });
}

module.exports = {
  addExpense,
  getExpenses
};
