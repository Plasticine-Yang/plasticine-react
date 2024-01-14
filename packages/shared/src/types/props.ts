import type { ReactElement } from './react-element'

export type NormalProps = Record<string, any>

export interface InternalProps {
  children?: ReactElement | ReactElement[]
}

export type ReactElementProps = NormalProps & InternalProps
