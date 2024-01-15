import type { ReactElement } from '@plasticine-react/shared'

import { mount } from '@/mount'

import { testingHostConfig } from './testing-utils'

describe('mount', () => {
  test('should set props', () => {
    function App() {
      return { type: 'div', props: { name: 'foo' } } as ReactElement
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    const mountedElement = mount(rootElement, testingHostConfig)

    expect(mountedElement).toMatchInlineSnapshot(`
      TestingHostNode {
        "attributes": {
          "name": "foo",
        },
        "children": [],
        "type": "div",
      }
    `)
  })

  test('should not set children as attribute', () => {
    function App() {
      return {
        type: 'div',
        props: {
          name: 'foo',
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

    const mountedElement = mount(rootElement, testingHostConfig)

    expect(Object.keys(mountedElement.attributes).includes('children')).toBeFalsy()
  })

  test('should mount children', () => {
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
      TestingHostNode {
        "attributes": {
          "name": "app",
        },
        "children": [
          TestingHostNode {
            "attributes": {
              "className": "child1",
              "id": "child1",
            },
            "children": [],
            "type": "p",
          },
          TestingHostNode {
            "attributes": {
              "className": "child2",
              "id": "child2",
            },
            "children": [],
            "type": "span",
          },
          TestingHostNode {
            "attributes": {
              "name": "foo",
            },
            "children": [
              TestingHostNode {
                "attributes": {
                  "className": "foo-child",
                  "id": "foo-child",
                },
                "children": [],
                "type": "p",
              },
            ],
            "type": "div",
          },
        ],
        "type": "div",
      }
    `)
  })
})
