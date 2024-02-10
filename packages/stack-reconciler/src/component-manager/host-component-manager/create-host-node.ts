import { ReactElement } from '@plasticine-react/shared'

import { ComponentManagerConstructorOptions } from '../types'

export function createHostNode<HostNode, HostTextNode>(
  element: ReactElement,
  options: ComponentManagerConstructorOptions<HostNode, HostTextNode>,
) {
  const { hostConfig } = options
  const { create: createHostNodeWithHostConfig } = hostConfig
  const hostComponentType = element.type as string

  const hostNode = createHostNodeWithHostConfig(hostComponentType)

  return hostNode
}
