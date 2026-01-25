const repo = require("../repository/budget.repository");

const TOTAL_WEEKS = 4;

function normalizeWeeks(rawWeeks) {
  // Converts [1000,2000,1000,1000]
  // OR [{allocated:1000}, ...]
  // into [1000,2000,1000,1000]
  return rawWeeks.map(w =>
    typeof w === "number" ? w : Number(w.allocated)
  );
}

async function initBudget(data) {
  const allowance = Number(data.allowance);

  if (isNaN(allowance)) {
    throw new Error("Invalid allowance");
  }

  let weeks;

  // 🔥 Custom split path
  // 🔥 If custom split is sent from UI
// 🔥 If custom split is sent from UI
if (
  Array.isArray(data.weeks) &&
  data.weeks.length === 4 &&
  data.weeks.every(w => typeof w === "number" && !isNaN(w))
) {
  const total = data.weeks.reduce((a, b) => a + b, 0);

  if (total !== allowance) {
    throw new Error("Weekly split must match allowance");
  }

  weeks = data.weeks.map((amt, i) => ({
    weekNumber: i + 1,
    allocated: amt,
    spent: 0
  }));
} 
else {
  // 🟦 Equal split
  const weeklyAmount = allowance / TOTAL_WEEKS;
  weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
    weekNumber: i + 1,
    allocated: weeklyAmount,
    spent: 0
  }));
}


  const user = {
    allowance,
    startDate: Date.now(),
    savingsPot: 0,
    weeks,
    expenses: []
  };

  return await repo.saveUser(user);
}

function getOverview() {
  return repo.getUser();
}

module.exports = {
  initBudget,
  getOverview,
  getBudget: async () => {
    return await repo.getUser();
  }
};
