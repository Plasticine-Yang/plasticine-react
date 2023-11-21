function isClass(type) {
  // React.Component subclass has this flag
  return Boolean(type.prototype?.isReactComponent)
}

/**
 * This function only handles elements with a composite type.
 * For example, it handles `<App />` and `<Button />`, but not a `<div />`.
 */
function mountComposite(element) {
  const { type, props } = element

  let renderedElement

  // We will determine the rendered element
  // by either running the type as function
  // or creating an instance and calling render().
  if (isClass(type)) {
    // Class component
    const publicInstance = new type(props)

    publicInstance.componentWillMount?.()

    // Get the rendered element by calling the render method.
    renderedElement = publicInstance.render()
  } else {
    // Function component
    renderedElement = type(props)
  }

  // This is recursive but we'll eventually reach the bottom of recursion when
  // the element is host rather than composite;
  return mount(renderedElement)
}

/**
 * This function only handles elements with a host type.
 * For example, it handles `<div />` and `<p />` but not an `<App />`
 */
function mountHost(element) {
  const { type, props } = element
  let { children = [] } = props

  if (!Array.isArray(children)) {
    children = [children]
  }

  children = children.filter(Boolean)

  // This block of code shouldn't be in the reconciler.
  // Different renderers might initialize nodes differently.
  // For example, React Native would create iOS or Android views.
  const node = document.createElement(type)
  for (const propName of Object.keys(props)) {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName])
    }
  }

  // Mount the children
  for (const childElement of children) {
    // Children may be host or composite.
    // We will also mount them recursively.
    const childNode = mount(childElement)

    // This line of code is also renderer-specific.
    // It would be different depending on the renderer.
    node.appendChild(childNode)
  }

  // Return the DOM node as result.
  // This is where the recursion ends.
  return node
}

function mount(element) {
  const { type } = element

  if (typeof type === 'function') {
    // User-defined components
    return mountComposite(element)
  } else if (typeof type === 'string') {
    // Platform-specific components
    return mountHost(element)
  }
}

function Foo() {
  return {
    type: 'div',
    props: {
      id: 'foo',
      children: {
        type: 'p',
        props: {
          innerText: 'Foo',
        },
      },
    },
  }
}

function Bar() {
  return {
    type: 'div',
    props: {
      id: 'bar',
      children: [
        {
          type: 'p',
          props: {
            innerText: 'Bar',
          },
        },
        {
          type: 'p',
          props: {
            innerText: 'Bar1',
          },
        },
      ],
    },
  }
}

function App() {
  return {
    type: 'div',
    props: {
      children: [
        {
          type: Foo,
        },
        {
          type: Bar,
        },
      ],
    },
  }
}

const rootEl = document.querySelector('#root')
const node = mount({ type: App, props: {} })
rootEl.appendChild(node)
