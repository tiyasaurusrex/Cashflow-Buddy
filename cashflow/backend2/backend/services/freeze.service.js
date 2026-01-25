function shouldSuggestFreeze(expenses) {
  if (!expenses || expenses.length < 2) return false;

  const lastTwo = expenses.slice(-2);
  const today = new Date().toDateString();

  return lastTwo.every(
    e => new Date(e.date).toDateString() === today
  );
}

module.exports = { shouldSuggestFreeze };
