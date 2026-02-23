function shouldSuggestFreeze(expenses) {
  if (!expenses || expenses.length < 3) return false;

  // Only warn if 3 or more expenses were logged today
  // (2 in a day is normal; 3+ in a day signals heavy spending)
  const lastThree = expenses.slice(-3);
  const today = new Date().toDateString();

  return lastThree.every(
    e => new Date(e.date).toDateString() === today
  );
}

module.exports = { shouldSuggestFreeze };
