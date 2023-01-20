import { HostConfig } from '@plasticine-react/react-reconciler'

type Container = Element
type Instance = Element
type TextInstance = Text

const hostConfig: HostConfig<Container, Instance, TextInstance> = {
  createInstance(type) {
    const element = document.createElement(type)
    return element
  },

  createTextInstance(content) {
    return document.createTextNode(content)
  },

  appendInitialChild(parent, child) {
    parent.appendChild(child)
  },

  appendChildToContainer(child, container) {
    container.appendChild(child)
  },
}

export type { Container, Instance, TextInstance }

export { hostConfig }
