import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/AssetFix')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/AssetFix"!</div>
}
