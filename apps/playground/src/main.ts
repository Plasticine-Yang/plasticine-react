import { mount, HostConfig, ReactElement } from '@plasticine-react/stack-reconciler'

const hostConfig: HostConfig<HTMLElement> = {
  createHostNode(type) {
    return document.createElement(type)
  },
  setHostNodeAttribute(hostNode, key, value) {
    hostNode.setAttribute(key as string, value as string)
  },
  appendChild(hostNode, childNode) {
    hostNode.appendChild(childNode)
  },
}

function App() {
  return { type: 'div', props: { name: 'foo' } } as ReactElement
}

const rootElement: ReactElement = {
  type: App,
  props: {},
}

const mountedElement = mount(rootElement, hostConfig)

console.log(mountedElement)
