import pkg from '../package.json'

import { jsx } from './jsx'

export default {
  version: pkg.version,
  createElement: jsx,
}
