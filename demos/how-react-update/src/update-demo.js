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

  receive(nextElement) {
    const node = this.node
    const prevElement = this.currentElement
    const prevProps = prevElement.props
    const nextProps = nextElement.props

    // Set nextElement as currentElement
    this.currentElement = nextElement

    // Remove old attributes.
    for (const propName of Object.keys(prevProps)) {
      if (propName !== 'children' && !Object.prototype.hasOwnProperty.call(nextProps, propName)) {
        node.removeAttribute(propName)
      }
    }

    // Set next attributes.
    for (const propName of Object.keys(nextProps)) {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName])
      }
    }

    // Get prevChildren and nextChildren - array of ReactElement
    let prevChildren = prevProps.children ?? []
    let nextChildren = nextProps.children ?? []

    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren]
    }

    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren]
    }

    // Get prevRenderedChildren and nextRenderedChildren - array of internal instances
    const prevRenderedChildren = this.renderedChildren
    const nextRenderedChildren = []

    // As we iterate over children, we will add operation to the array.
    const operationQueue = []

    // 新增、更新和替换操作
    for (let i = 0; i < nextChildren.length; i++) {
      const prevChildElement = prevChildren.at(i)
      const nextChildElement = nextChildren.at(i)
      const prevChildComponent = prevRenderedChildren.at(i)

      // 之前没有现在有 - 新增操作
      // 为新的 ReactElement 创建内部实例
      if (!prevChildComponent && nextChildElement) {
        const nextChildComponent = instantiateComponent(nextChildElement)
        const node = nextChildComponent.mount()

        // 记录操作 - 新增 DOM
        operationQueue.push({ type: 'ADD', node })
        nextRenderedChildren.push(nextChildComponent)

        continue
      }

      // 只在 type 相同时才能进行更新，复用已有的 DOM，否则就进行替换
      const canUpdate = prevChildElement.type === nextChildElement.type

      // 替换
      if (!canUpdate) {
        const prevChildNode = prevChildComponent.getHostNode()
        prevChildNode.unmount()

        const nextChildComponent = instantiateComponent(nextChildElement)
        const nextChildNode = nextChildComponent.mount()

        // 记录操作 - 替换 DOM
        operationQueue.push({ type: 'REPLACE', prevChildNode, nextChildNode })
        nextRenderedChildren.push(nextChildComponent)

        continue
      }

      // 更新 - 调用之前的内部实例的 receive 方法，传入新的 ReactElement 即可
      prevChildComponent.receive(nextChildElement)
      nextRenderedChildren.push(prevChildComponent)
    }

    // 删除
    for (let i = nextChildren.length; i < prevChildren.length; i++) {
      const prevChildComponent = prevRenderedChildren.at(i)
      const node = prevChildComponent.getHostNode()

      // 卸载内部组件实例
      prevChildComponent?.unmount()

      // 记录操作 - 卸载 DOM
      operationQueue.push({ type: 'REMOVE', node })
    }

    // 消费操作队列，执行 DOM 操作
    while (operationQueue.length > 0) {
      const operation = operationQueue.shift()

      switch (operation.type) {
        case 'ADD':
          this.node.appendChild(operation.node)
          break

        case 'REPLACE':
          this.node.replaceChild(operation.nextChildNode, operation.prevChildNode)
          break

        case 'REMOVE':
          this.node.removeChild(operation.node)
          break

        default:
          console.warn('unknown operation type')
          break
      }
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
  // Check for an existing tree.
  if (containerNode.firstChild) {
    const prevNode = containerNode.firstChild
    const prevRootComponent = prevNode.__internalInstance
    const prevElement = prevRootComponent.currentElement

    if (prevElement.type === element.type) {
      prevRootComponent.receive(element)
      return
    }

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
  function Button(props) {
    return {
      type: 'button',
      props,
    }
  }

  function Foo() {
    return {
      type: 'div',
      props: {
        id: 'foo',
      },
    }
  }

  function App(props) {
    const { buttonProps, shouldRenderFoo = false } = props

    if (shouldRenderFoo) {
      return {
        type: Foo,
        props: {},
      }
    }

    return {
      type: 'div',
      props: {
        id: 'app',
        children: [
          {
            type: Button,
            props: buttonProps,
          },
          {
            type: Button,
            props: buttonProps,
          },
        ],
      },
    }
  }

  const appElement = {
    type: App,
    props: {
      buttonProps: {
        size: 'medium',
      },
    },
  }

  // first render
  const rootEl = document.querySelector('#root')
  mount(appElement, rootEl)

  setTimeout(() => {
    // update buttonProps
    const appElement1 = {
      type: App,
      props: {
        buttonProps: {
          size: 'large',
        },
      },
    }
    mount(appElement1, rootEl)
  }, 3000)

  setTimeout(() => {
    // replace Button with Foo
    const appElement2 = {
      type: App,
      props: {
        shouldRenderFoo: true,
      },
    }
    mount(appElement2, rootEl)
  }, 6000)
}
