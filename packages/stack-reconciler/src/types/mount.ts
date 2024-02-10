import type { ComponentManager } from '@/component-manager'

export interface MountResult<HostNode, HostTextNode> {
  componentManager: ComponentManager<HostNode, HostTextNode>
  mountedHostNode: HostNode | HostTextNode | null
}
