import { FiberNode } from './fiber'
import { Flags } from './fiber-flags'
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from './host-config'
import { WorkTag } from './work-tags'

const { HostRoot, HostComponent, HostText } = WorkTag
const { NoFlags } = Flags

/**
 * @description workLoop 的递归中的 `归` 阶段
 *              - mount 时进行离屏渲染
 *              - 为每个 fiber 记录 subtreeFlags
 */
function completeWork(workInProgress: FiberNode) {
  const newProps = workInProgress.pendingProps
  const current = workInProgress.alternate

  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress)
      break

    case HostComponent:
      if (current !== null && workInProgress.stateNode) {
        // update
      } else {
        // mount

        // instance 是抽象出来的平台无关的节点实例 -- 比如 DOM 中创建 HTMLDivElement
        const instance = createInstance(workInProgress.type, newProps)
        appendAllChildren(instance, workInProgress)

        // fiber 的 stateNode 指向 DOM
        workInProgress.stateNode = instance
      }

      bubbleProperties(workInProgress)
      break

    case HostText:
      if (current !== null && workInProgress.stateNode) {
        // update
      } else {
        // mount

        // textInstance 是抽象出来的平台无关的文本节点实例 -- 比如 DOM 中创建文本节点 Text
        const textInstance = createTextInstance(newProps.content)

        // HostText 不存在 child，所以不需要调用 appendAllChildren
        // appendAllChildren(textInstance, workInProgress)

        // fiber 的 stateNode 指向 DOM
        workInProgress.stateNode = textInstance
      }

      bubbleProperties(workInProgress)
      break

    default:
      if (__DEV__) {
        console.warn(
          'completeWork: 尚未实现的 completeWork 情况',
          workInProgress,
        )
      }
      break
  }
}

/**
 * @description 将 workInProgress 的 fiber 对应的真实 DOM 添加到 parent 中
 * @param parent HTML 容器元素
 * @param workInProgress 待离屏渲染的 fiber
 */
function appendAllChildren(
  parent: HTMLElement,
  workInProgress: FiberNode,
): void {
  let node = workInProgress.child

  while (node !== null) {
    // node 是 DOM 对应的 fiber
    if (node.tag === HostComponent || node.tag === HostText) {
      // 往 parent 中插入 DOM 元素
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      // node 不是 DOM 对应的 fiber，往 child 遍历寻找 DOM 对应的 fiber
      node.child.return = node
      node = node.child
      continue
    }

    // base case 1: 遍历到 parent 对应的 fiber
    if (node === workInProgress) return

    // 如果没有兄弟 fiber，则向父 fiber 遍历寻找 DOM 对应的 fiber
    while (node.sibling === null) {
      // base case 2: 回到 hostRootFiber 或 回到 parent 对应的 fiber
      if (node.return === null || node.return === workInProgress) return
      node = node?.return
    }

    // 遍历兄弟 fiber 寻找 DOM 对应的 fiber
    node.sibling.return = node.return
    node = node.sibling
  }
}

/**
 * @description flags 冒泡 -- 收集 workInProgress 子 fiber tree 的 flags
 * @param workInProgress 待操作 fiber
 */
function bubbleProperties(workInProgress: FiberNode) {
  let subtreeFlags = NoFlags
  let child = workInProgress.child

  while (child !== null) {
    // 收集 child 的子树 flags
    subtreeFlags |= child.subtreeFlags

    // 收集 child 自身的 flags
    subtreeFlags |= child.flags

    // 建立 child 和 workInProgress 的联系
    child.return = workInProgress

    // 收集 sibling 的 subtreeFlags
    child = child.sibling
  }

  // 将收集结果存入 workInProgress 中
  workInProgress.subtreeFlags |= subtreeFlags
}

export { completeWork }
