import { z } from "zod";

export const expenseValidationSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
      message: "Amount must be a valid monetary value"
    }),
    date: z.date().or(z.string().datetime())
  });

  export type ExpenseInput = z.infer<typeof expenseValidationSchema>;
