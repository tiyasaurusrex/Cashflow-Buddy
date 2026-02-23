const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
    week: Number,
    allocated: Number,
    spent: Number,
    balance: Number
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    amount: Number,
    category: String,
    weekIndex: Number,
    date: String,
    note: { type: String, default: '' }
}, { _id: false });

const categoryTotalsSchema = new mongoose.Schema({
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    fun: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
}, { _id: false });

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    allowance: Number,
    monthStartDate: { type: Number, default: 1 },
    weeks: [weekSchema],
    expenses: [expenseSchema],
    categoryTotals: categoryTotalsSchema,
    isOverdrawn: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
