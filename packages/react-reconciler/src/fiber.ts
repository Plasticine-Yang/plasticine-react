import type { Key, Props, ReactElement, Ref } from '@plasticine-react/shared'
import type { Container } from './host-config'
import type { UpdateQueue } from './update-queue'

import { WorkTag } from './work-tags'
import { Flags } from './fiber-flags'

const { HostRoot, HostComponent, FunctionComponent } = WorkTag

const { NoFlags } = Flags

class FiberNode {
  public tag: WorkTag
  public key: Key
  public stateNode: any
  public type: any

  public return: FiberNode | null
  public child: FiberNode | null
  public sibling: FiberNode | null
  public index: number

  public ref: Ref

  public pendingProps: Props
  public memoizedProps: Props | null
  public memoizedState: any
  public updateQueue: UpdateQueue<any> | null

  public flags: Flags

  public alternate: FiberNode | null

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag
    this.key = key

    // 对应的元素节点，如：
    // HostComponent --> <div>hello</div> 指向真实 DOM 元素
    this.stateNode = null

    // 对应的元素类型，如：
    // FunctionComponent --> 函数组件的函数本身
    this.type = null

    // 形成树形结构
    this.return = null // 指向父 fiber
    this.child = null // 指向第一个子 child
    this.sibling = null // 指向兄弟 fiber
    this.index = 0

    this.ref = null

    // 工作单元相关属性
    this.pendingProps = pendingProps // 工作单元刚开始工作时的 props
    this.memoizedProps = null // 工作单元工作结束时的 props
    this.memoizedState = null
    this.updateQueue = null

    // Effects
    this.flags = NoFlags

    this.alternate = null
  }
}

/**
 * @description createRoot() 的返回值类型
 */
class FiberRootNode {
  public container: Container
  public current: FiberNode

  /** @description 更新流程结束后的 HostRootFiber */
  public finishedWork: FiberNode | null

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container

    // 初始化 FiberRootNode 和 hostRootFiber 之间的引用关系
    this.current = hostRootFiber
    hostRootFiber.stateNode = this

    this.finishedWork = null
  }
}

/**
 * @description 用于 prepareFreshStack 中根据 FiberRootNode 创建 workInProgress，也就是 hostRootFiber
 *              由于 react 双缓冲的特性，所以应当返回 current.alternate
 */
function createWorkInProgress(
  current: FiberNode,
  pendingProps: Props,
): FiberNode {
  let wip = current.alternate

  if (wip === null) {
    // mount

    // 首次挂载时不存在 current.alternate，因此初始化创建一个
    wip = new FiberNode(HostRoot, pendingProps, current.key)

    // hostRootFiber 的 stateNode 指向 FiberRootNode
    wip.stateNode = current.stateNode

    // 建立双缓冲的两棵 fiber tree 之间的联系
    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps

    // 清除副作用相关属性
    wip.flags = NoFlags
  }

  // 发挥双缓冲的特性，尽可能复用 current 上的属性
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip
}

/**
 * @description 根据传入的 ReactElement 创建其对应的 FiberNode
 * @param element ReactElement
 * @returns FiberNode
 */
function createFiberFromElement(element: ReactElement) {
  const { type, props, key } = element

  let fiberTag: WorkTag = FunctionComponent

  if (typeof type === 'string') {
    // <div>hello</div> --> HostComponent
    fiberTag = HostComponent
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn(
      'createFiberFromElement: 尚未实现的 ReactElement type 类型',
      element,
    )
  }

  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}

export {
  FiberNode,
  FiberRootNode,
  createWorkInProgress,
  createFiberFromElement,
}
