import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/adminpages/ManageUser')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/adminpages/ManageUser"!</div>
}
