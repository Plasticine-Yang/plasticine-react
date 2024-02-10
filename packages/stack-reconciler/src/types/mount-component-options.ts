import type { ReactElement } from '@plasticine-react/shared'

import type { HostConfig } from './host-config'

export interface MountComponentOptions<HostNode, HostTextNode> {
  hostConfig: HostConfig<HostNode, HostTextNode>
  mount: <HostNode>(element: ReactElement, hostConfig: HostConfig<HostNode, HostTextNode>) => HostNode
}
