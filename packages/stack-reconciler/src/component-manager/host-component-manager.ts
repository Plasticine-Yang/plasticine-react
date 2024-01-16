import { ReactElement, isHostComponent } from '@plasticine-react/shared'

import { BaseComponentManager } from './base-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'
import { SPECIAL_PROPERTIES } from '@/constants'

export class HostComponentManager<HostNode> extends BaseComponentManager<HostNode> {
  public element: ReactElement
  public resolvedChildElementManagers: ComponentManager<HostNode>[]
  public hostNode: HostNode | null

  constructor(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode>) {
    if (!isHostComponent(element.type)) {
      throw new Error(
        `instantiate HostComponentManager instance failed, ReactElement type: ${element.type} is not a HostComponent`,
      )
    }

    super(options)

    this.element = element
    this.resolvedChildElementManagers = []
    this.hostNode = null
  }

  public mount(): HostNode {
    const { element, options } = this
    const { props } = element
    const { children } = props
    const { hostConfig, createComponentManager } = options

    const { createHostNode, setHostNodeAttribute, appendChild } = hostConfig

    const hostComponentType = element.type as string
    const resolvedChildren = (Array.isArray(children) ? children : [children]).filter(Boolean) as ReactElement[]

    const hostNode = createHostNode(hostComponentType)
    this.hostNode = hostNode

    for (const propName of Object.keys(props)) {
      if (!SPECIAL_PROPERTIES.includes(propName)) {
        setHostNodeAttribute(hostNode, propName, props[propName])
      }
    }

    const resolvedChildElementManagers = resolvedChildren.map((childElement) =>
      createComponentManager(childElement, hostConfig),
    )
    this.resolvedChildElementManagers = resolvedChildElementManagers

    const childHostNodes = resolvedChildElementManagers.map((childElementManager) => childElementManager.mount())
    for (const childHostNode of childHostNodes) {
      appendChild(hostNode, childHostNode)
    }

    return hostNode
  }
}
