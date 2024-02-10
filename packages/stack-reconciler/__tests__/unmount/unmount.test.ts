import { ReactElement } from '@/index'
import { mount } from '@/mount'
import { unmount } from '@/unmount'

import { testingHostConfig } from '../testing-utils'

describe('unmount', () => {
  let hostContainerNode: HTMLElement

  beforeEach(() => {
    hostContainerNode = testingHostConfig.create('div')
  })

  test('should unmount', () => {
    function App() {
      return {
        type: 'div',
        props: {
          name: 'app',
        },
      }
    }

    const rootElement: ReactElement = {
      type: App,
      props: {},
    }

    mount(rootElement, hostContainerNode, testingHostConfig)
    expect(hostContainerNode).toMatchInlineSnapshot(`
      <div>
        <div
          name="app"
        />
      </div>
    `)

    unmount(hostContainerNode, testingHostConfig)
    expect(hostContainerNode).toMatchInlineSnapshot('<div />')
  })

  test('should throw error when not mounted', () => {
    try {
      unmount(hostContainerNode, testingHostConfig)
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: hostContainerNode has no child node mounted.]')
    }
  })
})
