# Aesthetic Guide

This file is about **output quality**, not markup correctness. The existing skill catches invented classes, wrong roles, inline-style sprawl — but markup that passes the contract can still feel cheap. Other agents tend to fail here. This file is the corrective.

Read this **after** `GRAFFITI_SYSTEM.md` and **before** writing final markup. The system contract gets you valid Graffiti; this file gets you Graffiti that looks like Scott Tolinski wrote it.

---

## The substrate principle

Graffiti is **not a look**. It's a substrate — a set of tokens, layouts, components, and elements that take any look you point them at. The implication: **a Graffiti page is only as good as the content + assets + tokens you bring to it.** Default canvas + slop content reads as slop; default canvas + sharp content reads as a magazine.

Three commitments you must make BEFORE writing markup:

1. **Voice.** What's the page's tone? Editorial-restrained? Technical-declarative? Product-direct? Pick one and stay in it.
2. **Imagery.** What do the visuals actually look like? Real photography? Geometric placeholders? Numbered diagrams? Never default to "AI-generated SVG icons that vaguely depict the feature."
3. **System.** Which theme? Which primary? Which radius scale (do the brand's surfaces want hard or pillow)? Decide once, apply consistently.

If you can't answer all three, ask the user — don't invent answers.

---

## Voice — what Graffiti copy actually sounds like

The Graffiti homepage, landing template, and docs share a tight voice. Match it.

### The four rules

1. **Declarative, never breathless.** "Real pages. Real layouts. Only Graffiti." not "Beautifully crafted, blazing-fast components for the next generation of the web."
2. **Specific, not aspirational.** Use real-looking numbers (`80%`, `8 seconds`, `99.99% SLA`, `D30 retention dropped 4.1pp`). Refuse vague superlatives.
3. **Direct address.** "You" are the developer. The system "handles the hard parts so you don't have to."
4. **Sentence case headings.** "Ship faster with less complexity." Never title case unless the brand demands it.

### Quick voice tests

A heading or paragraph fails the voice test if it includes:

| Phrase                                                  | Why it fails                                  | Replacement direction               |
| ------------------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| "Revolutionize your workflow"                           | Aspirational, not specific                    | Name the actual change              |
| "Cutting-edge AI-powered solutions"                     | Marketing-speak; no information               | What does it do?                    |
| "Empower your team to do their best work"               | Generic                                       | Empower them to do **what** exactly |
| "Seamlessly integrate with your existing tools"         | "Seamlessly" is a tell                        | Name the tools, name the integration|
| "Beautifully crafted with attention to detail"          | Telling, not showing                          | Cut entirely                        |
| "Lightning-fast performance"                            | Adverb pile                                   | Quote a real number                 |
| "Industry-leading"                                      | Unverifiable claim                            | Cut                                 |

### Voice templates that work

- Hero h1: `Ship X with less Y.` (concrete verb, concrete noun, concrete trade)
- Hero subhead: lead with what the product does, follow with how, end with for whom.
- Feature card heading: noun phrase or "verb the noun." Six words max.
- Feature card body: 18–30 words. Cite a real mechanism or number if you can.
- Stat-card label: 1–3 words, sentence case ("Total revenue", "Active users").
- Tag: single noun or status. Never a sentence.

### Real examples from the library (lift verbatim if you need a baseline)

> "The standards-first, full-featured CSS library for the modern web."
> "Push to main and your changes are live in under 8 seconds."
> "Every choice is a token away from change."
> "It works with HTML. Of course it works with HTML."

If you're writing a hero and nothing comes out, write a one-line voiceover for what the page would say if it were a person, in plain words. Then trim adjectives.

---

## Density — how much content per screen

**One thousand no's for every yes.** This is the single most-violated principle in AI-generated Graffiti pages.

### What goes wrong

Agents tend to fill empty space with filler — extra feature cards, fake testimonials, decorative numbers, irrelevant FAQ — because empty space "feels unfinished." It isn't. White space is Graffiti's primary tool. The framework's whole vibe rests on rhythm and restraint.

### Density heuristics

| Surface             | Aim for                                              | Red flag                                            |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| Hero                | 1 headline + 1 subhead + 1–2 CTAs                    | "What if we added a feature grid right here too"    |
| Feature grid        | 3–6 items, each ≤30 words                            | 9 items because the grid feels empty                |
| Pricing             | 3 tiers, one `.card.featured`                        | 4-tier comparison matrix unless explicitly asked    |
| Dashboard KPI row   | 3–5 stat-cards                                       | 8 cards because we have 8 KPIs                      |
| Chat thread mockup  | 4–8 turns showing variety                            | 25-turn novel of fake conversation                  |
| Settings page       | 1 concern per `<fieldset>`, 4–8 rows                 | One mega-form with 30 fields                        |
| Blog index          | 6–9 posts                                            | 24 posts on the home page                           |
| Docs sidebar        | 3–5 top sections, 4–8 items each                     | Every page in the IDE laid bare                     |

### The "would you delete it?" test

Before adding any element, ask: **if I removed this, would anyone notice?** If the answer is "probably not," cut it. Reuse the saved space as breathing room (more `--vs-l` between sections, wider line-length, bigger headings — not more content).

---

## Imagery — placeholders are better than slop

Graffiti **ships no stock photography, no illustrations, no characters.** The official position is "imagery is user-supplied." Other agents respond to this by inventing terrible SVGs that vaguely depict the feature. Don't.

### Rules

1. **Never hand-draw an SVG icon more complicated than a square, circle, diamond, or arrow.** Anything else: use a real icon set (see below) or a placeholder.
2. **Use `.box.invisible` + a `gradient-*` class + a monospace label** as the canonical "this is where a photo goes" placeholder. The framework's own templates do this.
3. **Use `<picture>` / `<img alt="...">`** for real imagery — even if you're inserting a placeholder, write the alt that the final image would have.
4. **Never use emoji as a feature icon** unless the brand explicitly does (and Graffiti doesn't). The framework's `landing` template uses Unicode escapes (`&#9889;`) inside `<span class="icon">` so they can be swapped for SVGs later — that's a placeholder pattern, not a final aesthetic.
5. **Do not invent "abstract" hero illustrations.** A flat `.gradient-aurora` is more in-tone than a hand-drawn isometric workspace.

### The placeholder pattern (memorize)

```html
<div class="box invisible gradient-slate" style="aspect-ratio: 16/9; display: grid; place-items: center;">
  <code class="text-faint">product shot · 1600×900</code>
</div>
```

Use this **liberally**. Captioning what should go there is more useful to the user than your attempt to render it.

### Icons — policy

Graffiti ships no icon set and blesses none.

1. **Check the project first.** If the project already imports an icon library (look at `package.json` and existing imports), use that one. Consistency with the host project beats every other preference.
2. **If no icon library exists**, use the framework's placeholder pattern — `<span class="icon" aria-hidden="true">` with a single Unicode glyph or basic shape — until the user supplies a real icon source.
3. **Never invent SVG icons** more complex than a basic shape (circle, square, arrow, chevron, plus, minus, X, check). Anything else is slop.
4. **Never use emoji as feature icons** in non-brand contexts.
5. **Never mix icon sets on one page.** Pick one, stay in it.
6. Do not recommend or wire up a specific icon CDN inside generated markup unless the user asked for it. Cross-site script tags belong in the project's setup, not in your output. Pick one.

---

## Pick a theme, pick a primary, then stop

Stock themes (verify availability against `src/lib/themes/` in the consuming project — only reference what exists):

- `theme-soft-consumer`
- `theme-editorial`
- `theme-paper`
- `theme-system`
- `theme-neon-arcade`
- `theme-studio`
- `theme-signal`
- `theme-lumen`
- `theme-schematic`

Apply by class. **Apply high in the tree** — `<html>` for whole-app, section root for one feature. Don't theme by inline `--bg` / `--fg` swap.

```html
<html class="theme-editorial">  ...  </html>
<section class="theme-system">  ...  </section>
```

### Picking guidance

| Surface or feeling                            | Theme                  |
| --------------------------------------------- | ---------------------- |
| Generic SaaS app (light consumer)             | `theme-soft-consumer`  |
| Long-form essay, recipe, book                 | `theme-editorial`      |
| Financial / ops / IDE / dense data            | `theme-system`         |
| Print-shaped, government, official document   | `theme-paper`          |
| Arcade / game / play product                  | `theme-neon-arcade`    |
| Design tool / creative workshop               | `theme-studio`         |
| Inbox / async messaging / triage              | `theme-signal`         |
| Dark hero / cinematic AI / late-night tool    | `theme-lumen`          |
| Technical schematic / field manual / hardware | `theme-schematic`      |

If unsure, default to no theme (the canvas). The canvas is meant to look unbranded — that's the point. **Picking "no theme" is a deliberate decision; not picking is not.**

### Global vs local theming — when to scope which

- **Global** (on `<html>` or `<body>`): the whole product has one identity. Most apps live here.
- **Local** (on a section root): one feature/area inside a larger product has a distinct mode — e.g. a docs subdomain inside an app, a chat surface inside a dashboard, a marketing page embedded in a console app. Local themes still re-derive opaque scales correctly because any `theme-*` class triggers the framework's full re-declaration.
- **Inline `--primary` swap**: only when nothing else needs to change. Buttons, links, chips, focus rings follow `--primary`; per-hue opaque surfaces (e.g. a tinted bubble background) do not.

### Token override pattern

Inside a theme, you can still swap the brand primary:

```html
<section class="theme-system" style="--primary: var(--green);">
  …
</section>
```

That's the **only** acceptable inline override at the page-shell level. Don't override `--bg`, `--fg`, `--fg-1`, the radii, or the shadow scale inline — those belong to the theme.

---

## Anti-slop checklist — fail this before you ship

Run every page through these. Each one is a signal the output is heading toward generic-AI territory.

- [ ] **No gradient backgrounds on every section.** Reserve gradients for one hero or one card per page. The `landing` template uses `.gradient-aurora` ONCE.
- [ ] **No emoji used as feature icons** in non-brand contexts.
- [ ] **No 3-up "Fast / Secure / Reliable" feature grid** with stock language. If you must do a 3-up, the labels must be specific to this product.
- [ ] **No fake testimonials from "Sarah K., CTO at Acme"** unless the user provided them.
- [ ] **No invented stat-cards** ("10,000+ companies trust us") without a source.
- [ ] **No left-stripe accent containers** masquerading as callouts. The current `.callout` is hairline with a gutter icon; the `.hard` variant was explicitly removed in v4.29 as the slop pattern.
- [ ] **No `border-radius: 12px` on every container** out of habit. Use Graffiti's `--br-*` scale; respect what the theme set.
- [ ] **No "decorative numbers"** added to make a page feel data-rich. If it's not a real number, don't show one.
- [ ] **No hand-drawn SVG of a person, hand, screen, or "abstract shape."**
- [ ] **No "Coming soon" badges as decoration.**
- [ ] **No spinning gradient borders, animated halos, or particle backgrounds.** Graffiti's motion is `linear()` easings and `0.15s` transitions — restraint, not playfulness.
- [ ] **Headings are sentence case.** Title case is a brand decision, not a default.
- [ ] **Body type is 16px+ minimum** for marketing surfaces; never under 14px even in dense UI.
- [ ] **The page commits to one font pairing.** Two max. No third "decorative" font.
- [ ] **You can name the page's purpose in one sentence** without using the word "modern", "powerful", "comprehensive", or "next-generation."

---

## Inspiration anchors (when stuck)

These are public products whose taste matches the various Graffiti themes. Pull references from these mental anchors, not from generic SaaS landing-page galleries.

| Theme              | Anchors                                                   |
| ------------------ | --------------------------------------------------------- |
| (no theme/canvas)  | GitHub primer, Vercel docs (light), Stripe docs           |
| soft-consumer      | Linear, Stripe Atlas, Notion calendar                     |
| editorial          | The New Yorker article pages, Apple Newsroom, Pelican Books |
| paper              | Government grant PDFs, IRS forms, academic journals       |
| system             | Bloomberg terminal, Plaid dashboard, Datadog              |
| neon-arcade        | itch.io, arcade cabinets, Vampire Survivors UI            |
| studio             | Linear, Vercel, v0, Figma, Framer                         |
| signal             | Front, Linear inbox, Superhuman, Loops                    |
| lumen              | ChatGPT, Claude, Arc browser, Perplexity                  |

When picking colors, type, or copy voice, ask: "what would [anchor] do?"

---

## The taste test

Before considering output finished, look at it the way an editor would and ask:

1. **Could I screenshot this and put it in a "good design" gallery?** If not, what's the one thing keeping it out?
2. **Is anything here AI-shaped?** (Generic copy, mid-range gradients, three feature cards that say nothing, emoji icons.)
3. **Does the page commit to a point of view, or is it hedging across three?**
4. **Have I added breathing room generous enough that the content reads as confident, not crowded?**
5. **If I removed half the elements, would it be a worse page or a better one?**

If you'd answer "no / yes / hedging / crowded / better with less," do another pass before finishing.
