<div
	class="layout-sidebar fill wide"
	style="color-scheme: dark; background: var(--bg); color: var(--fg); --primary: #24bf73;"
>
	<aside popover="auto" id="chat-sidebar" class="drawer stack surface" style="padding: var(--pad-l); border-inline-end: var(--border-1); --surface-bg: var(--fg-05); --gap: var(--vs-s);">
		<div class="stack" style="--gap: var(--vs-xs);">
			<div class="split center">
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>All agents</strong></p>
					<p class="text-faint fs-xs">Current context: alex</p>
				</div>
				<span class="chip">Forest</span>
			</div>
			<button class="primary" type="button">New Chat</button>
			<input type="search" placeholder="Search chats..." />
		</div>
		<nav class="sidebar-nav compact">
			<a href="/templates/ai-chat" aria-current="page">
				<span class="avatar s bordered" aria-hidden="true">A</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>Testing one-two, weather check</strong></p>
					<p class="text-faint fs-xs">alex - Today</p>
				</div>
			</a>
			<a href="/templates/ai-chat">
				<span class="avatar s" aria-hidden="true">M</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>Can you write me a show outline...</strong></p>
					<p class="text-faint fs-xs">Max (Scott) - Today</p>
				</div>
			</a>
			<a href="/templates/ai-chat">
				<span class="avatar s" aria-hidden="true">J</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>I need help deciding between tools...</strong></p>
					<p class="text-faint fs-xs">Jordan - 2/21/2026</p>
				</div>
			</a>
			<a href="/templates/ai-chat">
				<span class="avatar s" aria-hidden="true">S</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>Hi Sharla, I have been having...</strong></p>
					<p class="text-faint fs-xs">Sharla - 2/18/2026</p>
				</div>
			</a>
			<a href="/templates/ai-chat">
				<span class="avatar s" aria-hidden="true">K</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>Is there any actual science...</strong></p>
					<p class="text-faint fs-xs">Kai - 2/12/2026</p>
				</div>
			</a>
		</nav>
	</aside>

	<section class="app-shell surface" style="--surface-bg: var(--fg-05);">
		<header class="header border">
			<div class="cluster" style="--gap: var(--vs-xs);">
				<button class="drawer-toggle minimal" popovertarget="chat-sidebar" aria-label="Open sidebar" style="padding: 0;">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
				</button>
				<span class="avatar bordered" aria-hidden="true">HB</span>
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>Homebase Concierge</strong></p>
					<p class="text-faint fs-xs">Store Ops Assistant</p>
				</div>
			</div>
			<div class="cluster" style="--gap: var(--vs-xs);">
				<span class="chip">Forest</span>
				<span class="chip">GPT-4.1</span>
			</div>
		</header>

		<main class="hide-scrollbar momentum-scroll">
			<div class="chat-thread">
				<div class="chat-row">
					<article class="chat-message stack" style="--gap: var(--vs-xs);">
						<p class="text-faint fs-xs"><strong>Assistant</strong> - 11:14 AM</p>
						<div class="bubble">
							<p>Sky is still clear across your locations.</p>
							<ul>
								<li>Wind: 4.5 mph</li>
								<li>Humidity: 46%</li>
							</ul>
						</div>
					</article>
				</div>

				<div class="chat-row self">
					<article class="chat-message stack text-end" style="--gap: var(--vs-xs);">
						<p class="text-faint fs-xs"><strong>You</strong> - 11:14 AM</p>
						<div class="bubble" style="--bubble-bg: var(--green-1); --bubble-border: var(--green-5);">
							<p>Run heartbeat smoke check now.</p>
						</div>
					</article>
				</div>

				<div class="chat-row">
					<article class="chat-message stack" style="--gap: var(--vs-xs);">
						<p class="text-faint fs-xs"><strong>Assistant</strong> - 11:47 AM</p>
						<div class="bubble">
							<p>HEARTBEAT_OK</p>
							<p>All endpoints reported healthy in 143ms.</p>
						</div>
					</article>
				</div>

				<div class="chat-row self">
					<article class="chat-message stack text-end" style="--gap: var(--vs-xs);">
						<p class="text-faint fs-xs"><strong>You</strong> - 11:47 AM</p>
						<div class="bubble" style="--bubble-bg: var(--green-1); --bubble-border: var(--green-5);">
							<p>Great. Keep this thread pinned for shift handoff.</p>
						</div>
					</article>
				</div>
			</div>
		</main>

		<footer style="padding: var(--pad-m); border-block-start: var(--border-1);">
			<form class="chat-composer" action="/templates/ai-chat" method="get">
				<div class="input-group" style="flex: 1;">
					<input type="text" placeholder="Your message..." />
					<button class="primary" type="submit">Send</button>
				</div>
			</form>
		</footer>
	</section>
</div>
