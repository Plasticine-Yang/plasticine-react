import { OutputOptions, rollup, RollupOptions } from 'rollup'
import { Logger } from '../logger'

import { createRollupConfig } from './rollup-config'
import { RollupBuildConfig } from './types'

const logger = new Logger('build')

export async function rollupBuild(config: RollupBuildConfig) {
  const rollupConfig = createRollupConfig(config)

  await Promise.all(rollupConfig.map(_rollupBuild))
}

async function _rollupBuild(rollupOptions: RollupOptions) {
  const { file } = rollupOptions.output as OutputOptions

  logger.log(`building ${file}...`)
  const bundle = await rollup(rollupOptions)
  await bundle.write(rollupOptions.output as OutputOptions)
  logger.log(`build ${file} successfully!`)
}
