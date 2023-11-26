import { isClassComponent, isHostComponent, type FunctionComponent, type ReactElement } from '@plasticine-react/shared'

export class CompositeComponent {
  public currentElement: ReactElement

  constructor(element: ReactElement) {
    this.currentElement = element
  }

  public mount(element?: ReactElement): ReactElement {
    const resolvedElement = element ?? this.currentElement
    const { type, props } = resolvedElement

    if (isHostComponent(type)) {
      // 不处理 HostComponent
      return resolvedElement
    }

    let renderedElement: ReactElement

    if (isClassComponent(type)) {
      const classComponentInstance = new type(props)

      classComponentInstance.componentWillMount()
      renderedElement = classComponentInstance.render()
    } else {
      renderedElement = (type as FunctionComponent)(props)
    }

    return this.mount(renderedElement)
  }
}
