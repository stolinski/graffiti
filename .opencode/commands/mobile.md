---
description: OpenCode Mobile (QR + push token)
---
Call the `mobile` tool.

Command arguments: $ARGUMENTS

- If $ARGUMENTS is non-empty, call the tool with { token: "$ARGUMENTS" }.
- If $ARGUMENTS is empty, call the tool with no args to print the QR.

Important:
- Do not output analysis/thoughts.
- Only call the tool; return no extra text.

Examples:
- `/mobile`
- `/mobile ExpoPushToken[xxxxxxxxxxxxxx]`