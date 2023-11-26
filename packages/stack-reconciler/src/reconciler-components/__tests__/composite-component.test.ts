import { ClassComponent, type FunctionComponent, type ReactElement } from '@plasticine-react/shared'

import { CompositeComponent } from '../composite-component'

describe('CompositeComponent', () => {
  test('should mount FunctionComponent', () => {
    const fooRenderedElement: ReactElement = {
      type: 'div',
      props: {},
    }

    const Foo: FunctionComponent = () => {
      return fooRenderedElement
    }

    const element: ReactElement = {
      type: Foo,
      props: {},
    }

    const compositeComponent = new CompositeComponent(element)
    const renderedElement = compositeComponent.mount()
    expect(renderedElement).toEqual(fooRenderedElement)
  })

  test('should mount ClassComponent', () => {
    const fooRenderedElement: ReactElement = {
      type: 'div',
      props: {},
    }
    const componentWillMount = vi.fn()

    class Foo extends ClassComponent {
      componentWillMount(): void {
        componentWillMount()
      }

      render(): ReactElement {
        return fooRenderedElement
      }
    }

    const element: ReactElement = {
      type: Foo,
      props: {},
    }

    const compositeComponent = new CompositeComponent(element)
    const renderedElement = compositeComponent.mount()
    expect(componentWillMount).toHaveBeenCalledOnce()
    expect(renderedElement).toEqual(fooRenderedElement)
  })
})
