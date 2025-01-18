import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    }
  }, {
    timestamps: true
  });
// Create index on userId
expenseSchema.index({ userId: 1 });

  export const Expense = mongoose.model('Expense', expenseSchema);