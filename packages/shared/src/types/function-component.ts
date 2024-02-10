import type { ReactElementProps } from './props'
import type { ReactNode } from './react-node'

export type FunctionComponent<Props extends ReactElementProps = ReactElementProps> = (props: Props) => ReactNode
