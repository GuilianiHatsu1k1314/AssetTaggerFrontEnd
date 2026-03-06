import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/AdminPage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/AdminPage"!</div>
}
