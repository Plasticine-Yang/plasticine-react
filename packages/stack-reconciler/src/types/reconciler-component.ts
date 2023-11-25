import type { BaseProps, ReactElement } from '@plasticine-react/shared'

export interface ReconcilerComponent<Props extends BaseProps = BaseProps> {
  mount(): ReactElement<Props>

  unmount(): void

  getHostNode(): unknown

  receive<NextElementProps extends BaseProps = BaseProps>(nextElement: ReactElement<NextElementProps>): void
}
