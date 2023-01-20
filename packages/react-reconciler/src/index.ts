import { createContainer, updateContainer } from './fiber-reconciler'
import { HostConfig, initHostConfig } from './host-config'

class ReactReconciler<Container, Instance, TextInstance> {
  constructor(hostConfig: HostConfig<Container, Instance, TextInstance>) {
    initHostConfig(hostConfig)
  }

  createContainer = createContainer<Container>
  updateContainer = updateContainer
}

export type { HostConfig } from './host-config'

export default ReactReconciler
