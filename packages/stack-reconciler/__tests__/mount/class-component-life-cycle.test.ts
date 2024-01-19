import { ReactElementProps } from '@plasticine-react/shared'

import { ClassComponent, ReactElement } from '@/index'
import { mount } from '@/mount'

import { testingHostConfig } from '../testing-utils'

describe('class component life cycle', () => {
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

    mount(rootElement, testingHostConfig)

    expect(componentWillMountFn).toHaveBeenCalledTimes(1)
  })
})