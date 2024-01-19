import type { ReactElement, ReactElementProps } from '@plasticine-react/shared'

import { ClassComponent } from '@/index'
import { mount } from '@/mount'

import { testingHostConfig } from '../testing-utils'

describe('mount children', () => {
  test('should mount children of function component', () => {
    function Foo() {
      return {
        type: 'div',
        props: {
          name: 'foo',
          children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child' } }],
        },
      } as ReactElement
    }

    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
          children: [
            { type: 'p', props: { id: 'child1', className: 'child1' } },
            { type: 'span', props: { id: 'child2', className: 'child2' } },
            { type: Foo, props: {} },
          ],
        },
      } as ReactElement
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const mountedElement = mount(rootElement, testingHostConfig)

    expect(mountedElement).toMatchInlineSnapshot(`
      <div
        name="app"
      >
        <p
          class="child1"
          id="child1"
        />
        <span
          class="child2"
          id="child2"
        />
        <div
          name="foo"
        >
          <p
            class="foo-child"
            id="foo-child"
          />
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
            children: [{ type: 'p', props: { id: 'foo-child', className: 'foo-child' } }],
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
              { type: 'p', props: { id: 'child1', className: 'child1' } },
              { type: 'span', props: { id: 'child2', className: 'child2' } },
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

    const mountedElement = mount(rootElement, testingHostConfig)

    expect(mountedElement).toMatchInlineSnapshot(`
      <div
        name="app"
      >
        <p
          class="child1"
          id="child1"
        />
        <span
          class="child2"
          id="child2"
        />
        <div
          name="foo"
        >
          <p
            class="foo-child"
            id="foo-child"
          />
        </div>
      </div>
    `)
  })
})
