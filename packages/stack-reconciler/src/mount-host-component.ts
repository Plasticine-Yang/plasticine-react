import type { ReactElement } from '@plasticine-react/shared'

import type { MountComponentOptions } from './types'
import { SPECIAL_PROPERTIES } from './constants'

export function mountHostComponent<HostNode>(
  element: ReactElement,
  options: MountComponentOptions<HostNode>,
): HostNode {
  const { type, props } = element
  const { children = [] } = props
  const hostComponentType = type as string
  const resolvedChildren = (Array.isArray(children) ? children : [children]).filter(Boolean)
  const { hostConfig, mount } = options

  const { createHostNode, setHostNodeAttribute, appendChild } = hostConfig

  const hostNode = createHostNode(hostComponentType)

  for (const propName of Object.keys(props)) {
    if (!SPECIAL_PROPERTIES.includes(propName)) {
      setHostNodeAttribute(hostNode, propName, props[propName])
    }
  }

  for (const childElement of resolvedChildren) {
    const childHostNode = mount(childElement, hostConfig)

    appendChild(hostNode, childHostNode)
  }

  return hostNode
}
