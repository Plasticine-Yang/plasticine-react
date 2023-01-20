import type { ReactElement } from '@plasticine-react/shared'

import ReactReconciler from '@plasticine-react/react-reconciler'

import { Container, hostConfig } from './host-config'

const reconciler = new ReactReconciler(hostConfig)

function createRoot(container: Container) {
  const root = reconciler.createContainer(container)

  return {
    render(element: ReactElement) {
      reconciler.updateContainer(element, root)
    },
  }
}

export { createRoot }
