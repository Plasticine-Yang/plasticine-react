import type { ReactElement, InternalProps } from '@plasticine-react/shared'

import type { ComponentManagerConstructorOptions } from '../types'

export function mountChildrenToHostNode<HostNode>(
  hostNode: HostNode,
  children: InternalProps['children'],
  options: ComponentManagerConstructorOptions<HostNode>,
) {
  const { hostConfig, createComponentManager } = options

  const { appendChild } = hostConfig

  const resolvedChildren = (Array.isArray(children) ? children : [children]).filter(Boolean) as ReactElement[]

  const resolvedChildElementManagers = resolvedChildren.map((childElement) =>
    createComponentManager(childElement, hostConfig),
  )

  const childHostNodes = resolvedChildElementManagers.map((childElementManager) => childElementManager.mount())
  for (const childHostNode of childHostNodes) {
    appendChild(hostNode, childHostNode)
  }

  return resolvedChildElementManagers
}
