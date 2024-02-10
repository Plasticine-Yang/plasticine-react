import type { ReactElement, ReactElementProps } from '@plasticine-react/shared'

import { ClassComponent } from '@/index'
import { mount } from '@/mount'

import { testingHostConfig } from '../testing-utils'

describe('mount children', () => {
  let hostContainerNode: HTMLElement

  beforeEach(() => {
    hostContainerNode = testingHostConfig.create('div')
  })

  test('should mount children of function component', () => {
    function Foo() {
      return {
        type: 'div',
        props: {
          name: 'foo',
          children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child', children: 'foo' } }],
        },
      } as ReactElement
    }

    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
          children: [
            { type: 'p', props: { id: 'child1', className: 'child1', children: 'child1' } },
            { type: 'span', props: { id: 'child2', className: 'child2', children: 'child2' } },
            { type: Foo, props: {} },
          ],
        },
      } as ReactElement
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, hostContainerNode, testingHostConfig)

    expect(mountedHostNode).toMatchInlineSnapshot(`
      <div
        name="app"
      >
        <p
          class="child1"
          id="child1"
        >
          child1
        </p>
        <span
          class="child2"
          id="child2"
        >
          child2
        </span>
        <div
          name="foo"
        >
          <p
            class="foo-child"
            id="foo-child"
          >
            foo
          </p>
        </div>
      </div>
    `)
  })

  test('should mount children of class component', () => {
    class Foo extends ClassComponent {
      render(): ReactElement<ReactElementProps> {
        return {
          type: 'div',
          props: {
            name: 'foo',
            children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child', children: 'foo-child' } }],
          },
        }
      }
    }

    class App extends ClassComponent {
      render(): ReactElement<ReactElementProps> {
        return {
          type: 'div',
          props: {
            name: 'app',
            children: [
              { type: 'p', props: { id: 'child1', className: 'child1', children: 'child1' } },
              { type: 'span', props: { id: 'child2', className: 'child2', children: 'child2' } },
              { type: Foo, props: {} },
            ],
          },
        }
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, hostContainerNode, testingHostConfig)

    expect(mountedHostNode).toMatchInlineSnapshot(`
      <div
        name="app"
      >
        <p
          class="child1"
          id="child1"
        >
          child1
        </p>
        <span
          class="child2"
          id="child2"
        >
          child2
        </span>
        <div
          name="foo"
        >
          <p
            class="foo-child"
            id="foo-child"
          >
            foo-child
          </p>
        </div>
      </div>
    `)
  })

  test('should mount children when function component nested in class component', () => {
    function Foo() {
      return {
        type: 'div',
        props: {
          name: 'foo',
          children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child', children: 'foo-child' } }],
        },
      }
    }

    class App extends ClassComponent {
      render(): ReactElement<ReactElementProps> {
        return {
          type: 'div',
          props: {
            name: 'app',
            children: [
              { type: 'p', props: { id: 'child1', className: 'child1', children: 'child1' } },
              { type: 'span', props: { id: 'child2', className: 'child2', children: 'child2' } },
              { type: Foo, props: {} },
            ],
          },
        }
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, hostContainerNode, testingHostConfig)

    expect(mountedHostNode).toMatchInlineSnapshot(`
      <div
        name="app"
      >
        <p
          class="child1"
          id="child1"
        >
          child1
        </p>
        <span
          class="child2"
          id="child2"
        >
          child2
        </span>
        <div
          name="foo"
        >
          <p
            class="foo-child"
            id="foo-child"
          >
            foo-child
          </p>
        </div>
      </div>
    `)
  })

  test('should mount children when class component nested in function component', () => {
    class Foo extends ClassComponent {
      render(): ReactElement<ReactElementProps> {
        return {
          type: 'div',
          props: {
            name: 'foo',
            children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child', children: 'foo-child' } }],
          },
        }
      }
    }

    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
          children: [
            { type: 'p', props: { id: 'child1', className: 'child1', children: 'child1' } },
            { type: 'span', props: { id: 'child2', className: 'child2', children: 'child2' } },
            { type: Foo, props: {} },
          ],
        },
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const { mountedHostNode } = mount(rootElement, hostContainerNode, testingHostConfig)

    expect(mountedHostNode).toMatchInlineSnapshot(`
      <div
        name="app"
      >
        <p
          class="child1"
          id="child1"
        >
          child1
        </p>
        <span
          class="child2"
          id="child2"
        >
          child2
        </span>
        <div
          name="foo"
        >
          <p
            class="foo-child"
            id="foo-child"
          >
            foo-child
          </p>
        </div>
      </div>
    `)
  })
})
