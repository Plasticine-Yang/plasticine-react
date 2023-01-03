import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const PROJECT_ROOT = resolve(__dirname, '../../..')

export const PACKAGES_PATH = resolve(PROJECT_ROOT, 'packages')
