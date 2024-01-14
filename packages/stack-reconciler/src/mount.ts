import { isClassComponent, isFunctionComponent, isHostComponent, type ReactElement } from '@plasticine-react/shared'

import { mountClassComponent } from './mount-class-component'
import { mountFunctionComponent } from './mount-function-component'
import { mountHostComponent } from './mount-host-component'
import type { HostConfig, MountComponentOptions } from './types'

export function mount<HostNode>(element: ReactElement, hostConfig: HostConfig<HostNode>): HostNode {
  const { type } = element
  const mountComponentOptions: MountComponentOptions<HostNode> = { hostConfig, mount }

  // base case - 遇到 HostComponent 就可以 mount 完返回
  if (isHostComponent(type)) {
    return mountHostComponent<HostNode>(element, mountComponentOptions)
  }

  let renderedElement: ReactElement | null

  if (isClassComponent(type)) {
    renderedElement = mountClassComponent(element)
  } else if (isFunctionComponent(type)) {
    renderedElement = mountFunctionComponent(element)
  } else {
    renderedElement = null
  }

  if (renderedElement === null) {
    throw new Error(`unsupported ReactElement type - ${type}`, { cause: type })
  }

  return mount(renderedElement, hostConfig)
}
