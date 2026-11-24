# Agent worktree conventions

Guidelines for multi-agent workflows using isolated Git worktrees.

## Creation and setup

When creating an isolated worktree for an implementer subagent:

1. Create the worktree from the base integration branch:

   ```bash
   git worktree add -b feat/ticket-<N> ../wt-ticket-<N> <base-branch>
   ```

2. Install dependencies inside the worktree:

   ```bash
   pnpm install
   ```

   Standard `pnpm install` executes the `prepare` lifecycle hook (`simple-git-hooks && skills sync -y`), synchronizing all required agent skills (such as `tdd`, `code-review`, `drizzle`, `diagnosing-bugs`) into the worktree's `.agents/skills` directory.

   Do not use `--ignore-scripts`. Omitting lifecycle scripts prevents skill synchronization and leaves the subagent without the necessary domain and engineering skills.

## Teardown and cleanup

On Windows and environments with nested `node_modules`, synchronous directory removal (`git worktree remove --force ../wt-ticket-<N>`) can time out when file handles are held by background watchers or language servers.

Use the repo cleanup script:

```bash
pnpm run worktrees:clean [pattern]
```

Or manually decouple git tracking removal from disk deletion:

1. Prune git references first (instantaneous):

   ```bash
   rm -rf .git/worktrees/wt-*
   git worktree prune
   ```

2. Delete the on-disk directory:
   ```bash
   # Windows (CMD)
   cmd.exe /c "rd /s /q ..\wt-ticket-<N>"

   # Unix
   rm -rf ../wt-ticket-<N>
   ```
