import type { ComponentManager } from '@/component-manager'
import { componentManagerSymbol } from '@/constants'

export interface InternalHostNodeAttributes<HostNode> {
  [componentManagerSymbol]?: ComponentManager<HostNode>
}
