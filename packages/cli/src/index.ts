import cac from 'cac'

import pkg from '../package.json'
import { buildAction } from './build'

const cli = cac('@plasticine-react/cli')

// build
cli
  .command('build [...packages]', 'Build with rollup.')
  .option('--mode <mode>', 'development or production')
  .action(buildAction)

cli.help()
cli.version(pkg.version)
cli.parse()
