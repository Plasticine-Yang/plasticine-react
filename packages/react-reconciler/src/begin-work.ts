import type { ReactElement } from '@plasticine-react/shared'

import { processUpdateQueue, UpdateQueue } from './update-queue'
import { FiberNode } from './fiber'
import { WorkTag } from './work-tags'
import { mountChildFibers, reconcileChildFibers } from './child-fibers'

const { HostRoot, HostComponent, HostText } = WorkTag

/**
 * @description 开始消费工作单元 消费完后应当返回 child 作为下一个工作单元
 */
function beginWork(workInProgress: FiberNode): FiberNode | null {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(workInProgress)

    case HostComponent:
      return updateHostComponent(workInProgress)

    case HostText:
      return null

    default:
      if (__DEV__) {
        console.warn('beginWork: 尚未实现的 beginWork 情况', workInProgress)
      }
      return null
  }
}

export { beginWork }

/**
 * @description 处理 HostRoot 的 FiberNode
 * @param workInProgress wip fiber tree 中待调和的 hostRootFiber
 */
function updateHostRoot(workInProgress: FiberNode): FiberNode | null {
  // 获取 workInProgress 的 baseState 和待消费的 update
  const baseState = workInProgress.memoizedState as ReactElement
  const updateQueue = workInProgress.updateQueue as UpdateQueue<ReactElement>
  const pending = updateQueue.shared.pending // pending 是 Update<Element> 也就是待消费的 update

  // 消费 update -- 得到的 memoizedState 就是 updateContainer 时为 `<App />` 创建的 Update 对象中的 action，也就是 `<App />` 本身
  // 也就是说 mount 时，这里得到的 memoizedState 就是 `<App />` 对应的 ReactElement
  const { memoizedState } = processUpdateQueue(baseState, pending)

  // update 消费完毕后将其更新到 workInProgress 中 -- 此时 hostRootFiber.memoizedState === <App />
  workInProgress.memoizedState = memoizedState

  // update 消费完后需要将其清空
  updateQueue.shared.pending = null

  // 接下来需要获取到 `子 current FiberNode` 和 `子 ReactElement` 进行对比，并得到新的 `子 FiberNode`
  // 这里其实就是一个 diff 算法的过程了
  // `子 current FiberNode` 是旧 FiberNode
  // `子 ReactElement`  是新 ReactElement
  // 目的是生成新的子 FiberNode，这个过程交给 `reconcileChildren` 函数去处理
  const nextChildren: ReactElement = workInProgress.memoizedState // 子 ReactElement

  // 子 current FiberNode 可以通过 workInProgress.alternate.children 获取
  // 也就是 FiberRootNode.current.children
  reconcileChildren(workInProgress, nextChildren)

  // reconcileChildren 执行完后会将新的子 FiberNode 挂到 workInProgress.child 上，将其返回即可作为下一个工作单元
  return workInProgress.child
}

/**
 * @description 处理 HostComponent 的 FiberNode
 * @param workInProgress wip fiber tree 中待调和的 fiber
 */
function updateHostComponent(workInProgress: FiberNode): FiberNode | null {
  const nextProps = workInProgress.pendingProps
  const nextChildren = nextProps.children

  reconcileChildren(workInProgress, nextChildren)

  return workInProgress.child
}

/**
 * @description 调和 children -- 根据 wip 旧的子 fiber 和 新的 ReactElement 生成新的子 fiber，并挂载到 wip.child 上
 * @param workInProgress wip fiber tree 上待调和的 fiber
 * @param children 待调和的新 ReactElement
 */
function reconcileChildren(workInProgress: FiberNode, children?: ReactElement) {
  // 获取 wip fiber 在 current fiber tree 上对应的 fiber -- 也就是旧 fiber
  const current = workInProgress.alternate

  // mount 时不存在旧 fiber，即 current === null，利用这点来区分 mount 和 update

  if (current !== null) {
    // update
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current,
      children,
    )
  } else {
    // mount
    workInProgress.child = mountChildFibers(workInProgress, null, children)
  }
}
