function isClass(type) {
  // React.Component subclass has this flag
  return Boolean(type.prototype?.isReactComponent)
}

class CompositeComponent {
  constructor(element) {
    this.currentElement = element
    this.renderedComponent = null
    this.publicInstance = null
  }

  getPublicInstance() {
    return this.publicInstance
  }

  mount() {
    const { type, props } = this.currentElement

    let publicInstance
    let renderedElement
    if (isClass(type)) {
      publicInstance = new type(props)
      publicInstance.componentWillMount?.()
      renderedElement = publicInstance.render()
    } else if (typeof type === 'function') {
      publicInstance = null
      renderedElement = type(props)
    }

    this.publicInstance = publicInstance

    // Instantiate the internal instance according to the element.
    // It would be a HostComponent for `<div />` or `<p />`,
    // and a CompositeComponent for `<App />` or `<Button />`.
    const renderedComponent = instantiateComponent(renderedElement)
    this.renderedComponent = renderedComponent

    // Mount the rendered output.
    return renderedComponent.mount()
  }

  unmount() {
    this.publicInstance?.componentWillUnmount?.()
    this.renderedComponent?.unmount?.()
  }

  getHostNode() {
    return this.renderedComponent.getHostNode()
  }

  receive(nextElement) {
    const publicInstance = this.publicInstance
    const type = nextElement.type

    // prev
    const prevRenderedComponent = this.renderedComponent
    const prevRenderedElement = prevRenderedComponent.currentElement

    // next
    const nextProps = nextElement.props

    let nextRenderedElement

    if (isClass(type)) {
      publicInstance.componentWillUpdate?.()
      publicInstance.props = nextProps
      // re-render ClassComponent
      nextRenderedElement = publicInstance.render()
    } else if (typeof type === 'function') {
      // re-render FunctionComponent
      nextRenderedElement = type(nextProps)
    }

    // If the rendered element type has not changed,
    // reuse the existing component instance and exit.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement)
      return
    }

    // If we reached this point, we need to unmount the previously
    // mounted component, mount the new one, and swap their nodes.

    // Find the old node because it will need to be replaced.
    // 这里增加一个 getHostNode 方法是因为无法确保 prevRenderedComponent 一定是 HostComponent
    // 如果是 HostComponent 则可以直接获取其 node 属性
    // 如果是 CompositeComponent 则需要递归地向下遍历直到找到 HostComponent 实例再获取其 node 属性
    const prevNode = prevRenderedComponent.getHostNode()

    // Unmount the old child and mount a new child.
    prevRenderedComponent.unmount()
    const nextRenderedComponent = instantiateComponent(nextRenderedElement)
    const nextNode = nextRenderedComponent.mount()

    // Replace the reference to the child.
    this.renderedComponent = nextRenderedComponent

    // Replace the old node with the next node.
    // Note: this is renderer-specific code and
    // ideally should live outside of CompositeComponent.
    prevNode.parentNode.replaceChild(nextNode, prevNode)
  }
}

class HostComponent {
  constructor(element) {
    this.currentElement = element
    this.renderedChildren = []
    this.node = null
  }

  mount() {
    const { type, props } = this.currentElement
    let { children = [] } = props

    if (!Array.isArray(children)) {
      children = [children]
    }

    const node = document.createElement(type)
    this.node = node

    for (const propName of Object.keys(props)) {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName])
      }
    }

    // Create and save the contained children.
    // Each of them can be an CompositeComponent and HostComponent,
    // depending on whether the element type is a string or a function.
    const renderedChildren = children.map(instantiateComponent)
    this.renderedChildren = renderedChildren

    // Collect DOM nodes they return on mount.
    const childNodes = renderedChildren.map((child) => child.mount())
    for (const childNode of childNodes) {
      node.appendChild(childNode)
    }

    // Return DOM node as mount result.
    return node
  }

  unmount() {
    for (const childComponent of this.renderedChildren) {
      childComponent.unmount()
    }
  }

  getHostNode() {
    return this.node
  }

  // receive(nextElement) {}
}

function instantiateComponent(element) {
  const { type } = element

  if (typeof type === 'function') {
    return new CompositeComponent(element)
  } else if (typeof type === 'string') {
    return new HostComponent(element)
  }
}

function mount(element, containerNode) {
  // Destroy any existing tree.
  if (containerNode.firstChild) {
    unmount(containerNode)
  }

  // Create top-level internal instance.
  const rootComponent = instantiateComponent(element)

  // Mount the top-level component into the container.
  const node = rootComponent.mount()
  node.__internalInstance = rootComponent

  containerNode.appendChild(node)

  // Return the public instance it provides.
  const publicInstance = rootComponent.getPublicInstance()
  return publicInstance
}

function unmount(containerNode) {
  const node = containerNode.firstChild
  const rootComponent = node.__internalInstance

  rootComponent?.unmount()
  containerNode.innerHTML = ''
}

export function setupUpdateDemo() {
  function Button() {
    return {
      type: 'div',
      props: {},
    }
  }

  function App() {
    return {
      type: Button,
      props: {},
    }
  }

  const appElement = {
    type: App,
    props: {},
  }

  const rootEl = document.querySelector('#root')
  mount(appElement, rootEl)

  setTimeout(() => {
    unmount(rootEl)
  }, 3000)
}
