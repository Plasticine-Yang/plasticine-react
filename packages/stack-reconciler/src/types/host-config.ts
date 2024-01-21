export interface HostConfig<HostNode> {
  createHostNode: (type: string) => HostNode
  setHostNodeAttribute: (hostNode: HostNode, key: PropertyKey, value: unknown) => void
  appendChild: (hostNode: HostNode, childNode: HostNode) => void
  getFirstChildFromHostNode: (hostNode: HostNode) => HostNode
  unmountHostNode: (hostNode: HostNode) => void
}
