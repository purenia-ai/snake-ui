import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import test from 'node:test'

const root = resolve(import.meta.dirname, '..')
const sourceRoot = resolve(root, 'src')

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return ['.vue', '.ts', '.scss', '.json'].includes(extname(path)) ? [path] : []
  }))
  return nested.flat()
}

test('runtime source and package metadata are independent from uView Pro', async () => {
  const files = await sourceFiles(sourceRoot)
  files.push(resolve(root, 'package.json'), resolve(root, 'pnpm-lock.yaml'))
  const violations = []

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    if (/uview-pro|uni\.\$u|(?:^|[^\w])\$u\.|<\/?u-[a-z]/i.test(source)) {
      violations.push(file.replace(`${root}\\`, ''))
    }
  }

  assert.deepEqual(violations, [])
})

test('all replacement primitives are public components and exports', async () => {
  const names = ['button', 'empty', 'icon', 'image', 'lazy-image', 'loadmore', 'notice-bar', 'overlay', 'popup', 'sticky', 'swiper', 'tabs']
  const entry = await readFile(resolve(root, 'src/uni_modules/snake-ui/index.ts'), 'utf8')
  for (const name of names) {
    const file = resolve(root, `src/uni_modules/snake-ui/components/snake-${name}/snake-${name}.vue`)
    assert.ok((await readFile(file, 'utf8')).includes('<template>'), `missing template: snake-${name}`)
    const exportName = `Snake${name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`
    assert.match(entry, new RegExp(`export \\{ default as ${exportName} \\}`))
  }
})
