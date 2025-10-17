---
"@drop-in/graffiti": minor
---

Separate @drop-in/decks component styles into optional import

Component styles for @drop-in/decks (accordion, dialog, drawer, menu, toast) are now available as a separate import to reduce main bundle size. Users who don't use @drop-in/decks components can now import just the base framework.

**New exports:**
- `@drop-in/graffiti/decks` - Component styles CSS file
- `@drop-in/graffiti/decks/raw` - Component styles as JS module

**Migration:**
If you use @drop-in/decks components, add this import:
```js
import '@drop-in/graffiti/decks'
```

**Bundle size improvement:**
Main CSS bundle is now ~15% smaller for projects that don't use decks components.
