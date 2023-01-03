import { resolve } from 'path'
import { fileURLToPath } from 'url'

import typescript from '@rollup/plugin-typescript'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import { defineConfig } from 'rollup'

const { TARGET } = process.env

if (!TARGET) {
  console.error('target package is not defined.')
  process.exit(1)
}

// shims with cjs
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)

// constants
const PACKAGES_PATH = resolve(__dirname, 'packages')
const TARGET_PACKAGE_PATH = resolve(PACKAGES_PATH, TARGET)

/** @description resolve path relative to the target paackage */
const resolveByTargetPackage = (...paths) =>
  resolve(TARGET_PACKAGE_PATH, ...paths)

const pkg = require(resolveByTargetPackage('package.json'))

function createRollupConfig() {
  const { name, formats, additional } = pkg.buildConfig
  const rollupConfig = []

  rollupConfig.push(createMainRollupConfig(name, formats))
  rollupConfig.push(createAdditionalRollupConfig(additional))

  return rollupConfig.flat()
}

function createMainRollupConfig(name, formats) {
  return _createRollupConfig({
    name,
    input: 'src/index.ts',
    formats,
    filename: TARGET,
  })
}

function createAdditionalRollupConfig(additional) {
  const rollupConfig = []

  additional.forEach((config) => {
    const { input, outputs } = config

    for (const [outputName, outputConfig] of Object.entries(outputs)) {
      const { name, formats } = outputConfig

      rollupConfig.push(
        _createRollupConfig({
          name,
          input,
          formats,
          filename: outputName,
        }),
      )
    }
  })

  return rollupConfig.flat()
}

let warned = false
function _createRollupConfig({ name, filename, input, formats }) {
  const rollupConfig = formats.map((format) => {
    const resolvedInput = resolveByTargetPackage(input)

    if (!existsSync(resolvedInput)) {
      if (!warned) {
        warned = true
        console.error(`input: ${resolvedInput} not exists.`)
      }
      return
    }

    return defineConfig({
      input: resolvedInput,
      output: {
        name,
        format,
        file: resolveByTargetPackage(`dist/${format}/${filename}.js`),
      },
      plugins: [typescript()],
    })
  })

  return rollupConfig.filter((config) => config !== undefined)
}

export default createRollupConfig()
