export interface HostConfig<HostNode, HostTextNode> {
  create: (type: string) => HostNode
  createTextNode: (textContent: string) => HostTextNode
  setAttribute: (hostNode: HostNode, key: PropertyKey, value: unknown) => void
  appendChild: (hostNode: HostNode, childNode: HostNode | HostTextNode) => void
  getFirstChild: (hostNode: HostNode) => HostNode
  unmount: (hostNode: HostNode) => void
  unmountTextNode: (hostTextNode: HostTextNode) => void
}
