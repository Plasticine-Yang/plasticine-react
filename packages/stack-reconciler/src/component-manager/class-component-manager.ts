import { ClassComponent, ReactElement, isClassComponent } from '@plasticine-react/shared'

import { BaseComponentManager } from './base-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'

export class ClassComponentManager<HostNode> extends BaseComponentManager<HostNode> {
  public element: ReactElement
  public classComponentInstance: ClassComponent | null
  public resolvedElementManager: ComponentManager<HostNode> | null

  constructor(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode>) {
    if (!isClassComponent(element.type)) {
      throw new Error(
        `instantiate ClassComponentManager instance failed, ReactElement type: ${element.type} is not a ClassComponent`,
      )
    }

    super(options)

    this.element = element
    this.classComponentInstance = null
    this.resolvedElementManager = null
  }

  public mount(): HostNode {
    const { element, options } = this
    const { hostConfig, createComponentManager } = options
    const classComponent = element.type as typeof ClassComponent

    const classComponentInstance = new classComponent(element.props)

    classComponentInstance.componentWillMount()

    const resolvedElement = classComponentInstance.render()
    const resolvedElementManager = createComponentManager(resolvedElement, hostConfig)

    this.classComponentInstance = classComponentInstance
    this.resolvedElementManager = resolvedElementManager

    return resolvedElementManager.mount()
  }
}