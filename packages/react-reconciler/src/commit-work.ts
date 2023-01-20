import { FiberNode, FiberRootNode } from './fiber'
import { Flags, MutationMask } from './fiber-flags'
import { appendChildToContainer, Container } from './host-config'
import { WorkTag } from './work-tags'

const { HostComponent, HostText, HostRoot } = WorkTag
const { NoFlags, Placement } = Flags

let nextEffect: FiberNode | null = null

/**
 * @description commit 阶段 mutation 子阶段入口
 * @param finishedWork 带有 MutationMask 的 fiber tree root
 */
function commitMutationEffects(finishedWork: FiberNode) {
  nextEffect = finishedWork

  while (nextEffect !== null) {
    // 向下遍历找到不是 mutation 阶段需要的 subtreeFlags 或者遍历到叶子节点
    const child: FiberNode | null = nextEffect.child

    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      // 还没到该“归”的时候，继续向下“递”
      nextEffect = child
    } else {
      // 到“归”的时候了
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect) // 执行消费 subtreeFlags 的逻辑

        const sibling: FiberNode | null = nextEffect.sibling

        if (sibling !== null) {
          // 存在兄弟节点 那么就沿着兄弟节点继续往下“递”
          nextEffect = sibling
          break up
        }

        // 没有兄弟节点 那么只能继续沿着 return 往上“归”
        nextEffect = nextEffect.return
      }
    }
  }
}

/**
 * @description 消费 MutationMask 相关的 subtreeFlags
 * @param finishedWork 带有 MutationMask 需要的 subtreeFlags 的 fiber
 */
function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
  const flags = finishedWork.flags

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork)

    // 消费完 Placement 标记后将该标记移除
    finishedWork.flags &= ~Placement
  }
}

/**
 * @description 消费带有 Placement 标记的 fiber
 * @param finishedWork 带有 Placement 标记的 fiber
 */
function commitPlacement(finishedWork: FiberNode) {
  if (__DEV__) {
    console.log('commit 阶段消费 Placement 标记 --', finishedWork)
  }

  // parent DOM
  const hostParent = getHostParent(finishedWork)

  // 将 finishedWork 中 HostComponent 或 HostText 类型的 fiber 对应的 stateNode
  // 添加到宿主环境的容器元素 hostParent 中
  appendPlacementNodeIntoContainer(finishedWork, hostParent)
}

/**
 * @description 获取 fiber 的 stateNode 在宿主环境中的 Container
 * @param fiber FiberNode
 * @returns fiber 的 stateNode 在宿主环境中的 Container
 */
function getHostParent(fiber: FiberNode): Container {
  let parent = fiber.return

  while (parent !== null) {
    const parentTag = parent.tag

    switch (parentTag) {
      case HostComponent:
        return parent.stateNode

      case HostRoot:
        return (parent.stateNode as FiberRootNode).container as Container

      default:
        parent = parent.return
        break
    }
  }

  if (__DEV__) {
    console.warn('getHostParent 未找到 hostParent, 操作的 fiber:', fiber)
  }
}

/**
 * @description
 * 将 finishedWork 中 HostComponent 或 HostText 类型的 fiber 对应的 stateNode
 * 添加到宿主环境的容器元素 hostParent 中
 *
 * 因为传进来的 finishedWork 其类型不一定是 HostComponent 或 HostText
 * 所以存在一个向下遍历直到找到符合条件的 fiber 的过程
 * @param finishedWork 待添加到 hostParent 中的 fiber
 * @param hostParent 宿主环境的容器元素
 */
function appendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container,
) {
  const tag = finishedWork.tag
  if (tag === HostComponent || tag === HostText) {
    // base case: 找到了 HostComponent 或 HostText 类型的 fiber
    appendChildToContainer(finishedWork.stateNode, hostParent)
    return
  }

  // 向下遍历直到找到 HostComponent 或 HostText 类型的 fiber
  const child = finishedWork.child

  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent)

    // 将同层的兄弟节点也插入到 hostParent 中
    let sibling = child.sibling
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}

export { commitMutationEffects }
