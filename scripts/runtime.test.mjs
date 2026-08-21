import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'

const sourceRoot = resolve(import.meta.dirname, '../src/uni_modules/snake-ui/libs')
const testRoot = await mkdtemp(join(tmpdir(), 'snake-ui-runtime-'))
await Promise.all(['unit.ts', 'platform.ts'].map(async (file) => {
  await writeFile(join(testRoot, file), await readFile(join(sourceRoot, file)))
}))
await mkdir(join(testRoot, 'functions'))
const functionsSource = (await readFile(join(sourceRoot, 'functions/index.ts'), 'utf8'))
  .replace("from '../unit'", "from '../unit.ts'")
  .replaceAll("from '../platform'", "from '../platform.ts'")
await writeFile(join(testRoot, 'functions/index.ts'), functionsSource)
const runtimeSource = (await readFile(join(sourceRoot, 'runtime.ts'), 'utf8'))
  .replace("from './unit'", "from './unit.ts'")
  .replace("from './platform'", "from './platform.ts'")
  .replace("from './functions'", "from './functions/index.ts'")
await writeFile(join(testRoot, 'runtime.ts'), runtimeSource)

const {
  configureSnakeUI,
  getSnakeConfig,
  requireSnakeCache,
  requireSnakeRequest,
  resetSnakeUIRuntime,
  snake,
  SnakeUIRuntimeError,
} = await import(`${new URL(`file:///${join(testRoot, 'runtime.ts').replaceAll('\\', '/')}`)}?test=${Date.now()}`)

process.on('exit', () => { void rm(testRoot, { recursive: true, force: true }) })

test('runtime exposes configured adapters', async () => {
  resetSnakeUIRuntime()
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
  configureSnakeUI({ request, cache, config: { baseUrl: '/api' } })
  assert.equal(requireSnakeRequest('test'), request)
  assert.equal(requireSnakeCache('test'), cache)
  assert.equal(getSnakeConfig('test').baseUrl, '/api')
  assert.deepEqual(await requireSnakeRequest('test').get('/health'), { ok: true })
  assert.equal(typeof snake.route, 'function')
  assert.equal(typeof snake.queryParams, 'function')
  assert.equal(typeof snake.timeFrom, 'function')
})

test('runtime reports a missing capability with component context', () => {
  resetSnakeUIRuntime()
  assert.throws(() => requireSnakeCache('snake-filter-sorts'), (error) => {
    assert.ok(error instanceof SnakeUIRuntimeError)
    assert.equal(error.component, 'snake-filter-sorts')
    assert.equal(error.capability, 'cache')
    return true
  })
})
