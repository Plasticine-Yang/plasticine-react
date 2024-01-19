import type { ReactElement, ReactElementProps } from '@plasticine-react/shared'

import { ClassComponent } from '@/index'
import { mount } from '@/mount'

import { testingHostConfig } from '../testing-utils'

describe('mount - set props of function component', () => {
  test('should set props', () => {
    function App() {
      return { type: 'div', props: { name: 'app' } } as ReactElement
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, testingHostConfig)

    expect(mountedHostNode).toMatchInlineSnapshot(`
      <div
        name="app"
      />
    `)
  })

  test('should not set children as attribute', () => {
    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
          children: [
            { type: 'p', props: { id: 'child1', className: 'child1' } },
            { type: 'span', props: { id: 'child2', className: 'child2' } },
          ],
        },
      } as ReactElement
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, testingHostConfig)

    expect(Object.keys(mountedHostNode.attributes).includes('children')).toBeFalsy()
  })
})

describe('mount - set props of class component', () => {
  test('should set props', () => {
    class App extends ClassComponent {
      render(): ReactElement<ReactElementProps> {
        return { type: 'div', props: { name: 'app' } } as ReactElement
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, testingHostConfig)

    expect(mountedHostNode).toMatchInlineSnapshot(`
      <div
        name="app"
      />
    `)
  })

  test('should not set children as attribute', () => {
    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
          children: [
            { type: 'p', props: { id: 'child1', className: 'child1' } },
            { type: 'span', props: { id: 'child2', className: 'child2' } },
          ],
        },
      } as ReactElement
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, testingHostConfig)

    expect(Object.keys(mountedHostNode.attributes).includes('children')).toBeFalsy()
  })
})
