const { spawn } = require('node:child_process')
const { resolve } = require('node:path')

const root = resolve(__dirname, '..')
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const children = [
  spawn(command, ['run', 'dev:h5'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' }),
  spawn(command, ['run', 'docs:dev'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' }),
]

let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit(code)
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error)
    stop(1)
  })
  child.on('exit', (code) => {
    if (!stopping && code && code !== 0) stop(code)
  })
}

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
