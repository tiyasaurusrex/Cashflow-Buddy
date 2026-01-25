require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

const express = require("express");
const cors = require("cors");

const budgetRoutes = require("./routes/budget.routes");
const expenseRoutes = require("./routes/expense.routes");

const app = express();
app.use(cors());
app.use(express.json());   // 🚨 THIS WAS MISSING OR IN WRONG PLACE

app.use("/budget", budgetRoutes);
app.use("/expense", expenseRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
