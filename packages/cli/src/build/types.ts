import { ModuleFormat } from 'rollup'

export interface BuildActionOptions {
  '--': string[]
  mode?: 'development' | 'production'
}

export interface BuildConfig {
  /** @description iife 和 umd 的产物名称 */
  name: string
  formats: ModuleFormat[]
  additional?: AdditionalBuildConfig[]
}

/**
 * @description 当一个包要导出额外的子包时使用的配置
 */
export interface AdditionalBuildConfig {
  input: string
  outputs: {
    [outputName: string]: {
      /** @description iife 和 umd 的产物名称 */
      name: string
      formats: ModuleFormat[]
    }
  }
}

export interface RollupBuildConfig {
  packageName: string
  mode: BuildActionOptions['mode']
}
