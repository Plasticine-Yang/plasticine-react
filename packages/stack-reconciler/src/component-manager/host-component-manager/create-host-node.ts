import { ReactElement } from '@plasticine-react/shared'

import { ComponentManagerConstructorOptions } from '../types'

export function createHostNode<HostNode>(element: ReactElement, options: ComponentManagerConstructorOptions<HostNode>) {
  const { hostConfig } = options
  const { createHostNode: createHostNodeWithHostConfig } = hostConfig
  const hostComponentType = element.type as string

  const hostNode = createHostNodeWithHostConfig(hostComponentType)

  return hostNode
}
