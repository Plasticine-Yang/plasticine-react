import {
  ReactElement,
  ReactTextNode,
  isClassComponent,
  isFunctionComponent,
  isHostComponent,
  isReactTextNode,
  isValidReactElement,
  type ReactNode,
} from '@plasticine-react/shared'

import type { HostConfig } from '@/types'

import { ClassComponentManager } from './class-component-manager'
import { FunctionComponentManager } from './function-component-manager'
import { HostComponentManager } from './host-component-manager'
import { TextNodeComponentManager } from './text-node-component-manager'
import type { ComponentManager, ComponentManagerConstructorOptions } from './types'

export function createComponentManager<HostNode, HostTextNode>(
  reactNode: ReactNode,
  hostConfig: HostConfig<HostNode, HostTextNode>,
): ComponentManager<HostNode, HostTextNode> | null {
  const componentManagerConstructorOptions: ComponentManagerConstructorOptions<HostNode, HostTextNode> = {
    hostConfig,
    createComponentManager,
  }

  if (isReactTextNode(reactNode)) {
    return createComponentManageWithReactTextNode(reactNode, componentManagerConstructorOptions)
  } else if (isValidReactElement(reactNode)) {
    return createComponentManageWithReactElement(reactNode, componentManagerConstructorOptions)
  } else {
    return null
  }
}

function createComponentManageWithReactTextNode<HostNode, HostTextNode>(
  reactTextNode: ReactTextNode,
  componentManagerConstructorOptions: ComponentManagerConstructorOptions<HostNode, HostTextNode>,
): ComponentManager<HostNode, HostTextNode> {
  return new TextNodeComponentManager(reactTextNode, componentManagerConstructorOptions)
}

function createComponentManageWithReactElement<HostNode, HostTextNode>(
  reactElement: ReactElement,
  componentManagerConstructorOptions: ComponentManagerConstructorOptions<HostNode, HostTextNode>,
): ComponentManager<HostNode, HostTextNode> {
  const { type } = reactElement

  if (isHostComponent(type)) {
    return new HostComponentManager(reactElement, componentManagerConstructorOptions)
  } else if (isClassComponent(type)) {
    return new ClassComponentManager(reactElement, componentManagerConstructorOptions)
  } else if (isFunctionComponent(type)) {
    return new FunctionComponentManager(reactElement, componentManagerConstructorOptions)
  } else {
    throw new Error(`createComponentManager failed, unsupported ReactElement type: ${type}`)
  }
}
