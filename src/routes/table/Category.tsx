import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Category')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Category"!</div>
}
