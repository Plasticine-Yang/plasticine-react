import { isClassComponent, isFunctionComponent, isHostComponent, type ReactElement } from '@plasticine-react/shared'

import type { HostConfig } from '@/types'

import { ClassComponentManager } from './class-component-manager'
import { FunctionComponentManager } from './function-component-manager'
import { HostComponentManager } from './host-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'

export function createComponentManager<HostNode>(
  element: ReactElement,
  hostConfig: HostConfig<HostNode>,
): ComponentManager<HostNode> {
  const { type } = element
  const componentManagerConstructorOptions: ComponentManagerConstructorOptions<HostNode> = {
    hostConfig,
    createComponentManager,
  }

  if (isHostComponent(type)) {
    return new HostComponentManager(element, componentManagerConstructorOptions)
  } else if (isClassComponent(type)) {
    return new ClassComponentManager(element, componentManagerConstructorOptions)
  } else if (isFunctionComponent(type)) {
    return new FunctionComponentManager(element, componentManagerConstructorOptions)
  } else {
    throw new Error(`createComponentManager failed, unsupported ReactElement type: ${type}`)
  }
}
