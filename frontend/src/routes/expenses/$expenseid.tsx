import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/expenses/$expenseid')({
  component: RouteComponent,
  loader: async({params}) => {
    return {
      expenseId: params.expenseid,
    }
  }
})

function RouteComponent() {
  const { expenseId } = Route.useLoaderData();
  return <div>Hello {expenseId}</div>
}
