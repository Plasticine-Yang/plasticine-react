import { ReactElement, REACT_ELEMENT_TYPE } from '@plasticine-react/shared'

import { createFiberFromElement, FiberNode } from './fiber'
import { Flags } from './fiber-flags'
import { WorkTag } from './work-tags'

const { HostText } = WorkTag
const { Placement } = Flags

/**
 * @description 用于为 mount 和 update 调和 children 时做区分
 *              mount 时为了离屏渲染进行性能优化，只为 hostRootFiber 追踪副作用，也就是给其打上 Placement
 *              update 时则正常追踪副作用
 * @param shouldTrackEffects 是否需要追踪 fiber 的副作用
 */
function ChildReconciler(shouldTrackEffects: boolean) {
  /**
   *
   * @param workInProgress wip fiber tree 上待调和的 fiber
   * @param currentFiber wip fiber 对应的 current fiber tree 中的 fiber
   * @param newChild 待调和的新 ReactElement
   */
  function reconcileChildFibers(
    workInProgress: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElement,
  ) {
    // ReactElement
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          // 为 newChild 生成 fiber 并打上 Placement 标记
          return placeSingleChild(
            reconcileSingleElement(workInProgress, currentFiber, newChild),
          )

        default:
          if (__DEV__) {
            console.warn(
              'reconcileChildFibers: 尚未支持的 ReactElement 类型',
              newChild,
            )
          }
          break
      }
    }

    // TODO 多节点 -- ul > li*3

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // 为 newChild 生成 fiber 并打上 Placement 标记
      return placeSingleChild(
        reconcileSingleTextNode(workInProgress, currentFiber, newChild),
      )
    }

    // 尚未支持的 child
    if (__DEV__) {
      console.warn('reconcileChildFibers: 尚未支持的 child', newChild)
    }

    return null
  }

  /**
   * @description 调和 current fiber 和 ReactElement
   * @param returnFiber 为 element 创建出的 fiber 的 return 指向
   * @param currentFiber 为 element 创建出的 fiber 的 alternate 指向
   * @param element 待创建 fiber 的 ReactElement
   * @returns 为 elemen 创建的 fiber
   */
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    // 为 element 创建 fiber
    const fiber = createFiberFromElement(element)

    fiber.return = returnFiber
    fiber.alternate = currentFiber

    return fiber
  }

  /**
   * @description 调和 current fiber 和 文本元素
   * @param returnFiber 为 content 创建出的 HostText 类型的 fiber 的 return 指向
   * @param currentFiber 为 content 创建出的 HostText 类型的 fiber 的 alternate 指向
   * @param content 待创建 fiber 的 文本元素内容
   * @returns 为 content 创建的 fiber
   */
  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number,
  ) {
    // 为 content 创建 HostText 类型的 fiber
    const fiber = new FiberNode(HostText, { content }, null)

    fiber.return = returnFiber
    fiber.alternate = currentFiber

    return fiber
  }

  // ====================== 打上标记相关的函数 ======================

  /**
   * @description 为 fiber 打上 `Placement` 标记
   * @param fiber 待打上 `Placement` 标记的 fiber
   * @returns 已打上 `Placement`  标记的 fiber (只在需要的时候打上标记)
   */
  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      // 只在应该追踪副作用 且 fiber 是首次渲染时才需要打上 Placement 标记
      fiber.flags |= Placement
    }

    // 其余情况不需要打上 Placement 标记
    return fiber
  }

  return reconcileChildFibers
}

/**
 * @description mount 阶段调和 children
 */
const mountChildFibers = ChildReconciler(false)

/**
 * @description update 阶段调和 children
 */
const reconcileChildFibers = ChildReconciler(true)

export { mountChildFibers, reconcileChildFibers }
