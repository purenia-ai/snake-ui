const { cpSync, existsSync, rmSync } = require('node:fs')
const { resolve } = require('node:path')
const { spawnSync } = require('node:child_process')

const root = resolve(__dirname, '..')
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

function run(args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run(['run', 'build:h5'])
run(['run', 'docs:build'])

const source = resolve(root, 'dist/build/h5')
const target = resolve(root, 'docs/.vitepress/dist/preview')
if (!existsSync(source)) throw new Error(`H5 output not found: ${source}`)
if (existsSync(target)) rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })
console.log(`Snake UI H5 preview copied to ${target}`)
