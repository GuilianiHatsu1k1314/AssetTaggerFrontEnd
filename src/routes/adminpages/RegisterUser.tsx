import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/adminpages/RegisterUser')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/adminpages/RegisterUser"!</div>
}
