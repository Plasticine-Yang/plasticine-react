import type { BuildConfig, RollupBuildConfig } from './types'

import { existsSync } from 'fs'
import { resolve } from 'path'

import { defineConfig, ModuleFormat, RollupOptions } from 'rollup'

import { PACKAGES_PATH } from '../constants'
import { Logger } from '../logger'
import { resolveJSONFile } from '../utils'
import { resolveRollupPlugins } from './resolve-rollup-plugins'

const logger = new Logger('build')

interface InternalCreateRollupConfigOptions {
  /** @description iife 和 umd 的产物名称 */
  name: string
  packageName: string
  input: string
  formats: ModuleFormat[]
}

/**
 * @description 构造 RollupOptions
 * @param packageName 包名
 * @returns rollup config
 */
function createRollupConfig(config: RollupBuildConfig) {
  const { packageName } = config

  const rollupConfig: RollupOptions[] = []

  // constants
  const TARGET_PACKAGE_PATH = resolve(PACKAGES_PATH, packageName)

  /** @description resolve path relative to the target paackage */
  const resolveByTargetPackage = (...paths: string[]) =>
    resolve(TARGET_PACKAGE_PATH, ...paths)

  const pkg = resolveJSONFile(resolveByTargetPackage('package.json'))
  const buildConfig: BuildConfig = pkg.buildConfig

  /**
   * @description create rollup config internally
   */
  let warned = false
  const _createRollupConfig = (
    internalOptions: InternalCreateRollupConfigOptions,
  ) => {
    const { name, packageName, input, formats } = internalOptions

    const _rollupConfig = formats.map((format) => {
      const resolvedInput = resolveByTargetPackage(input)

      if (!existsSync(resolvedInput)) {
        if (!warned) {
          warned = true
          logger.warn(
            `pass ${packageName} -- input: ${resolvedInput} does not exists.`,
          )
        }
        return
      }

      return defineConfig({
        input: resolvedInput,
        output: {
          name,
          format,
          file: resolveByTargetPackage(`dist/${format}/${packageName}.js`),
          // 构建 UMD 产物时 对于 external 的依赖需要配置其 UMD 产物名称
          globals: {
            '@plasticine-react/shared': 'ReactShared',
            '@plasticine-react/react-reconciler': 'ReactReconciler',
          },
        },
        plugins: resolveRollupPlugins(config),
        external: Object.keys(pkg.dependencies ?? {}),
      })
    })

    return _rollupConfig.filter(
      (config) => config !== undefined,
    ) as RollupOptions
  }

  /** @description 构建主包 */
  const createMainRollupConfig = () => {
    const { name, formats } = buildConfig

    return _createRollupConfig({
      name,
      input: 'src/index.ts',
      formats,
      packageName,
    })
  }

  /** @description 构建额外包 */
  const createAdditionalRollupConfig = () => {
    const { additional } = buildConfig
    const _rollupConfig: RollupOptions[] = []

    additional!.forEach((config) => {
      const { input, outputs } = config

      for (const [outputName, outputConfig] of Object.entries(outputs)) {
        const { name, formats } = outputConfig

        _rollupConfig.push(
          _createRollupConfig({
            name,
            input,
            formats,
            packageName: outputName,
          }),
        )
      }
    })

    return _rollupConfig.flat()
  }

  const run = () => {
    // 构建主包
    rollupConfig.push(createMainRollupConfig())

    // 构建主包导出的额外包
    buildConfig.additional &&
      rollupConfig.push(...createAdditionalRollupConfig())
  }

  run()

  return rollupConfig.flat()
}

export { createRollupConfig }
