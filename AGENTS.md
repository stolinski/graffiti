# What this library is

The standards-first, full-featured CSS library for the modern web.
Utilities, elements, blocks, and templates. Highly configurable. Endlessly themeable. Zero JavaScript. Works with your favorite framework or straight-up HTML.

## Key Concepts

- Encapsulation of styles in single classes or directly on elements, this is not a utility first css library like tailwind
- Composability - Classes can be used together to compose layouts, full designs and custom systems
- Customization - The entire system is intended to be a base layer that can be completely transformed with a handful of CSS vars defined at the :root level or component level.
- Hyper Modern Standards - Using the latest features in CSS and HTML to replace JavaScript functionality


## Authoring `src/lib/drop-in.css`

Every primary class definition and every token at `:root` inside `@layer base` requires a structured descriptive annotation (`@pattern`, `@pattern-group`, `@token`, or `@token-group`). Every custom property registered, declared, or consumed in the file must also match exactly one four-tier `@token-set`; new private calculations use `--_component-*`. `pnpm lint:graffiti` enforces both contracts, blocks private-token references in consumer/agent docs, and emits Registry v2. Full rules and examples are in [docs/ANNOTATION-SPEC.md](docs/ANNOTATION-SPEC.md).

## Authoring docs demos

Demos live in `src/docs/demos/*.svelte` and are auto-discovered (`registry.ts`). Each one renders the live preview **and** supplies the source shown in the collapsible "Code" panel. `CodeExample` auto-detects the language: plain markup highlights as `html`, anything with Svelte syntax (`<script>`, `{@html}`, `{#each}`, runes, …) highlights as `svelte`.

**Graffiti is a CSS library, not a Svelte one. The Code panel must always display framework-free HTML.** Never let Svelte syntax leak into what users see and copy.

Most demos are pure markup, so their `.svelte` source already reads as HTML — nothing extra needed. The problem case is a demo that *must* use a Svelte construct to render. The known example: the customizable-`<select>` pattern (`appearance: base-select`, used by `.reactions`). Svelte's compiler rejects the required native nesting — `<button>`/`<selectedcontent>` inside `<select>`, and `<span>` inside `<option>` (`node_invalid_placement`) — even on current Svelte (5.43+). The only way to render it is `{@html}` with the markup as a string. That's a render-time workaround, **not** something users should ever see.

**Mechanism — `.html` companion file.** A demo `<Name>.svelte` may have a sibling `<Name>.html`. When present, `registry.ts` shows that hand-authored HTML in the Code panel while the `.svelte` still renders the preview. Rule of thumb:

- Demo renders as plain markup → just the `.svelte`, no companion.
- Demo needs Svelte to render but should *display* as HTML → add `<Name>.html` with the clean, copy-pasteable markup.

Keep the `.html` companion in sync with whatever the `.svelte` actually renders. Reference implementation: `src/docs/demos/Reactions.svelte` (renders via `{@html}`) + `src/docs/demos/Reactions.html` (what the Code panel shows). Do **not** "fix" such a demo by watering down the library CSS to dodge the Svelte compiler — the library code stays faithful; the docs harness adapts.

## Browser Testing

When using chrome-devtools MCP or any browser automation, **always use the port defined in `vite.config.ts`** (currently `6124`). Do NOT assume default ports like `5173`.

```
http://localhost:6124
```

---

## Git Safety

**NEVER run `git revert` without explicit user permission.**

This command rewrites history and can cause significant problems. If you think a revert is needed:

1. **STOP** and explain why you think a revert is necessary
2. **ASK** the user: "I believe we need to revert [commit]. May I proceed?"
3. **WAIT** for explicit approval before running any revert command

Other destructive git commands that also require explicit permission:

- `git reset --hard`
- `git push --force`
- `git clean -fd`
- `git checkout -- .` (discarding all changes)

---

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
npx -y @zeeg/dex create "Title" --description "Full context..."
npx -y @zeeg/dex create "Subtask" --description "Details" --parent <task-id>
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

<!-- This section is maintained by the coding agent via lore (https://github.com/BYK/opencode-lore) -->
<!-- End lore-managed section -->
