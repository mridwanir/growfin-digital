# 01: Workspace Initialization and Root App Shell

**What to build:** Initialize the dedicated rewrite branch, eliminate legacy clutter, and set up a clean root-level Next.js 16 application with pnpm, Tailwind CSS v4, shadcn/ui primitives, and target agent skills.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Create and checkout branch `refactor/clean-slate-rebuild` from `main`
- [x] Remove legacy Python `outreach_crew`, prototype `template/` files, and root-level migration scripts (backed up on `legacy` branch)
- [x] Initialize clean root Next.js 16 project with TypeScript, `pnpm`, and `src/` directory layout
- [x] Configure Tailwind CSS v4 directives and `shadcn/ui` base primitives
- [x] Install target Matt Pocock agent skills in `.agents/skills/` (deferred: user to install manually)
- [x] Root smoke test: verify the development server boots cleanly via `pnpm dev` and passes `pnpm build`
