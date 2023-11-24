import { setupInternalInstanceDemo } from './internal-instance-demo'
import { setupUnmountDemo } from './unmount-demo'

import './style.css'

const DemoName = {
  InternalInstanceDemo: 'InternalInstanceDemo',
  UnmountDemo: 'UnmountDemo',
}

function setup(demoName) {
  switch (demoName) {
    case DemoName.InternalInstanceDemo:
      setupInternalInstanceDemo()
      break

    case DemoName.UnmountDemo:
      setupUnmountDemo()
      break

    default:
      console.warn('demo name not exists')
      break
  }
}

setup(DemoName.UnmountDemo)
