/**
 * @description 抽象出交由具体平台实现的类型
 */

/** @description createRoot(container) 中 container 的类型 */
type Container = unknown

/**
 * @description 创建具体平台实例 -- 比如创建 DOM 元素
 */
function createInstance(...args: any[]) {
  return {} as any
}

/**
 * @description 创建具体平台的文本实例 -- 比如创建 DOM 中的 Text
 */
function createTextInstance(...args: any[]) {
  return {} as any
}

/**
 * @description 往 parent 中插入元素
 */
function appendInitialChild(...args: any[]) {
  return {} as any
}

/**
 * @description 往 parent 中插入 child
 */
function appendChildToContainer(...args: any[]) {
  return {} as any
}

export type { Container }

export {
  createInstance,
  createTextInstance,
  appendInitialChild,
  appendChildToContainer,
}
