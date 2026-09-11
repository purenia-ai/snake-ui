import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'

const sourceRoot = resolve(import.meta.dirname, '../src/uni_modules/snake-ui/libs')
const testRoot = await mkdtemp(join(tmpdir(), 'snake-ui-runtime-'))
const runtimeRoot = join(testRoot, 'runtime')
await cp(join(sourceRoot, 'runtime'), runtimeRoot, { recursive: true })
for (const file of await readdir(runtimeRoot)) {
  if (!file.endsWith('.ts')) continue
  const path = join(runtimeRoot, file)
  const source = (await readFile(path, 'utf8')).replace(
    /(from |export \* from |export \{[^}]+\} from )'(\.\/[^']+)'/g,
    "$1'$2.ts'",
  )
  await writeFile(path, source)
}

const runtimeApi = await import(`${new URL(`file:///${join(runtimeRoot, 'index.ts').replaceAll('\\', '/')}`)}?test=${Date.now()}`)
const {
  configureRuntime,
  getRuntimeConfig,
  requireCache,
  requireRequest,
  resetRuntime,
  RuntimeError,
} = runtimeApi

process.on('exit', () => { void rm(testRoot, { recursive: true, force: true }) })

test('runtime exposes configured adapters', async () => {
  resetRuntime()
  const request = {
    async get() { return { ok: true } },
    async post() { return { ok: true } },
  }
  const values = new Map()
  const cache = {
    get(key) { return values.get(key) },
    set(key, value) { values.set(key, value) },
    delete(key) { values.delete(key) },
  }
  configureRuntime({ request, cache, config: { baseUrl: '/api' } })
  assert.equal(requireRequest('test'), request)
  assert.equal(requireCache('test'), cache)
  assert.equal(getRuntimeConfig('test').baseUrl, '/api')
  assert.deepEqual(await requireRequest('test').get('/health'), { ok: true })
  assert.equal('snake' in runtimeApi, false)
})

test('runtime reports a missing capability with component context', () => {
  resetRuntime()
  assert.throws(() => requireCache('snake-filter-sorts'), (error) => {
    assert.ok(error instanceof RuntimeError)
    assert.equal(error.component, 'snake-filter-sorts')
    assert.equal(error.capability, 'cache')
    return true
  })
})
