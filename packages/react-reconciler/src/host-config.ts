/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @description 抽象出交由具体平台实现的类型
 */

import type { Props } from '@plasticine-react/shared'

import { FiberNode } from './fiber'

/** @description createRoot(container) 中 container 的类型 */
type Container = unknown

interface HostConfig<Container = any, Instance = any, TextInstance = any> {
  /** @description 创建具体平台实例 -- 比如创建 DOM 元素 */
  createInstance: (type: FiberNode['type'], newProps: Props) => Instance

  /** @description 创建具体平台的文本实例 -- 比如创建 DOM 中的 Text */
  createTextInstance: (content: string) => TextInstance

  /** @description 往 parent 中插入元素 */
  appendInitialChild: (
    parent: Container,
    child: Instance | TextInstance,
  ) => void

  /** @description 往 parent 中插入 child */
  appendChildToContainer: (
    child: Instance | TextInstance,
    container: Container,
  ) => void
}

let createInstance: HostConfig['createInstance'] = (type, newProps) => {
  throw new Error('Function not implemented.')
}

let createTextInstance: HostConfig['createTextInstance'] = (content) => {
  throw new Error('Function not implemented.')
}

let appendInitialChild: HostConfig['appendInitialChild'] = (parent, child) => {
  throw new Error('Function not implemented.')
}

let appendChildToContainer: HostConfig['appendChildToContainer'] = (
  child,
  container,
) => {
  throw new Error('Function not implemented.')
}

/**
 * @description 具体平台实现时通过调用该函数来传入 hostConfig
 */
function initHostConfig<Instance>(hostConfig: HostConfig<Instance>) {
  createInstance = hostConfig.createInstance
  createTextInstance = hostConfig.createTextInstance
  appendInitialChild = hostConfig.appendInitialChild
  appendChildToContainer = hostConfig.appendChildToContainer
}

export type { Container, HostConfig }

export {
  createInstance,
  createTextInstance,
  appendInitialChild,
  appendChildToContainer,
  initHostConfig,
}
