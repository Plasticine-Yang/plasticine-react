import { type ReactElement } from '@plasticine-react/shared'

import { createComponentManager } from './component-manager'
import { componentManagerSymbol } from './constants'
import type { HostConfig, InternalHostNodeAttributes, MountResult } from './types'

export function mount<HostNode>(
  element: ReactElement,
  hostContainerNode: HostNode,
  hostConfig: HostConfig<HostNode>,
): MountResult<HostNode> {
  const { appendChild } = hostConfig
  const componentManager = createComponentManager(element, hostConfig)
  const mountedHostNode = componentManager.mount()

  ;(mountedHostNode as InternalHostNodeAttributes<HostNode>)[componentManagerSymbol] = componentManager

  appendChild(hostContainerNode, mountedHostNode)

  return {
    componentManager,
    mountedHostNode,
  }
}
