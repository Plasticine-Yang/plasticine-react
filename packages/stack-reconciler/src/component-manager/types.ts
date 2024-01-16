import type { ReactElement } from '@plasticine-react/shared'

import type { HostConfig } from '@/types'

import type { ClassComponentManager } from './class-component-manager'
import type { FunctionComponentManager } from './function-component-manager'
import type { HostComponentManager } from './host-component-manager'

export type ComponentManager<HostNode> =
  | HostComponentManager<HostNode>
  | FunctionComponentManager<HostNode>
  | ClassComponentManager<HostNode>

export interface ComponentManagerConstructorOptions<HostNode> {
  hostConfig: HostConfig<HostNode>
  createComponentManager: (element: ReactElement, hostConfig: HostConfig<HostNode>) => ComponentManager<HostNode>
}
