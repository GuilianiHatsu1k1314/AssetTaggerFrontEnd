import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Employee')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Employee"!</div>
}
