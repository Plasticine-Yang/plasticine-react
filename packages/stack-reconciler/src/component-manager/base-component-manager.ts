import type { ReactElement } from '@plasticine-react/shared'

import type { ComponentManagerConstructorOptions } from './types'

export abstract class BaseComponentManager<HostNode> {
  public options: ComponentManagerConstructorOptions<HostNode>

  constructor(options: ComponentManagerConstructorOptions<HostNode>) {
    this.options = options
  }

  abstract element: ReactElement

  abstract mount(): HostNode
}
