export type ElementType = any
export type Key = string | null
export type Ref = any
export type Props = {
  [key: string]: any
  children?: ReactElement
}

export interface ReactElement {
  $$typeof: symbol
  type: ElementType
  key: Key
  ref: Ref
  props: Props
  __mark: 'Plasticine-Yang'
}

/**
 * @description reconciler 更新机制中的 Update 会使用到
 */
export type Action<State> = State | ((state: State) => State)
