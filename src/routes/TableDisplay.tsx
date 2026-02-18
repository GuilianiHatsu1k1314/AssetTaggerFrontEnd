import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/TableDisplay')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/TableDisplay"!</div>
}
