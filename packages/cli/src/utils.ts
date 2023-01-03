import { readFileSync } from 'fs'

export function resolveJSONFile(filePath: string) {
  const fileContent = readFileSync(filePath, { encoding: 'utf-8' })

  return JSON.parse(fileContent)
}

export async function runParallel<T = any>(
  maxConcurrency: number,
  items: T[],
  iteratorFn: (item: T, ...args: any[]) => void,
  optionsForIteratorFn: any,
) {
  const ret = []
  const executing: any[] = []
  for (const item of items) {
    const p = Promise.resolve().then(() =>
      iteratorFn(item, optionsForIteratorFn),
    )
    ret.push(p)

    if (maxConcurrency <= items.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}
