const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema({
  weekIndex: Number,
  allocated: Number,
  spent: { type: Number, default: 0 },
  remaining: Number
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  weekIndex: Number,
  date: Date
}, { _id: false });

const budgetSchema = new mongoose.Schema({
  userId: String,
  allowance: Number,
  startDate: Date,
  savingsPot: Number,
  weeks: [weekSchema],
  expenses: [expenseSchema],
  freezeUntil: { type: Date, default: null }

});

module.exports = mongoose.model("Budget", budgetSchema);
