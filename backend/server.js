require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const budgetRoutes = require("./routes/budget.routes");
const expenseRoutes = require("./routes/expense.routes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/budget", budgetRoutes);
app.use("/expense", expenseRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
