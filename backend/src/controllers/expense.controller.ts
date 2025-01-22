import type { Request, Response } from "express";
import { createExpense, getExpenses } from "../services/expense.service.js";
export async function createExpenseController(
  req: Request,
  res: Response,
): Promise<void> {
  const expenseData = req.body;
  const userId = req.user?.id;

  const response = await createExpense(expenseData, userId);
  res.status(response.status).json(response);
}

export async function getExpensesController(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  const response = await getExpenses(userId);
  res.status(response.status).json(response);
}
