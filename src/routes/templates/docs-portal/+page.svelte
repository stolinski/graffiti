<div class="layout-sidebar fill" style="--layout-gap: 0; min-height: 100dvh;">
	<aside class="surface split vertical" style="border-inline-end: var(--border-1); padding: var(--pad-l);">
		<div class="stack" style="--gap: var(--vs-m);">
			<div class="stack" style="--gap: var(--vs-xs);">
				<p class="fs-xs text-faint">Documentation</p>
				<strong class="fs-s">Graffiti UI</strong>
			</div>

			<div class="search">
				<input type="search" placeholder="Search docs" aria-label="Search documentation" />
			</div>

			<nav class="sidebar-nav" aria-label="Documentation navigation">
				<a href="/templates/docs-portal" aria-current="page">Getting Started</a>
				<a href="/templates/docs-portal">Installation</a>
				<a href="/templates/docs-portal">Layout Utilities</a>
				<a href="/templates/docs-portal">Components</a>
				<details open>
					<summary>Patterns</summary>
					<a href="/templates/docs-portal">Navigation</a>
					<a href="/templates/docs-portal">Data Display</a>
					<a href="/templates/docs-portal">Forms</a>
				</details>
				<a href="/templates/docs-portal">Accessibility</a>
				<a href="/templates/docs-portal">Changelog</a>
			</nav>
		</div>

		<p class="fs-xs text-faint" style="margin: 0;">v1.0 docs</p>
	</aside>

	<div class="app-shell">
		<header class="header border sticky" style="padding-inline: var(--pad-xl);">
			<p class="fs-xs text-faint"><strong>Graffiti Docs</strong> / Template Preview</p>
			<a class="button ghost mini" href="/templates">All Templates</a>
		</header>

		<main style="padding: var(--pad-xl);">
			<div class="layout-sidebar invert fixed" style="--layout-gap: var(--vs-xl); --layout-main-min: 0;">
				<aside class="stack self-start" style="--gap: var(--vs-l);">
					<nav class="toc" aria-label="On this page">
						<h4>On this page</h4>
						<ol>
							<li><a href="/templates/docs-portal#getting-started" aria-current="true">Getting started</a></li>
							<li><a href="/templates/docs-portal#quickstart">Quickstart</a></li>
							<li><a href="/templates/docs-portal#tabs">Tabs</a></li>
							<li><a href="/templates/docs-portal#component-table">Component Table</a></li>
							<li><a href="/templates/docs-portal#faq">FAQ</a></li>
						</ol>
					</nav>
				</aside>

				<article class="stack" style="--gap: var(--vs-xl);">
					<nav class="breadcrumbs fs-xs" aria-label="Breadcrumb">
						<ul class="no-list">
							<li><a href="/templates/docs-portal">Docs</a></li>
							<li><a href="/templates/docs-portal">Guides</a></li>
							<li aria-current="page">Documentation Portal</li>
						</ul>
					</nav>

					<section id="getting-started" class="stack" style="--gap: var(--vs-m);">
						<h1>Getting started</h1>
						<p class="text-muted">
							This template demonstrates a practical docs shell with persistent navigation, content areas, and support
							elements like tabs, data tables, and FAQ blocks.
						</p>
						<div class="callout fill">
							<p>
								<strong>Note:</strong> Every section uses existing Graffiti classes so the structure can be copied
								directly into app docs without custom CSS.
							</p>
						</div>
					</section>

					<section id="quickstart" class="stack" style="--gap: var(--vs-m);">
						<h3>Quickstart</h3>
						<div class="card">
							<div class="card-body stack" style="--gap: var(--vs-s);">
								<p class="text-muted">Install Graffiti and import the stylesheet in your SvelteKit layout:</p>
								<pre><code>npm i @graffiti-css/drop-in
import '@graffiti-css/drop-in';</code></pre>
							</div>
						</div>
					</section>

					<section id="tabs" class="stack" style="--gap: var(--vs-m);">
						<h3>Tabs section</h3>
						<div class="tabs boxed" style="--tab-count: 3;">
							<details name="docs-tabs" open style="--n: 1;">
								<summary>Overview</summary>
								<div>
									<p>
										Use tabs when readers need to scan short alternatives like framework-specific setup notes.
									</p>
								</div>
							</details>
							<details name="docs-tabs" style="--n: 2;">
								<summary>SvelteKit</summary>
								<div>
									<p>Import Graffiti in your root layout and compose sections with semantic HTML and utility classes.</p>
								</div>
							</details>
							<details name="docs-tabs" style="--n: 3;">
								<summary>Static HTML</summary>
								<div>
									<p>The same class stack works in plain HTML pages for framework-agnostic documentation sites.</p>
								</div>
							</details>
						</div>
					</section>

					<section id="component-table" class="stack" style="--gap: var(--vs-m);">
						<h3>Table section</h3>
						<div class="table">
							<table>
								<caption class="visually-hidden">Documentation sections and completion status.</caption>
								<thead>
									<tr>
										<th scope="col">Section</th>
										<th scope="col">Owner</th>
										<th scope="col">Status</th>
										<th scope="col">Updated</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Getting started</td>
										<td>Docs team</td>
										<td><span class="tag success">Published</span></td>
										<td>Mar 8, 2026</td>
									</tr>
									<tr>
										<td>Layout utilities</td>
										<td>Design systems</td>
										<td><span class="tag info">Reviewing</span></td>
										<td>Mar 10, 2026</td>
									</tr>
									<tr>
										<td>Component API</td>
										<td>DX engineering</td>
										<td><span class="tag warning">Draft</span></td>
										<td>Mar 12, 2026</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					<section id="faq" class="stack" style="--gap: var(--vs-m);">
						<h3>FAQ details section</h3>
						<div class="stack" style="--gap: var(--vs-s);">
							<details class="bordered" open>
								<summary>Do I need JavaScript for this layout?</summary>
								<p>No. Navigation, tabs, and disclosures are built with semantic HTML patterns and Graffiti classes.</p>
							</details>
							<details class="bordered">
								<summary>Can I reuse this in another framework?</summary>
								<p>Yes. The markup is framework-agnostic and can be copied into any docs project that includes Graffiti.</p>
							</details>
							<details class="bordered">
								<summary>How should I organize long docs pages?</summary>
								<p>Pair a sidebar nav with a right-side table of contents so readers can move between sections quickly.</p>
							</details>
						</div>
					</section>

					<nav class="pagination" aria-label="Documentation pagination">
						<a class="button ghost" href="/templates/docs-portal">Previous</a>
						<ul>
							<li><a class="button ghost" href="/templates/docs-portal">1</a></li>
							<li><a class="button ghost" href="/templates/docs-portal" aria-current="page">2</a></li>
							<li><a class="button ghost" href="/templates/docs-portal">3</a></li>
						</ul>
						<a class="button ghost" href="/templates/docs-portal">Next</a>
					</nav>
				</article>
			</div>
		</main>
	</div>
</div>
