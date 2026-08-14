import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'

const root = resolve(import.meta.dirname, '..')

test('H5 preview server keeps its public host and fixed port', async () => {
  const source = await readFile(resolve(root, 'vite.config.ts'), 'utf8')
  assert.match(source, /host:\s*["']0\.0\.0\.0["']/)
  assert.match(source, /port:\s*5173/)
  assert.match(source, /strictPort:\s*true/)
})

test('VitePress server keeps its public host and fixed port', async () => {
  const source = await readFile(resolve(root, 'docs/.vitepress/config.mts'), 'utf8')
  assert.match(source, /host:\s*["']0\.0\.0\.0["']/)
  assert.match(source, /port:\s*5174/)
  assert.match(source, /strictPort:\s*true/)
})
