import { classComponentSymbol } from '@/symbols'
import type { BaseProps } from './props'

export abstract class ClassComponent<Props extends BaseProps = BaseProps> {
  public props: Props

  /** 标识类组件 */
  public static [classComponentSymbol]: true

  constructor(props: Props) {
    this.props = props
  }

  public abstract componentWillMount(): void

  public abstract componentWillUnmount(): void

  public abstract componentWillUpdate(): void
}
