import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/EndUser')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/EndUser"!</div>
}
