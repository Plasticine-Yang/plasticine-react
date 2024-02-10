import { componentManagerSymbol } from './constants'
import type { HostConfig, InternalHostNodeAttributes } from './types'

export function unmount<HostNode, HostTextNode>(
  hostContainerNode: HostNode,
  hostConfig: HostConfig<HostNode, HostTextNode>,
) {
  const { getFirstChild: getFirstChildFromHostNode, unmount: unmountHostNode } = hostConfig

  const mountedHostNode = getFirstChildFromHostNode(hostContainerNode)

  if (!mountedHostNode) {
    throw new Error('hostContainerNode has no child node mounted.')
  }

  const mountedHostNodeComponentManager = (mountedHostNode as InternalHostNodeAttributes<HostNode, HostTextNode>)[
    componentManagerSymbol
  ]

  if (!mountedHostNodeComponentManager) {
    throw new Error('mountedHostNode has no related componentManager')
  }

  mountedHostNodeComponentManager.unmount()
  unmountHostNode(hostContainerNode)
}
