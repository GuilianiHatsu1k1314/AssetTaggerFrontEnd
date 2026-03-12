import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/ProductSet')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/ProductSet"!</div>
}
