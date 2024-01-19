import { ReactElement, isHostComponent } from '@plasticine-react/shared'

import { BaseComponentManager } from '../base-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from '../types'
import { createHostNode } from './create-host-node'
import { setPropsToHostNode } from './set-props-to-host-node'
import { mountChildrenToHostNode } from './mount-children'

export class HostComponentManager<HostNode> extends BaseComponentManager<HostNode> {
  public element: ReactElement
  public resolvedChildElementComponentManagers: ComponentManager<HostNode>[]
  public hostNode: HostNode | null

  constructor(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode>) {
    if (!isHostComponent(element.type)) {
      throw new Error(
        `instantiate HostComponentManager instance failed, ReactElement type: ${element.type} is not a HostComponent`,
      )
    }

    super(options)

    this.element = element
    this.resolvedChildElementComponentManagers = []
    this.hostNode = null
  }

  public mount(): HostNode {
    const { element, options } = this
    const { props } = element
    const { children } = props

    const hostNode = createHostNode(element, options)
    this.hostNode = hostNode

    setPropsToHostNode(hostNode, props, options)

    const resolvedChildElementComponentManagers = mountChildrenToHostNode(hostNode, children, options)
    this.resolvedChildElementComponentManagers = resolvedChildElementComponentManagers

    return hostNode
  }

  public unmount(): void {
    const { resolvedChildElementComponentManagers } = this

    for (const childElementComponentManager of resolvedChildElementComponentManagers) {
      childElementComponentManager.unmount()
    }
  }
}
