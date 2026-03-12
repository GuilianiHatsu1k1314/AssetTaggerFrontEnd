import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Department')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Department"!</div>
}
