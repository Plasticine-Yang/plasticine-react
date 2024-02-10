import { FunctionComponent, ReactElement, isFunctionComponent } from '@plasticine-react/shared'

import { BaseComponentManager } from './base-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'

export class FunctionComponentManager<HostNode, HostTextNode> extends BaseComponentManager<HostNode, HostTextNode> {
  public element: ReactElement
  public resolvedElementComponentManager: ComponentManager<HostNode, HostTextNode> | null

  constructor(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode, HostTextNode>) {
    if (!isFunctionComponent(element.type)) {
      throw new Error(
        `instantiate FunctionComponentManager instance failed, ReactElement type: ${element.type} is not a FunctionComponent`,
      )
    }

    super(options)

    this.element = element
    this.resolvedElementComponentManager = null
  }

  public mount(): HostNode | HostTextNode | null {
    const { element, options } = this
    const { hostConfig, createComponentManager } = options
    const functionComponent = element.type as FunctionComponent

    const resolvedElement = functionComponent(element.props)
    const resolvedElementManager = createComponentManager(resolvedElement, hostConfig)

    this.resolvedElementComponentManager = resolvedElementManager

    return resolvedElementManager?.mount() ?? null
  }

  public unmount(): void {
    const { resolvedElementComponentManager } = this

    resolvedElementComponentManager?.unmount()
  }
}
