## Issue Tracking with Dex

**IMPORTANT**: This project uses **Dex** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why Dex?

- Repo-native tasks stored in `.dex/` and committed
- No git hooks required
- Simple CLI with rich context/results
- Prevents duplicate tracking systems and confusion

### Quick Start

**List work:**

```bash
npx -y @zeeg/dex list
npx -y @zeeg/dex list --all
```

**Create new tasks:**

```bash
npx -y @zeeg/dex create -d "Title" --context "Full context..."
npx -y @zeeg/dex create -d "Subtask" --context "Details" --parent <task-id>
```

**Complete work:**

```bash
npx -y @zeeg/dex complete <task-id> --result "What changed + verification"
```

### Workflow for AI Agents

1. **Check work**: `npx -y @zeeg/dex list`
2. **Create tasks** with rich context when new work is discovered
3. **Work on it**: Implement, test, document
4. **Complete**: `npx -y @zeeg/dex complete <task-id> --result "..."`
5. **Commit together**: Always commit the `.dex/` directory with code changes so task state stays in sync

### Managing AI-Generated Planning Documents

AI assistants often create planning and design documents during development:

- PLAN.md, IMPLEMENTATION.md, ARCHITECTURE.md
- DESIGN.md, CODEBASE_SUMMARY.md, INTEGRATION_PLAN.md
- TESTING_GUIDE.md, TECHNICAL_DESIGN.md, and similar files

**Best Practice: Use a dedicated directory for these ephemeral files**

**Recommended approach:**

- Create a `history/` directory in the project root
- Store ALL AI-generated planning/design docs in `history/`
- Keep the repository root clean and focused on permanent project files
- Only access `history/` when explicitly asked to review past planning

**Example .gitignore entry (optional):**

```
# AI planning documents (ephemeral)
history/
```

**Benefits:**

- ✅ Clean repository root
- ✅ Clear separation between ephemeral and permanent documentation
- ✅ Easy to exclude from version control if desired
- ✅ Preserves planning history for archeological research
- ✅ Reduces noise when browsing the project

### CLI Help

Run `npx -y @zeeg/dex <command> --help` to see all available flags for any command.
For example: `npx -y @zeeg/dex create --help` shows `--parent` and `--blocked-by`.

### Important Rules

- ✅ Use Dex for ALL task tracking
- ✅ Dex tasks live in `.dex/` and are committed
- ✅ No git hooks required
- ✅ Dex IDs are ephemeral; do NOT put them in commits/PRs
- ✅ Use rich `--context` and `--result`
- ✅ Store AI planning docs in `history/` directory
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems
- ❌ Do NOT clutter repo root with planning documents

For more details, see README.md and QUICKSTART.md.
