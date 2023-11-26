import type { ReactElement } from '@plasticine-react/shared'

import type { ReconcilerComponent } from '@/types'

export class HostComponent implements ReconcilerComponent {
  public mount(): ReactElement {}
}
