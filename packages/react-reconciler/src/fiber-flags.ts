/**
 * @description 为 fiber 打上的标记
 */
export enum Flags {
  NoFlags = /*                      */ 0b000000000000000000000000000,

  /** @description 插入元素 */
  Placement = /*                    */ 0b000000000000000000000000010,

  /** @description 更新元素 */
  Update = /*                       */ 0b000000000000000000000000100,

  /** @description 删除元素 */
  ChildDeletion = /*                */ 0b000000000000000000000010000,
}

/**
 * @description commit 阶段的 beforeMutation 子阶段需要处理的 fiber flags
 */
export const MutationMask = Flags.Placement | Flags.Update | Flags.ChildDeletion
