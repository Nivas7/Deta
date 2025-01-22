import { Expense } from "../models/Expense.js";
import { ExpenseInput } from "../types/expenseType.js";

interface ServiceResponse {
  success: boolean;
  status: number;
  message?: string;
  data?: any;
}

export async function createExpense(expenseData: ExpenseInput, userId: string): Promise<ServiceResponse> {
  try {
    const expense = await Expense.create({ ...expenseData, userId });
    return {
      success: true,
      status: 201,
      data: expense
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: 'Failed to create expense'
    };
  }
}

export async function getExpenses(userId: string): Promise<ServiceResponse> {
  try {
    const expenses = await Expense.find({ userId });
    return {
      success: true,
      status: 200,
      data: expenses
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: 'Failed to fetch expenses'
    };
  }
}