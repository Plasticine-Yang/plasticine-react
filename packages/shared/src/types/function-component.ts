import { ReactElement } from './react-element'

export type FunctionComponent<Props extends Record<string, any> = Record<string, any>> = (props: Props) => ReactElement
