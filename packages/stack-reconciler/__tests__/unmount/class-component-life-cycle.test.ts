import { ReactElementProps } from '@plasticine-react/shared'

import { ClassComponent, ReactElement } from '@/index'
import { mount } from '@/mount'

import { testingHostConfig } from '../testing-utils'
import { unmount } from '@/unmount'

describe('class component life cycle', () => {
  let hostContainerNode: HTMLElement

  beforeEach(() => {
    hostContainerNode = testingHostConfig.createHostNode('div')
  })

  test('should trigger componentWillUnmount', () => {
    const componentWillUnmountFn = vi.fn()

    class App extends ClassComponent {
      componentWillUnmount(): void {
        componentWillUnmountFn()
      }

      render(): ReactElement<ReactElementProps> {
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
    expect(componentWillUnmountFn).not.toHaveBeenCalled()

    unmount(hostContainerNode, testingHostConfig)
    expect(componentWillUnmountFn).toHaveBeenCalledTimes(1)
  })

  test('should trigger componentWillUnmount with nested element', () => {
    const componentWillUnmountAppFn = vi.fn()
    const componentWillUnmountFooFn = vi.fn()

    class Foo extends ClassComponent {
      componentWillUnmount(): void {
        componentWillUnmountFooFn()
      }

      render(): ReactElement<ReactElementProps> {
        return {
          type: 'div',
          props: {
            name: 'foo',
          },
        }
      }
    }

    class App extends ClassComponent {
      componentWillUnmount(): void {
        componentWillUnmountAppFn()
      }

      render(): ReactElement<ReactElementProps> {
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
    expect(componentWillUnmountAppFn).not.toHaveBeenCalled()
    expect(componentWillUnmountFooFn).not.toHaveBeenCalled()

    unmount(hostContainerNode, testingHostConfig)
    expect(componentWillUnmountAppFn).toHaveBeenCalledTimes(1)
    expect(componentWillUnmountFooFn).toHaveBeenCalledTimes(1)
  })

  test('should trigger componentWillUnmount when class component nested in function component', () => {
    const componentWillUnmountFooFn = vi.fn()

    class Foo extends ClassComponent {
      componentWillUnmount(): void {
        componentWillUnmountFooFn()
      }

      render(): ReactElement<ReactElementProps> {
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
    expect(componentWillUnmountFooFn).not.toHaveBeenCalled()

    unmount(hostContainerNode, testingHostConfig)
    expect(componentWillUnmountFooFn).toHaveBeenCalledTimes(1)
  })
})
