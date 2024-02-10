import { ReactElementProps } from './props'
import type { ReactElement } from './react-element'

export type ReactTextNode = string | number | boolean

export type ReactNode<Props extends ReactElementProps = ReactElementProps> =
  | ReactElement<Props>
  | ReactTextNode
  | null
  | undefined
