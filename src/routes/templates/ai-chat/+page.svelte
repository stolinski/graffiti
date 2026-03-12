<section
	class="app-shell gradient-surface auto-color"
	style="--app-shell-min-height: calc(100dvh - 6rem); --bg-color: #07140f; --bg: #07140f; --fg: #e7f2ea; --fg-05: rgb(231 242 234 / 0.05); --fg-1: rgb(231 242 234 / 0.1); --fg-2: rgb(231 242 234 / 0.2); --fg-3: rgb(231 242 234 / 0.3); --fg-4: rgb(231 242 234 / 0.4); --fg-5: rgb(231 242 234 / 0.5); --fg-6: rgb(231 242 234 / 0.6); --fg-7: rgb(231 242 234 / 0.75); --fg-8: rgb(231 242 234 / 0.9); --border-1: solid 1px var(--fg-2); --border-2: solid 2px var(--fg-2); --primary: #24bf73; --accent: #24bf73;"
>
	<main class="layout-sidebar wide" style="--layout-gap: 0;">
		<aside
			class="app-shell surface"
			style="--surface-bg: #06110d;"
		>
			<header class="header border" style="--gap: var(--vs-s); padding: var(--pad-m);">
				<div class="stack" style="--gap: var(--vs-xs);">
					<p><strong>All agents</strong></p>
					<p class="text-faint fs-xs">Current context: alex</p>
				</div>
				<span class="chip">Forest</span>
			</header>

			<main class="hide-scrollbar momentum-scroll" style="padding: var(--pad-m);">
				<div class="stack" style="--gap: var(--vs-s);">
					<div class="stack" style="--gap: var(--vs-xs);">
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
				</div>
			</main>
		</aside>

		<section
			class="app-shell surface"
			style="--surface-bg: #071712; --pad-l: 1rem; --pad-m: 0.65rem;"
		>
			<header class="header border" style="--gap: var(--vs-s);">
				<div class="cluster" style="--gap: var(--vs-s);">
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
				<div class="chat-thread" style="--chat-thread-padding: var(--pad-l); --chat-thread-gap: var(--pad-m);">
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
							<div class="bubble" style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);">
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
							<div class="bubble" style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);">
								<p>Great. Keep this thread pinned for shift handoff.</p>
							</div>
						</article>
					</div>
				</div>
			</main>

			<footer style="padding: var(--pad-m); border-block-start: var(--border-1);">
				<form class="chat-composer" action="/templates/ai-chat" method="get" style="width: 100%;">
					<div class="input-group" style="flex: 1;">
						<input type="text" placeholder="Your message..." />
						<button class="primary" type="submit">Send</button>
					</div>
				</form>
			</footer>
		</section>
	</main>
</section>
