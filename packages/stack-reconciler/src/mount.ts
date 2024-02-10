import { type ReactElement } from '@plasticine-react/shared'

import { createComponentManager } from './component-manager'
import { componentManagerSymbol } from './constants'
import type { HostConfig, InternalHostNodeAttributes, MountResult } from './types'

export function mount<HostNode, HostTextNode>(
  element: ReactElement,
  hostContainerNode: HostNode,
  hostConfig: HostConfig<HostNode, HostTextNode>,
): MountResult<HostNode, HostTextNode> {
  const { appendChild } = hostConfig
  const componentManager = createComponentManager(element, hostConfig)!
  const mountedHostNode = componentManager.mount()

  if (mountedHostNode !== null) {
    ;(mountedHostNode as InternalHostNodeAttributes<HostNode, HostTextNode>)[componentManagerSymbol] = componentManager

    appendChild(hostContainerNode, mountedHostNode)
  }

  return {
    componentManager,
    mountedHostNode,
  }
}
