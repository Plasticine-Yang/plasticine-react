import { ClassComponent } from './class-component'
import { mount } from './mount'

import './style.css'

class App extends ClassComponent {
  componentWillMount() {
    console.log('will mount')
  }

  render() {
    return {
      type: 'div',
      props: {
        className: 'app',
        children: 'App',
      },
    }
  }
}

const reactElement = {
  type: App,
  props: {},
}

const rootEl = document.querySelector('#root')
const node = mount(reactElement)

rootEl.appendChild(node)
