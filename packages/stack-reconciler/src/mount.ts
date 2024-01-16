import { type ReactElement } from '@plasticine-react/shared'

import { createComponentManager } from './component-manager'
import type { HostConfig } from './types'

export function mount<HostNode>(element: ReactElement, hostConfig: HostConfig<HostNode>): HostNode {
  const rootComponentManager = createComponentManager(element, hostConfig)

  return rootComponentManager.mount()
}
