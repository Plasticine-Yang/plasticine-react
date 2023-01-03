import { readdirSync } from 'fs'
import { cpus } from 'os'
import { resolve } from 'path'

import rimraf from 'rimraf'

import { PACKAGES_PATH } from '../constants'
import { Logger } from '../logger'
import { resolveJSONFile, runParallel } from '../utils'
import { rollupBuild } from './rollup'
import { BuildActionOptions } from './types'

const logger = new Logger('build')

const reservedPackages = ['cli']
const allPackages = readdirSync(PACKAGES_PATH).filter(
  (p) => !reservedPackages.includes(p),
)

export function buildAction(packages: string[], options: BuildActionOptions) {
  // build all packages default
  packages = packages.length === 0 ? allPackages : packages

  // ensure build valid packages
  packages =
    packages !== allPackages
      ? packages.filter((p) => allPackages.includes(p))
      : packages

  const resolvedOptions = resolveOptionsDefaultValue(options)

  buildAll(packages, resolvedOptions)
}

/**
 * @description 为 options 设置默认值
 */
function resolveOptionsDefaultValue(
  options: BuildActionOptions,
): Required<BuildActionOptions> {
  return {
    '--': options['--'],
    mode: options.mode ?? 'development',
  }
}

async function buildAll(packages: string[], options: BuildActionOptions) {
  await runParallel(cpus().length, packages, build, options)
}

async function build(packageName: string, options: BuildActionOptions) {
  const { mode } = options

  const pkgDir = resolve(PACKAGES_PATH, packageName)
  const pkg = resolveJSONFile(`${pkgDir}/package.json`)

  // ignore packages that is private or no buildConfig field
  if (pkg.private || !pkg.buildConfig) {
    if (!pkg.buildConfig) {
      logger.warn(
        `pass ${packageName} -- cannot find buildConfig field in package: ${packageName}`,
      )
    }

    return
  }

  // remove dist files
  rimraf.sync(resolve(pkgDir, 'dist'))

  await rollupBuild({ packageName, mode })

  // if (buildTypes && pkg.types) {
  //   console.log()
  //   console.log(
  //     chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)),
  //   )

  //   // build types
  //   const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

  //   const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
  //   const extractorConfig =
  //     ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
  //   const extractorResult = Extractor.invoke(extractorConfig, {
  //     localBuild: true,
  //     showVerboseMessages: true,
  //   })

  //   if (extractorResult.succeeded) {
  //     // concat additional d.ts to rolled-up dts
  //     const typesDir = path.resolve(pkgDir, 'types')
  //     if (await fs.exists(typesDir)) {
  //       const dtsPath = path.resolve(pkgDir, pkg.types)
  //       const existing = await fs.readFile(dtsPath, 'utf-8')
  //       const typeFiles = await fs.readdir(typesDir)
  //       const toAdd = await Promise.all(
  //         typeFiles.map((file) => {
  //           return fs.readFile(path.resolve(typesDir, file), 'utf-8')
  //         }),
  //       )
  //       await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
  //     }
  //     console.log(
  //       chalk.bold(chalk.green(`API Extractor completed successfully.`)),
  //     )
  //   } else {
  //     console.error(
  //       `API Extractor completed with ${extractorResult.errorCount} errors` +
  //         ` and ${extractorResult.warningCount} warnings`,
  //     )
  //     process.exitCode = 1
  //   }

  //   await fs.remove(`${pkgDir}/dist/packages`)
  // }
}
