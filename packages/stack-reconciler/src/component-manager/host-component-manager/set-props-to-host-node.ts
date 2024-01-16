import type { ReactElementProps } from '@plasticine-react/shared'

import { SPECIAL_PROPERTIES } from '@/constants'

import type { ComponentManagerConstructorOptions } from '../types'

export function setPropsToHostNode<HostNode>(
  hostNode: HostNode,
  props: ReactElementProps,
  options: ComponentManagerConstructorOptions<HostNode>,
) {
  const { hostConfig } = options

  const { setHostNodeAttribute } = hostConfig

  for (const propName of Object.keys(props)) {
    if (!SPECIAL_PROPERTIES.includes(propName)) {
      setHostNodeAttribute(hostNode, propName, props[propName])
    }
  }
}
