import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/AssetTransfer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/AssetTransfer"!</div>
}
