import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/expenses/')({
  component: Expenses,
})

function Expenses() {

  const expenses = [ "expense1", "expense2" ];

  return <div>
    {expenses.map(expense => (
      <div key={expense}>
        <Link 
          to="/expenses/$expenseid" 
          params={{
            expenseid: expense
          }}
        >
          {expense}
        </Link>
      </div>
    ))}
  </div>
}
