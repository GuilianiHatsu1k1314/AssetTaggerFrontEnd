import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/Building')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/Building"!</div>
}
