import type { ComponentManager } from '@/component-manager'
import { componentManagerSymbol } from '@/constants'

export interface InternalHostNodeAttributes<HostNode, HostTextNode> {
  [componentManagerSymbol]?: ComponentManager<HostNode, HostTextNode>
}
