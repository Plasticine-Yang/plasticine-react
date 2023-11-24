import { setupInternalInstanceDemo } from './internal-instance-demo'
import { setupUnmountDemo } from './unmount-demo'
import { setupUpdateDemo } from './update-demo'

import './style.css'

const DemoName = {
  InternalInstanceDemo: 'InternalInstanceDemo',
  UnmountDemo: 'UnmountDemo',
  UpdateDemo: 'UpdateDemo',
}

function setup(demoName) {
  switch (demoName) {
    case DemoName.InternalInstanceDemo:
      setupInternalInstanceDemo()
      break

    case DemoName.UnmountDemo:
      setupUnmountDemo()
      break

    case DemoName.UpdateDemo:
      setupUpdateDemo()
      break

    default:
      console.warn('demo name not exists')
      break
  }
}

setup(DemoName.UpdateDemo)
