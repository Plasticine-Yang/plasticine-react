import type { ComponentManager } from '@/component-manager'

export interface MountResult<HostNode> {
  componentManager: ComponentManager<HostNode>
  mountedHostNode: HostNode
}
