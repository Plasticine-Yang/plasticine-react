import type { ClassComponent } from './class-component'
import type { FunctionComponent } from './function-component'
import type { BaseProps } from './props'

export type ReactElementType<Props extends BaseProps = BaseProps> =
  | string
  | FunctionComponent<Props>
  | ClassComponent<Props>

export interface ReactElement<Props extends BaseProps = BaseProps> {
  type: ReactElementType<Props>
  props: Props
}
