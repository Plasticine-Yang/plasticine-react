import { ReactElementProps } from '@plasticine-react/shared'

import { ClassComponent, ReactElement } from '@/index'
import { mount } from '@/mount'

import { testingHostConfig } from '../testing-utils'

describe('class component life cycle', () => {
  let hostContainerNode: HTMLElement

  beforeEach(() => {
    hostContainerNode = testingHostConfig.create('div')
  })

  test('should trigger componentWillMount', () => {
    const componentWillMountFn = vi.fn()

    class App extends ClassComponent {
      componentWillMount(): void {
        componentWillMountFn()
      }

      render(): ReactElement<ReactElementProps> {
        expect(componentWillMountFn).toHaveBeenCalledTimes(1)

        return {
          type: 'div',
          props: {
            name: 'app',
          },
        }
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    mount(rootElement, hostContainerNode, testingHostConfig)

    expect(componentWillMountFn).toHaveBeenCalledTimes(1)
  })

  test('should trigger componentWillMount with nested element', () => {
    const componentWillMountAppFn = vi.fn()
    const componentWillMountFooFn = vi.fn()

    class Foo extends ClassComponent {
      componentWillMount(): void {
        componentWillMountFooFn()
      }

      render(): ReactElement<ReactElementProps> {
        expect(componentWillMountFooFn).toHaveBeenCalledTimes(1)

        return {
          type: 'div',
          props: {
            name: 'foo',
          },
        }
      }
    }

    class App extends ClassComponent {
      componentWillMount(): void {
        componentWillMountAppFn()
      }

      render(): ReactElement<ReactElementProps> {
        expect(componentWillMountAppFn).toHaveBeenCalledTimes(1)

        return {
          type: 'div',
          props: {
            name: 'app',
            children: {
              type: Foo,
              props: {},
            },
          },
        }
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    mount(rootElement, hostContainerNode, testingHostConfig)
    expect(componentWillMountAppFn).toHaveBeenCalledTimes(1)
    expect(componentWillMountFooFn).toHaveBeenCalledTimes(1)
  })

  test('should trigger componentWillMount when class component nested in function component', () => {
    const componentWillMountFooFn = vi.fn()

    class Foo extends ClassComponent {
      componentWillMount(): void {
        componentWillMountFooFn()
      }

      render(): ReactElement<ReactElementProps> {
        expect(componentWillMountFooFn).toHaveBeenCalledTimes(1)

        return {
          type: 'div',
          props: {
            name: 'foo',
          },
        }
      }
    }

    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
          children: {
            type: Foo,
            props: {},
          },
        },
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    mount(rootElement, hostContainerNode, testingHostConfig)
    expect(componentWillMountFooFn).toHaveBeenCalledTimes(1)
  })
})
