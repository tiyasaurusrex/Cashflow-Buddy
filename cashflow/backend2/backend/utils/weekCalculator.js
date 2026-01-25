function getCurrentWeek(startDate, totalWeeks) {
  const diff = Math.floor(
    (Date.now() - startDate) / (7 * 24 * 60 * 60 * 1000)
  );

  // Ensure week stays within range
  return Math.min(diff + 1, totalWeeks);
}

module.exports = { getCurrentWeek };
