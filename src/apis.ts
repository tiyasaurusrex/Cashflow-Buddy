const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// ===== TYPE DEFINITIONS =====
export interface Week {
    week: number;
    allocated: number;
    spent: number;
    balance: number;
}

export interface CategoryTotals {
    food: number;
    transport: number;
    fun: number;
    other: number;
}

export interface Budget {
    allowance: number;
    weeks: Week[];
    expenses: Expense[];
    categoryTotals: CategoryTotals;
    isOverdrawn: boolean;
}

export interface Expense {
    amount: number;
    category: string;
    weekIndex: number;
    date?: string;
}

export interface BurnRate {
    daysRemaining: number;
    remainingMoney: number;
    safeDailySpend: number;
}

export interface Prediction {
    dailyAvg: number;
    runOutDate: string;
}

export interface OverviewResponse {
    budget: Budget;
    burnRate: BurnRate;
    prediction: Prediction | null;
    suggestFreeze: boolean;
}

export interface InitBudgetRequest {
    allowance: number;
    weeklyAllocations?: number[];
}

export interface AddExpenseRequest {
    amount: number;
    category: string;
    weekIndex: number;
}

export async function initBudget(allowance: number, weeklyAllocations?: number[]): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budget/init`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            allowance,
            weeklyAllocations,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initialize budget');
    }

    return response.json();
}

export async function getBudgetOverview(): Promise<OverviewResponse> {
    const response = await fetch(`${API_BASE_URL}/budget/overview`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch budget overview');
    }

    return response.json();
}

export async function addExpense(amount: number, category: string, weekIndex: number): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/expense/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount,
            category,
            weekIndex,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add expense');
    }

    return response.json();
}

export function getCurrentWeekIndex(): number {
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth <= 7) return 0;
    if (dayOfMonth <= 14) return 1;
    if (dayOfMonth <= 21) return 2;
    return 3;
}
export function getDaysRemainingInWeek(): number {
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth <= 7) return 7 - dayOfMonth + 1;
    if (dayOfMonth <= 14) return 14 - dayOfMonth + 1;
    if (dayOfMonth <= 21) return 21 - dayOfMonth + 1;

    // Last week - days until end of month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return lastDay - dayOfMonth + 1;
}


export function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
}

export function getSpendingStatus(spent: number, allocated: number): 'safe' | 'warning' | 'danger' {
    if (allocated === 0) return 'safe';
    const percentage = (spent / allocated) * 100;

    if (percentage >= 100) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'safe';
}

export async function updateBudgetAllowance(newAllowance: number): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budget/update-allowance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allowance: newAllowance }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update budget allowance');
    }

    return response.json();
}

export async function resetMonthData(): Promise<Budget> {
    const response = await fetch(`${API_BASE_URL}/budget/reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset month data');
    }

    return response.json();
}
