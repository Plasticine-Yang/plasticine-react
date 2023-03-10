import { beginWork } from './begin-work'
import { commitMutationEffects } from './commit-work'
import { completeWork } from './complete-work'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { Flags, MutationMask } from './fiber-flags'
import { WorkTag } from './work-tags'

const { HostRoot } = WorkTag
const { NoFlags } = Flags

let workInProgress: FiberNode | null = null

/**
 * @description 渲染根元素 -- 工作流入口
 * @param root 根元素的 fiber
 */
function renderRoot(root: FiberRootNode) {
  // 初始化
  prepareFreshStack(root)

  try {
    // 开启工作循环
    workLoop()
  } catch (error) {
    if (__DEV__) {
      console.error('workLoop 发生错误:', error)
    }
  }

  // 工作循环结束后说明 reconcile 完毕 -- 更新 root.finishedWork 指向完整的以 hostRootFiber 为根节点的 fiber tree
  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // 接下来交给 commit 阶段去根据 reconcile 时给每个 fiber 打上的 flags 去进行宿主环境中的渲染
  commitRoot(root)
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

/**
 * @description commit 阶段入口
 * @param root 带有 render 阶段产物 finishedWork 的 FiberRootNode
 */
function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork

  if (finishedWork === null) return

  if (__DEV__) {
    console.log('commit 阶段开始 -- finishedWork:', finishedWork)
  }

  // finishedWork 变量已经保存了 root.finishedWork 的引用，可以重置 root.finishedWork
  root.finishedWork = null

  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags
  const rootHasEffects = (finishedWork.flags & MutationMask) !== NoFlags

  if (subtreeHasEffects || rootHasEffects) {
    // beforeMutation
    // mutation
    commitMutationEffects(finishedWork)

    // fiber tree 切换 -- 使当前的 finishedWork 成为 current fiber tree，作为下一次 render 阶段的旧 fiber tree
    root.current = finishedWork

    // layout
  } else {
    // 即便不进行任何操作，也要切换 fiber tree
    root.current = finishedWork
  }
}

export { scheduleUpdateOnFiber }
