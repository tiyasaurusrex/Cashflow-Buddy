const BASE_URL = "http://localhost:5000";

export async function initBudget(payload: {
  income?: number;
  allowance: number;
 weeks?: number[];

}) {
  const res = await fetch(`${BASE_URL}/budget/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to initialize budget");
  }

  return res.json();
}


export async function addExpense(payload: {
  amount: number;
  category: string;
  weekIndex: number;
}) {
  const res = await fetch("http://localhost:5000/expense/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json(); // always read response

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}


export async function activateFreeze() {
  const res = await fetch("http://localhost:5000/budget/freeze", {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error("Failed to freeze spending");
  }

  return res.json();
}



export async function getBudget() {
  const res = await fetch("http://localhost:5000/budget/overview");
  if (!res.ok) throw new Error("Failed to fetch budget");
  return res.json();
}

