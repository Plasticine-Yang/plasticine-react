import type { ComponentManagerConstructorOptions } from './types'

export abstract class BaseComponentManager<HostNode, HostTextNode> {
  public options: ComponentManagerConstructorOptions<HostNode, HostTextNode>

  constructor(options: ComponentManagerConstructorOptions<HostNode, HostTextNode>) {
    this.options = options
  }

  abstract mount(): HostNode | HostTextNode | null

  abstract unmount(): void
}
