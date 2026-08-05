# Packed CSS budgets, minified outputs, and feature split decision

Graffiti measures every public CSS export from the installed contents of a
fresh `@drop-in/graffiti@4.31.0` tarball. The checked baseline lives in
[`css-size-budgets.json`](../../css-size-budgets.json). Existing readable
package paths remain unchanged; `@drop-in/graffiti/min` adds a minified layered
root and `@drop-in/graffiti/drop-in.min.css` adds an explicitly flat minified
output.

## Budget policy

Each export is capped independently for raw bytes, level-9 gzip bytes, CSS Tree
rule nodes, declaration nodes, unique class names, and unique declared custom
properties (including `@property`). Local `@import` closures are included. In
particular, `@drop-in/graffiti/themes` measures its index and all eight preset
dependencies rather than the index stub alone.

The checked values are exact maximums, not a percentage allowance. Decreases
pass without rewriting the baseline. Growth, a new or removed CSS export, a
changed target, or a changed local dependency closure fails with per-entry
deltas. `pnpm size:check` and the required CI lane are mutation-free with
respect to the baseline. An intentional contract change is reviewed through
`pnpm size:report`, then accepted explicitly with `pnpm size:update`.

The package smoke independently applies the same budgets to a clean-source
tarball after installation. The standalone size command also checks that every
measured packed CSS file is byte-identical to the freshly generated package
content.

## Minified contract

Both minified files are generated from canonical readable output by the same
CSS Tree parse/generate pass after token-aware comment removal. They are not
separate authored sources. Contract and package tests require deterministic
byte equality with that transform, no shipped comments, valid CSS parsing, and
smaller byte counts. The layered root changed from 179,771 raw / 30,131 gzip
bytes to 130,590 raw / 20,311 gzip bytes while retaining 440 rules, 2,264
declarations, 184 classes, and 622 custom properties.

## Measured feature groups

Feature groups are evidence snapshots, not distributable files or enforced
budgets. Their raw and gzip sizes serialize matching rule subtrees and exclude
shared token declarations and enclosing at-rule bytes, so a real standalone
entry would be larger.

| Candidate      | Raw bytes | Gzip bytes | Rules | Declarations | Classes | Custom properties |
| -------------- | --------: | ---------: | ----: | -----------: | ------: | ----------------: |
| Gradients      |     2,713 |        659 |    11 |           43 |      11 |                 4 |
| Chat/workbench |     6,521 |      1,739 |    55 |          209 |      31 |                 8 |
| Mobile         |     2,929 |      1,041 |    24 |           89 |      15 |                 1 |

No optional bundle is added. Gradients account for only 3.2% of the minified
root's gzip size. Chat/workbench and mobile are also small, and repository
usage does not establish external consumer demand for new request and import
surfaces. The existing `utilities`, `components`, `minimal`, and `standard`
entries already provide coarse-grained choices with tested token closures.

Chat/workbench and mobile also cross feature boundaries: chat extensions
compose with existing `.bubble`, `.chat-thread`, and `.chat-composer` rules;
rail behavior uses container-query mobile collapse; and combined forced-colors
selectors cover workbench tabs and bottom navigation. Splitting those rules
without consumer evidence would turn source organization into a public loading
contract and risk order-dependent accessibility behavior.

## Contract for any future split

Any future optional feature export must be justified by real consumer usage and
must document whether it is additive or standalone. An additive entry must
declare its required root/module import and preserve its canonical layer. A
standalone entry must generate the transitive token closure and global safety
rules. Either form must preserve source order for container queries,
forced-colors rules, and shared selectors; prohibit duplicate definitions when
loaded with the root; receive its own six-metric budget; and pass packed-package
and cascade contract tests before becoming public.
