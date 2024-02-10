import { ClassComponent, ReactElement, isClassComponent } from '@plasticine-react/shared'

import { BaseComponentManager } from './base-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'

export class ClassComponentManager<HostNode, HostTextNode> extends BaseComponentManager<HostNode, HostTextNode> {
  public element: ReactElement
  public classComponentInstance: ClassComponent | null
  public resolvedElementComponentManager: ComponentManager<HostNode, HostTextNode> | null

  constructor(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode, HostTextNode>) {
    if (!isClassComponent(element.type)) {
      throw new Error(
        `instantiate ClassComponentManager instance failed, ReactElement type: ${element.type} is not a ClassComponent`,
      )
    }

    super(options)

    this.element = element
    this.classComponentInstance = null
    this.resolvedElementComponentManager = null
  }

  public mount(): HostNode | HostTextNode | null {
    const { element, options } = this
    const { hostConfig, createComponentManager } = options
    const classComponent = element.type as typeof ClassComponent

    const classComponentInstance = new classComponent(element.props)

    classComponentInstance.componentWillMount()

    const resolvedReactNode = classComponentInstance.render()
    const resolvedReactNodeComponentManager = createComponentManager(resolvedReactNode, hostConfig)

    this.classComponentInstance = classComponentInstance
    this.resolvedElementComponentManager = resolvedReactNodeComponentManager

    return resolvedReactNodeComponentManager?.mount() ?? null
  }

  public unmount(): void {
    const { classComponentInstance, resolvedElementComponentManager } = this

    classComponentInstance?.componentWillUnmount()
    resolvedElementComponentManager?.unmount()
  }
}
