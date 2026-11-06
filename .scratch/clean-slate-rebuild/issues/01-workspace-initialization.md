# 01: Workspace Initialization and Root App Shell

**What to build:** Initialize the dedicated rewrite branch, eliminate legacy clutter, and set up a clean root-level Next.js 16 application with pnpm, Tailwind CSS v4, shadcn/ui primitives, and target agent skills.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Create and checkout branch `refactor/clean-slate-rebuild` from `main`
- [ ] Remove legacy Python `outreach_crew`, prototype `template/` files, and root-level migration scripts (backed up on `legacy` branch)
- [ ] Initialize clean root Next.js 16 project with TypeScript, `pnpm`, and `src/` directory layout
- [ ] Configure Tailwind CSS v4 directives and `shadcn/ui` base primitives
- [ ] Install target Matt Pocock agent skills in `.agents/skills/` (`drizzle-orm`, `better-auth`, `shadcn-ui`, `tailwind-v4`, `next-app-router`)
- [ ] Root smoke test: verify the development server boots cleanly via `pnpm dev` and passes `pnpm build`
