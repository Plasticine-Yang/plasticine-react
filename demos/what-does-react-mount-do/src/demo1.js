function isClass(type) {
  // React.Component subclass has this flag
  return Boolean(type.prototype?.isReactComponent)
}

/**
 * This function takes a React element (e.g. `<App />`)
 * and returns a DOM representing the mounted tree.
 *
 * Note: this implementation is incomplete and recurses infinitely!
 * It only handles elements like `<App />`  or `<Button />`
 * It doesn't handle elements like `<div />` or `<p />` yet.
 */
function mount(element) {
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

  // The process is recursive because a component may
  // return an element with a type of another component.
  return mount(renderedElement)
}

function App() {
  return {
    type: 'div',
    props: {},
  }
}

const rootEl = document.querySelector('#root')
const node = mount({ type: App, props: {} })
rootEl.appendChild(node)
