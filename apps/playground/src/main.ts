import { mount, unmount, HostConfig, ReactElement, ClassComponent } from '@plasticine-react/stack-reconciler'

const hostConfig: HostConfig<HTMLElement, Text> = {
  create(type) {
    return document.createElement(type)
  },

  createTextNode(textContent) {
    const textNode = document.createTextNode(textContent)
    return textNode
  },

  setAttribute(hostNode, key, value) {
    hostNode.setAttribute(key as string, value as string)
  },

  appendChild(hostNode, childNode) {
    hostNode.appendChild(childNode)
  },

  getFirstChild(hostNode) {
    return hostNode.firstChild as HTMLElement
  },

  unmount(hostNode) {
    hostNode.innerHTML = ''
  },

  unmountTextNode(hostTextNode) {
    hostTextNode.textContent = ''
  },
}

class Foo extends ClassComponent {
  componentWillMount(): void {
    console.log('componentWillMount')
  }

  componentWillUnmount(): void {
    console.log('componentWillUnmount')
  }

  render(): ReactElement {
    return {
      type: 'div',
      props: {
        name: 'foo',
        children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child', children: 'foo-child' } }],
      },
    }
  }
}

function App() {
  return {
    type: 'div',
    props: {
      name: 'app',
      children: [
        { type: 'p', props: { id: 'child1', className: 'child1', children: 'hello' } },
        { type: 'span', props: { id: 'child2', className: 'child2', children: 'world' } },
        { type: Foo, props: {} },
      ],
    },
  } as ReactElement
}

const rootElement: ReactElement = {
  type: App,
  props: {},
}

const rootContainer = document.querySelector<HTMLDivElement>('#root')!
const { mountedHostNode } = mount(rootElement, rootContainer, hostConfig)

console.log(mountedHostNode)

setTimeout(() => {
  unmount(rootContainer, hostConfig)
}, 5000)
