#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { basename, resolve } from 'node:path'

const pattern = process.argv[2] || 'wt-'

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  } catch {
    return null
  }
}

const listOutput = run('git worktree list --porcelain')
if (!listOutput) {
  console.log('No git worktrees found.')
  process.exit(0)
}

const worktrees = []
let currentWorktree = null

for (const line of listOutput.split('\n')) {
  if (line.startsWith('worktree ')) {
    currentWorktree = { path: line.replace('worktree ', '').trim() }
    worktrees.push(currentWorktree)
  } else if (line.startsWith('branch ') && currentWorktree) {
    currentWorktree.branch = line.replace('branch ', '').trim()
  }
}

const currentCwd = resolve(process.cwd()).toLowerCase()
const targets = worktrees.filter(wt => {
  const normPath = resolve(wt.path).toLowerCase()
  if (normPath === currentCwd) return false
  const name = basename(wt.path)
  return name.includes(pattern)
})

if (targets.length === 0) {
  console.log(`No worktrees matching "${pattern}" found to clean up.`)
  process.exit(0)
}

console.log(`Cleaning up ${targets.length} worktree(s) matching "${pattern}"...`)

for (const target of targets) {
  const name = basename(target.path)
  console.log(`- Removing ${name} (${target.path})...`)

  const removed = run(`git worktree remove --force "${target.path}"`)
  if (!removed) {
    // If locked on Windows, prune metadata directly
    run(`git worktree prune`)
  }

  if (existsSync(target.path)) {
    try {
      rmSync(target.path, { force: true, maxRetries: 5, recursive: true, retryDelay: 500 })
      console.log(`  ✓ Directory deleted`)
    } catch (err) {
      console.warn(`  ! Could not fully remove directory: ${err.message}`)
    }
  } else {
    console.log(`  ✓ Worktree removed`)
  }
}

run('git worktree prune')
console.log('Worktree cleanup complete.')
