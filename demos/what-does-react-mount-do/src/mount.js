import { isClassComponent } from './helpers'

export function mount(element) {
  const { type, props } = element

  if (typeof type === 'string') {
    return document.createElement(type)
  }

  let renderedElement
  if (isClassComponent(type)) {
    const componentInstance = new type(props)

    componentInstance.componentWillMount?.()

    renderedElement = componentInstance.render()
  } else {
    renderedElement = type(props)
  }

  return mount(renderedElement)
}
