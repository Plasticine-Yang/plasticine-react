import { FiberNode } from './fiber'

/**
 * @description 开始消费工作单元 消费完后应当返回 child 作为下一个工作单元
 */
function beginWork(workInProgress: FiberNode): FiberNode | null {
  return workInProgress.child
}

export { beginWork }
