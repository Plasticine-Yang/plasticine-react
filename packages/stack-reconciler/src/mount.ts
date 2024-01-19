import { type ReactElement } from '@plasticine-react/shared'

import { createComponentManager } from './component-manager'
import type { HostConfig, MountResult } from './types'

export function mount<HostNode>(element: ReactElement, hostConfig: HostConfig<HostNode>): MountResult<HostNode> {
  const componentManager = createComponentManager(element, hostConfig)
  const mountedHostNode = componentManager.mount()

  return {
    componentManager,
    mountedHostNode,
  }
}
