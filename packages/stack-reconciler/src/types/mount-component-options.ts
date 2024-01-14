import type { ReactElement } from '@plasticine-react/shared'

import type { HostConfig } from './host-config'

export interface MountComponentOptions<HostNode> {
  hostConfig: HostConfig<HostNode>
  mount: <HostNode>(element: ReactElement, hostConfig: HostConfig<HostNode>) => HostNode
}
