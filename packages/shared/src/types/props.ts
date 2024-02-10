import { ReactNode } from './react-node'

export type ReactElementProps = Record<string, any> | null

/** 具有特殊用途的保留 props */
export interface ReservedProps {
  children?: ReactNode | ReactNode[]
}
