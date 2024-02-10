import type { ReactTextNode } from '@plasticine-react/shared'

import { BaseComponentManager } from './base-component-manager'
import type { ComponentManagerConstructorOptions } from './types'

export class TextNodeComponentManager<HostNode, HostTextNode> extends BaseComponentManager<HostNode, HostTextNode> {
  public textContent: string
  public hostTextNode: HostTextNode | null

  constructor(reactTextNode: ReactTextNode, options: ComponentManagerConstructorOptions<HostNode, HostTextNode>) {
    super(options)

    this.textContent = reactTextNode.toString()
    this.hostTextNode = null
  }

  public mount(): HostTextNode {
    const { hostConfig } = this.options
    const { createTextNode } = hostConfig

    const hostTextNode = createTextNode(this.textContent)
    this.hostTextNode = hostTextNode

    return hostTextNode
  }

  public unmount(): void {
    if (this.hostTextNode === null) {
      throw new Error('hostTextNode is null, can not unmount')
    }

    const { hostConfig } = this.options
    const { unmountTextNode } = hostConfig

    unmountTextNode(this.hostTextNode)
  }
}
