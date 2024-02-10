import type { ReactNode } from '@plasticine-react/shared'

import type { HostConfig } from '@/types'

import type { ClassComponentManager } from './class-component-manager'
import type { FunctionComponentManager } from './function-component-manager'
import type { HostComponentManager } from './host-component-manager'
import type { TextNodeComponentManager } from './text-node-component-manager'

export type ComponentManager<HostNode, HostTextNode> =
  | HostComponentManager<HostNode, HostTextNode>
  | FunctionComponentManager<HostNode, HostTextNode>
  | ClassComponentManager<HostNode, HostTextNode>
  | TextNodeComponentManager<HostNode, HostTextNode>

export interface ComponentManagerConstructorOptions<HostNode, HostTextNode> {
  hostConfig: HostConfig<HostNode, HostTextNode>
  createComponentManager: (
    reactNode: ReactNode,
    hostConfig: HostConfig<HostNode, HostTextNode>,
  ) => ComponentManager<HostNode, HostTextNode> | null
}
