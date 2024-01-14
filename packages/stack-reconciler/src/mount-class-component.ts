import type { ClassComponent, ReactElement } from '@plasticine-react/shared'

export function mountClassComponent(element: ReactElement): ReactElement {
  const { type, props } = element
  const classComponent = type as typeof ClassComponent
  const classComponentInstance = new classComponent(props)

  classComponentInstance.componentWillMount?.()

  const renderedElement = classComponentInstance.render()

  return renderedElement
}
