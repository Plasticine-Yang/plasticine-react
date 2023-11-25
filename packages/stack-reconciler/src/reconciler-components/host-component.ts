import type { BaseProps, ReactElement } from '@plasticine-react/shared'

import type { ReconcilerComponent } from '@/types'

export class HostComponent<Props extends BaseProps = BaseProps> implements ReconcilerComponent<Props> {
  public getHostNode(): unknown {}

  public mount(): ReactElement<Props> {}

  public unmount(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public receive<NextElementProps extends BaseProps = BaseProps>(nextElement: ReactElement<NextElementProps>): void {}
}
