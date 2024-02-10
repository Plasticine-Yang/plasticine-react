import type { ReactElement, ReservedProps } from '@plasticine-react/shared'

import type { ComponentManagerConstructorOptions } from '../types'

export function mountChildrenToHostNode<HostNode, HostTextNode>(
  hostNode: HostNode,
  children: ReservedProps['children'],
  options: ComponentManagerConstructorOptions<HostNode, HostTextNode>,
) {
  const { hostConfig, createComponentManager } = options

  const { appendChild } = hostConfig

  const resolvedChildren = (Array.isArray(children) ? children : [children]).filter(Boolean) as ReactElement[]

  const resolvedChildElementComponentManagers = resolvedChildren.map((childElement) =>
    createComponentManager(childElement, hostConfig),
  )

  const childHostNodes = resolvedChildElementComponentManagers
    .filter((childElementManager) => childElementManager !== null)
    .map((childElementManager) => childElementManager!.mount())

  for (const childHostNode of childHostNodes) {
    childHostNode && appendChild(hostNode, childHostNode)
  }

  return resolvedChildElementComponentManagers
}
