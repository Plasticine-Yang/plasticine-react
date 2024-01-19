import { FunctionComponent, ReactElement, isFunctionComponent } from '@plasticine-react/shared'

import { BaseComponentManager } from './base-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'

export class FunctionComponentManager<HostNode> extends BaseComponentManager<HostNode> {
  public element: ReactElement
  public resolvedElementManager: ComponentManager<HostNode> | null

  constructor(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode>) {
    if (!isFunctionComponent(element.type)) {
      throw new Error(
        `instantiate FunctionComponentManager instance failed, ReactElement type: ${element.type} is not a FunctionComponent`,
      )
    }

    super(options)

    this.element = element
    this.resolvedElementManager = null
  }

  public mount(): HostNode {
    const { element, options } = this
    const { hostConfig, createComponentManager } = options
    const functionComponent = element.type as FunctionComponent

    const resolvedElement = functionComponent(element.props)
    const resolvedElementManager = createComponentManager(resolvedElement, hostConfig)

    this.resolvedElementManager = resolvedElementManager

    return resolvedElementManager.mount()
  }

  public unmount(): void {
    // do nothing
  }
}
