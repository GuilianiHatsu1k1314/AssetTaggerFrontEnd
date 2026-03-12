import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Manufacturer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Manufacturer"!</div>
}
