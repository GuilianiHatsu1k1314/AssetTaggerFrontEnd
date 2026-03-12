import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Vendor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Vendor"!</div>
}
