import type { Key, Props, Ref } from '@plasticine-react/shared'
import type { WorkTag } from './work-tags'

import { Flags } from './fiber-flags'

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

    // Effects
    this.flags = NoFlags

    this.alternate = null
  }
}

export { FiberNode }
