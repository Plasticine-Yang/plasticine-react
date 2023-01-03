import { readFileSync } from 'fs'

export function resolveJSONFile(filePath: string) {
  const fileContent = readFileSync(filePath, { encoding: 'utf-8' })

  return JSON.parse(fileContent)
}
