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

function Foo() {
  return {
    type: 'div',
    props: {
      name: 'foo',
      children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child' } }],
    },
  } as ReactElement
}

function App() {
  return {
    type: 'div',
    props: {
      name: 'app',
      children: [
        { type: 'p', props: { id: 'child1', className: 'child1' } },
        { type: 'span', props: { id: 'child2', className: 'child2' } },
        { type: Foo, props: {} },
      ],
    },
  } as ReactElement
}

const rootElement: ReactElement = {
  type: App,
  props: {},
}

const mountedElement = mount(rootElement, hostConfig)

console.log(mountedElement)

const rootContainer = document.querySelector<HTMLDivElement>('#root')!

rootContainer.appendChild(mountedElement)
