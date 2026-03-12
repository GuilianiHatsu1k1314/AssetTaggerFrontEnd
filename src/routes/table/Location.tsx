import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Location')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Location"!</div>
}
