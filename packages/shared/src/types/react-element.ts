import type { ClassComponent } from '@/class-component'

import type { FunctionComponent } from './function-component'
import type { ReactElementProps } from './props'

export type ReactElementType<Props extends ReactElementProps = ReactElementProps> =
  | string
  | FunctionComponent<Props>
  | typeof ClassComponent<Props>

export interface ReactElement<Props extends ReactElementProps = ReactElementProps> {
  type: ReactElementType<Props>
  props: Props
}
