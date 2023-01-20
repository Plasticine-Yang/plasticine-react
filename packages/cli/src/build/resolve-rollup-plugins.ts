import type { RollupBuildConfig } from './types'

import { InputPluginOption } from 'rollup'

import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import { createReplaceConfig } from './replace-config'

function resolveRollupPlugins(config: RollupBuildConfig): InputPluginOption {
  return [typescript(), json(), replace(createReplaceConfig(config))]
}

export { resolveRollupPlugins }
