<!-- Site Header -->
<header class="header border">
	<a href="/templates/blog" class="fs-s"><strong>Drop In</strong></a>
	<nav>
		<ul>
			<li><a href="/templates/blog">Blog</a></li>
			<li><a href="/templates/blog">About</a></li>
			<li><a href="/templates/blog">Newsletter</a></li>
		</ul>
	</nav>
</header>

<!-- Article + Sidebar -->
<main class="layout-readable center" style="padding-block: var(--vs-xl);">
	<div class="layout-sidebar invert">
		<!-- Sidebar (first in DOM, rendered on right by .invert) -->
		<aside class="stack" style="--gap: var(--vs-l); position: sticky; top: var(--pad-xl); align-self: start;">
			<!-- Table of Contents -->
			<nav class="toc" aria-label="Table of contents">
				<h4>On this page</h4>
				<ol>
					<li><a href="#why-accessibility" aria-current="true">Why Accessibility Matters</a></li>
					<li><a href="#core-principles">Core Principles</a></li>
					<li>
						<a href="#building-components">Building Your First Component</a>
						<ol>
							<li><a href="#semantic-html">Start with Semantic HTML</a></li>
							<li><a href="#when-aria">When You Need ARIA</a></li>
						</ol>
					</li>
					<li>
						<a href="#keyboard-navigation">Keyboard Navigation</a>
						<ol>
							<li><a href="#focus-management">Focus Management</a></li>
						</ol>
					</li>
					<li><a href="#testing">Testing for Accessibility</a></li>
					<li><a href="#conclusion">Conclusion</a></li>
				</ol>
			</nav>

		</aside>

		<!-- Main Article (second in DOM, rendered on left by .invert) -->
		<article class="stack" style="--gap: var(--vs-m);">
			<!-- Breadcrumbs -->
			<nav class="breadcrumbs fs-xs" aria-label="Breadcrumb">
				<ul class="no-list">
					<li><a href="/templates/blog">Blog</a></li>
					<li><a href="/templates/blog">Accessibility</a></li>
					<li aria-current="page">Building Accessible Web Components</li>
				</ul>
			</nav>

			<!-- Article Header -->
			<header class="stack" style="--gap: var(--vs-s);">
				<div class="cluster">
					<span class="tag" style="--tag-color: var(--blue);">Accessibility</span>
					<span class="fs-xs text-muted">10 min read</span>
				</div>
				<h1>Building Accessible Web Components</h1>
				<p class="text-muted">
					A practical guide to creating inclusive components with semantic HTML, ARIA, keyboard navigation, and automated testing.
				</p>
				<div class="cluster">
					<span class="avatar s" aria-hidden="true">MR</span>
					<span class="fs-xs"><strong>Maya Rodriguez</strong></span>
					<span class="fs-xs text-muted">Feb 18, 2026</span>
				</div>
			</header>

			<hr />

			<!-- Article Body -->
			<p>
				Accessibility is not an afterthought. It is a fundamental aspect of building for the web. When we create
				components that work for everyone, we build a better internet. Yet many developers still treat
				accessibility as a checkbox to tick before launch rather than a core design principle.
			</p>

			<p>
				In this guide, we will walk through the process of building web components that are accessible by
				default. We will cover semantic HTML, ARIA attributes, keyboard navigation, and testing strategies that
				ensure your components work for all users, regardless of how they interact with the web.
			</p>

			<h2 id="why-accessibility">Why Accessibility Matters</h2>

			<p>
				Over one billion people worldwide live with some form of disability. That includes visual, auditory,
				motor, and cognitive impairments that affect how people use the web. When we build inaccessible
				components, we are not just failing a compliance checklist. We are actively excluding real people from
				using our products.
			</p>

			<p class="pull-quote">
				Accessibility is not a feature. It is a social responsibility. And it is also the law in many
				jurisdictions.
			</p>

			<p>
				Beyond the ethical imperative, accessible components tend to be better components. They have cleaner
				markup, more predictable behavior, and work across a wider range of devices and input methods. Building
				with accessibility in mind often reveals design flaws that would otherwise go unnoticed.
			</p>

			<h2 id="core-principles">Core Principles</h2>

			<p>
				Before diving into code, it helps to understand the four principles of web accessibility, often
				abbreviated as <strong>POUR</strong>:
			</p>

			<ol>
				<li>
					<strong>Perceivable</strong> — Information must be presentable in ways all users can perceive. This
					means providing text alternatives for images, captions for video, and sufficient color contrast.
				</li>
				<li>
					<strong>Operable</strong> — Interface components must be operable by all users. Every interactive
					element should be reachable and usable via keyboard, and users should have enough time to read and
					interact with content.
				</li>
				<li>
					<strong>Understandable</strong> — Information and operation of the interface must be understandable.
					Use clear language, predictable navigation, and helpful error messages.
				</li>
				<li>
					<strong>Robust</strong> — Content must be robust enough to be interpreted by a wide variety of user
					agents, including assistive technologies. Use semantic HTML and valid markup.
				</li>
			</ol>

			<h2 id="building-components">Building Your First Accessible Component</h2>

			<p>
				Let us build a disclosure widget, a common pattern where clicking a trigger reveals or hides content.
				Many developers reach for a <code>div</code> with a click handler, but the correct approach starts with
				semantic HTML.
			</p>

			<h3 id="semantic-html">Start with Semantic HTML</h3>

			<p>
				The <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code> elements give us disclosure behavior
				for free. No JavaScript required. The browser handles the toggle state, keyboard interaction, and
				communicates the expanded or collapsed state to assistive technologies automatically.
			</p>

			<pre><code>&lt;details&gt;
  &lt;summary&gt;What is web accessibility?&lt;/summary&gt;
  &lt;p&gt;
    Web accessibility means that websites, tools,
    and technologies are designed and developed so
    that people with disabilities can use them.
  &lt;/p&gt;
&lt;/details&gt;</code></pre>

			<p>
				This simple pattern gives you a fully accessible disclosure widget with zero JavaScript. The browser
				provides keyboard support, screen reader announcements, and proper focus management out of the box.
			</p>

			<div class="callout fill" style="--callout-color: var(--blue-1); --callout-border-color: var(--blue-5);">
				<p>
					<strong>Tip:</strong> Always start with native HTML elements before reaching for ARIA. The first
					rule of ARIA is "do not use ARIA if you can use a native HTML element." Native elements come with
					built-in accessibility that is difficult to replicate manually.
				</p>
			</div>

			<h3 id="when-aria">When You Need ARIA</h3>

			<p>
				Sometimes native HTML does not provide the exact pattern you need. In those cases, ARIA attributes
				bridge the gap. For example, if you are building a custom tab interface, you would use
				<code>role="tablist"</code>, <code>role="tab"</code>, and <code>role="tabpanel"</code> to communicate
				the structure to assistive technologies.
			</p>

			<p>
				The key ARIA attributes you will use most often are <code>aria-label</code> for providing accessible
				names, <code>aria-expanded</code> for toggle states, <code>aria-hidden</code> for decorative elements,
				and <code>aria-live</code> for dynamic content updates.
			</p>

			<h2 id="keyboard-navigation">Keyboard Navigation</h2>

			<p>
				Every interactive element in your component must be reachable and operable via keyboard. This is
				non-negotiable. Many users rely on keyboards, switch devices, or other alternative input methods to
				navigate the web.
			</p>

			<blockquote>
				<p>
					If you can not use it with a keyboard, it is not accessible. Full stop. Keyboard accessibility is
					the foundation upon which all other accessibility features are built.
				</p>
			</blockquote>

			<p>
				The essential keyboard interactions to support are <strong>Tab</strong> and <strong>Shift+Tab</strong>
				for moving between interactive elements, <strong>Enter</strong> and <strong>Space</strong> for
				activating buttons and links, <strong>Escape</strong> for closing modals and popups, and
				<strong>Arrow keys</strong> for navigating within composite widgets like menus and tab lists.
			</p>

			<h3 id="focus-management">Focus Management</h3>

			<p>
				Focus management is critical for components that change the DOM. When a modal opens, focus should move
				into it. When it closes, focus should return to the trigger element. When content is dynamically added
				or removed, the focus position should remain logical and predictable.
			</p>

			<pre><code>// Move focus into a modal when it opens
function openModal(dialog) &#123;
  dialog.showModal();
  const firstFocusable = dialog.querySelector(
    'button, [href], input, select, textarea'
  );
  firstFocusable?.focus();
&#125;</code></pre>

			<h2 id="testing">Testing for Accessibility</h2>

			<p>
				Automated testing catches roughly 30 to 50 percent of accessibility issues. The rest require manual
				testing. A solid testing strategy combines both approaches.
			</p>

			<h3>Automated Testing</h3>

			<p>
				Tools like <code>axe-core</code> and Lighthouse can catch common issues such as missing alt text, low
				contrast ratios, and missing form labels. Integrate these into your CI pipeline so regressions are
				caught early.
			</p>

			<h3>Manual Testing Checklist</h3>

			<p>For every component you build, verify the following:</p>

			<ul>
				<li>Navigate the entire component using only the keyboard</li>
				<li>Test with a screen reader (VoiceOver on macOS, NVDA on Windows)</li>
				<li>Verify the component works at 200% browser zoom</li>
				<li>Check that focus indicators are visible and logical</li>
				<li>Ensure color is not the only means of conveying information</li>
				<li>Test with reduced motion preferences enabled</li>
			</ul>

			<div class="callout warning fill" style="--callout-color: var(--yellow-1); --callout-border-color: var(--yellow-5);">
				<p>
					<strong>Warning:</strong> Do not rely solely on automated tools. They cannot detect issues like
					illogical tab order, missing context for screen readers, or confusing interaction patterns. Manual
					testing with real assistive technologies is essential.
				</p>
			</div>

			<h2 id="conclusion">Conclusion</h2>

			<p>
				Building accessible web components is not about adding complexity. It is about starting with the right
				foundation. Use semantic HTML first, layer on ARIA only when needed, ensure keyboard operability, and
				test with real assistive technologies.
			</p>

			<p>
				The web was designed to be universal. Every component we build should honor that principle. When we
				prioritize accessibility, we create experiences that work for everyone, and that is always worth the
				effort.
			</p>

			<hr />

			<!-- Author Bio -->
			<div class="box cluster gradient-surface" style="--gap: var(--vs-base);">
				<span class="avatar l" aria-hidden="true">MR</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<strong>Maya Rodriguez</strong>
					<p class="fs-xs text-muted">
						Maya is a front-end engineer and accessibility advocate with over a decade of experience building
						inclusive web applications. She writes about HTML, CSS, and the intersection of design and
						accessibility.
					</p>
				</div>
			</div>

			<!-- Related Articles -->
			<section class="stack" style="--gap: var(--vs-s);">
				<h3>Related Articles</h3>
				<div class="layout-card" style="--min-card-width: 200px;">
					<a href="/templates/blog" class="card stack" style="--gap: 0; text-decoration: none; color: var(--fg);">
						<div class="card-body stack" style="--gap: var(--vs-xs);">
							<span class="tag" style="--tag-color: var(--purple);">CSS</span>
							<strong>CSS Custom Properties Deep Dive</strong>
							<span class="fs-xs text-muted">8 min read</span>
						</div>
					</a>
					<a href="/templates/blog" class="card stack" style="--gap: 0; text-decoration: none; color: var(--fg);">
						<div class="card-body stack" style="--gap: var(--vs-xs);">
							<span class="tag" style="--tag-color: var(--teal);">Design</span>
							<strong>Design Tokens in Practice</strong>
							<span class="fs-xs text-muted">6 min read</span>
						</div>
					</a>
					<a href="/templates/blog" class="card stack" style="--gap: 0; text-decoration: none; color: var(--fg);">
						<div class="card-body stack" style="--gap: var(--vs-xs);">
							<span class="tag" style="--tag-color: var(--orange);">Components</span>
							<strong>The State of Web Components</strong>
							<span class="fs-xs text-muted">12 min read</span>
						</div>
					</a>
				</div>
			</section>
		</article>
	</div>
</main>

<!-- Newsletter -->
<section class="section surface">
	<div class="layout-readable center">
		<div class="card" style="max-width: 860px; margin-inline: auto;">
			<div class="card-body stack text-center" style="align-items: center; --gap: var(--vs-m);">
				<h3>Stay in the loop</h3>
				<p class="text-muted narrow">Get weekly articles on web development, accessibility, and CSS delivered to your inbox. No spam, unsubscribe anytime.</p>
				<div class="input-group" style="max-width: 400px;">
					<input type="email" placeholder="you@example.com" aria-label="Email address" />
					<button class="primary">Subscribe</button>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="footer" style="border-top: var(--border-1); padding: var(--vs-l) var(--pad-l);">
	<div class="layout-readable center split">
		<nav>
			<ul class="no-list cluster">
				<li><a href="/templates/blog" class="fs-xs">Blog</a></li>
				<li><a href="/templates/blog" class="fs-xs">About</a></li>
				<li><a href="/templates/blog" class="fs-xs">RSS</a></li>
				<li><a href="/templates/blog" class="fs-xs">Privacy</a></li>
			</ul>
		</nav>
		<p class="fs-xs text-muted">2026 Drop In. All rights reserved.</p>
	</div>
</footer>
