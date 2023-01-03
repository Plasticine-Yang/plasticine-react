import { readdirSync } from 'fs'
import { cpus } from 'os'
import { resolve } from 'path'

import { execa } from 'execa'

import { PACKAGES_PATH, PROJECT_ROOT } from './constants'
import { resolveJSONFile } from './utils'

const reservedPackages = ['cli']
const allPackages = readdirSync(PACKAGES_PATH).filter(
  (p) => !reservedPackages.includes(p),
)

interface BuildOptions {
  '--': string[]
  mode?: 'development' | 'production'
}
export function buildAction(packages: string[], options: BuildOptions) {
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
function resolveOptionsDefaultValue(options: BuildOptions): BuildOptions {
  return {
    '--': options['--'],
    mode: options.mode ?? 'development',
  }
}

async function buildAll(packages: string[], options: BuildOptions) {
  await runParallel(cpus().length, packages, build, options)
}

async function runParallel(
  maxConcurrency: number,
  packages: string[],
  iteratorFn: any,
  optionsForIteratorFn: BuildOptions,
) {
  const ret = []
  const executing: any[] = []
  for (const item of packages) {
    const p = Promise.resolve().then(() =>
      iteratorFn(item, optionsForIteratorFn),
    )
    ret.push(p)

    if (maxConcurrency <= packages.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

async function build(target: string, options: BuildOptions) {
  const { mode } = options

  const pkgDir = resolve(PACKAGES_PATH, target)
  const pkg = resolveJSONFile(`${pkgDir}/package.json`)

  // ignore private packages
  if (pkg.private) {
    return
  }

  await execa(
    'rollup',
    [
      '-c',
      '--configPlugin typescript',
      '--environment',
      [`NODE_ENV:${mode}`, `TARGET:${target}`].join(','),
    ],
    { stdio: 'inherit', cwd: PROJECT_ROOT },
  )

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
