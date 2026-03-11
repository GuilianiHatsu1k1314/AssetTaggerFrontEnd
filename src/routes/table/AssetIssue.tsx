import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/table/AssetIssue')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/table/AssetIssue"!</div>
}
