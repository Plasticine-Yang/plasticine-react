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

export function setupUnmountDemo() {
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
