import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Role')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Role"!</div>
}
