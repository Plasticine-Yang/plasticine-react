import { classComponentSymbol } from '@/symbols'

import type { ReactElementProps, ReactNode } from '@/types'

export class ClassComponent<Props extends ReactElementProps = ReactElementProps> {
  public props: Props

  /** 标识类组件 */
  public static [classComponentSymbol] = true as const

  constructor(props: Props) {
    this.props = props
  }

  public componentWillMount(): void {}

  public componentWillUnmount(): void {}

  public componentWillUpdate(): void {}

  public render(): ReactNode {
    throw new Error('unimplemented!')
  }
}
