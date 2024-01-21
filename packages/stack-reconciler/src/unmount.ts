import { componentManagerSymbol } from './constants'
import type { HostConfig, InternalHostNodeAttributes } from './types'

export function unmount<HostNode>(hostContainerNode: HostNode, hostConfig: HostConfig<HostNode>) {
  const { getFirstChildFromHostNode, unmountHostNode } = hostConfig

  const mountedHostNode = getFirstChildFromHostNode(hostContainerNode)

  if (!mountedHostNode) {
    throw new Error('hostContainerNode has no child node mounted.')
  }

  const mountedHostNodeComponentManager = (mountedHostNode as InternalHostNodeAttributes<HostNode>)[
    componentManagerSymbol
  ]

  if (!mountedHostNodeComponentManager) {
    throw new Error('mountedHostNode has no related componentManager')
  }

  mountedHostNodeComponentManager.unmount()
  unmountHostNode(hostContainerNode)
}
