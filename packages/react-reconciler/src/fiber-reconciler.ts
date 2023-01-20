import type { ReactElement } from '@plasticine-react/shared'
import type { Container } from './host-config'
import type { UpdateQueue } from './update-queue'

import { FiberNode, FiberRootNode } from './fiber'
import { createUpdate, createUpdateQueue, enqueueUpdate } from './update-queue'
import { WorkTag } from './work-tags'
import { scheduleUpdateOnFiber } from './work-loop'

const { HostRoot } = WorkTag

/**
 * @description 执行 createRoot 的时候会调用该函数初始化 FiberRootNode 和 hostRootFiber，并将 hostRootFiber 和更新机制关联起来
 */
function createContainer<T = Container>(container: T) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)

  hostRootFiber.updateQueue = createUpdateQueue()

  return root
}

/**
 * @description 执行 FiberRootNode 的 render 方法的时候会执行该函数，为待更新的 element 创建 Update 对象，并将其加入到 hostRootFiber.updateQueue 中
 * @param element ReactElement
 * @param root FiberRootNode
 */
function updateContainer(element: ReactElement, root: FiberRootNode) {
  const hostRootFiber = root.current

  // 为 element 实例化 Update 对象
  const update = createUpdate<ReactElement | null>(element)

  // 将 update 对象加入到 hostRootFiber 的 updateQueue 中，这样在更新流程中就能感知到需要 mound 的 element
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElement | null>,
    update,
  )

  // 将更新流程交给调度函数处理
  scheduleUpdateOnFiber(hostRootFiber)

  return element
}

export { createContainer, updateContainer }
