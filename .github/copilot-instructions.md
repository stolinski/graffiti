# GitHub Copilot Instructions for Dex

## Project Overview

This repository uses Dex for task tracking via `npx -y @zeeg/dex`. Dex tasks are stored in `.dex/` and committed.

## Issue Tracking with Dex

**CRITICAL**: Use Dex for ALL task tracking. Do NOT create markdown TODO lists.

### Essential Commands

```bash
npx -y @zeeg/dex list
npx -y @zeeg/dex list --all
npx -y @zeeg/dex create -d "Title" --context "Full context..."
npx -y @zeeg/dex create -d "Subtask" --context "Details" --parent <task-id>
npx -y @zeeg/dex complete <task-id> --result "What changed + verification"
```

### Workflow

1. Check work with `npx -y @zeeg/dex list`
2. Create tasks with rich `--context` when new work is discovered
3. Complete tasks with detailed `--result`
4. Commit `.dex/` together with related code changes

## Important Rules

- ✅ Dex tasks live in `.dex/` and are committed
- ✅ No git hooks required
- ✅ Dex IDs are ephemeral; do NOT put them in commits/PRs
- ✅ Use rich `--context` and `--result`
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

---

**For detailed workflows, see [AGENTS.md](../AGENTS.md)**
