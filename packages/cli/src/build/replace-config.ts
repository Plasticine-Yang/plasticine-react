/** @description @rollup/plugin-replace 插件的配置 */

import type { RollupReplaceOptions } from '@rollup/plugin-replace'
import type { RollupBuildConfig } from './types'

function createReplaceConfig(config: RollupBuildConfig) {
  const { mode } = config

  const replaceConfig: RollupReplaceOptions = {
    // ============== plugin config ==============

    // Prevents replacing strings where they are followed by a single equals sign.
    preventAssignment: true,

    // ============== replace values ==============
    __DEV__: mode === 'development' ? true : false,
  }

  return replaceConfig
}

export { createReplaceConfig }
