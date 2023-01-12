import { beginWork } from './begin-work'
import { completeWork } from './complete-work'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { WorkTag } from './work-tags'

const { HostRoot } = WorkTag

let workInProgress: FiberNode | null = null

/**
 * @description 渲染根元素 -- 工作流入口
 * @param root 根元素的 fiber
 */
function renderRoot(root: FiberRootNode) {
  // 初始化
  prepareFreshStack(root)

  // 开启工作循环
  workLoop()
}

/**
 * @description 初始化工作
 */
function prepareFreshStack(root: FiberRootNode) {
  // workInProgress 此时指向 wip fiber tree 的 hostRootFiber
  // 其 alternate 属性指向 current fiber tree 的 hostRootFiber
  workInProgress = createWorkInProgress(root.current, {})
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

/**
 * @description 消费工作单元
 * @param unitOfWork 工作单元 -- fiber
 */
function performUnitOfWork(unitOfWork: FiberNode) {
  // 开始消费工作单元 -- beginWork 结束后应当返回 unitOfWork.child 作为下一个工作单元
  // 遵循 DFS 遍历的顺序 -- next 一般指向当前工作单元的 child 如果没有则尝试遍历 sibling
  const next = beginWork(unitOfWork) // 开始进入 `递` 阶段

  // 消费完毕后要更新工作单元的 memoizedProps 属性 -- memoizedProps 的意义就是在工作单元执行结束后的 props
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // 当前工作单元任务已完成 交给 completeUnitOfWork 去处理后续流程
    completeUnitOfWork(unitOfWork)
  } else {
    // 更新 workInProgress，让工作循环消费下一个工作单元
    workInProgress = next
  }
}

/**
 * @description 工作单元消费完毕的后续工作 -- 寻找下一个工作单元
 * @param unitOfWork 工作单元 -- fiber
 */
function completeUnitOfWork(unitOfWork: FiberNode) {
  let completedWork: FiberNode | null = unitOfWork

  do {
    // 当前工作单元已经结束 进入 `归` 阶段
    completeWork(completedWork)

    // 看看是否能继续沿着 sibling 去遍历
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return
    }

    // 没有 sibling 就只能返回到上层
    completedWork = completedWork.return
    workInProgress = completedWork
  } while (completedWork !== null)
}

/**
 * @description 对传入的 fiber 调度其 updateQueue
 */
function scheduleUpdateOnFiber(fiber: FiberNode) {
  const root = markUpdateFromFiberToRoot(fiber)
  root !== null && renderRoot(root)
}

/**
 * @description 从传入的 fiber 出发，寻找其所在 fiber tree 的 FiberRootNode
 * @param fiber FiberNode
 */
function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode | null {
  let node = fiber
  let parent = fiber.return

  while (parent !== null) {
    node = parent
    parent = parent.return
  }

  // node 此时是 hostRootFiber
  if (node.tag === HostRoot) {
    return node.stateNode as FiberRootNode
  }

  return null
}

export { scheduleUpdateOnFiber }
