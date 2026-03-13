<div class="layout-sidebar fill" style="--layout-gap: 0; min-height: 100dvh;">
	<aside class="stack surface" style="padding: var(--pad-l); border-inline-end: var(--border-1); --gap: var(--vs-l);">
		<div class="stack" style="--gap: var(--vs-xs);">
			<p class="fs-xs text-faint">Workspace</p>
			<strong class="fs-s">Acme Inc.</strong>
		</div>

		<nav class="sidebar-nav" aria-label="Dashboard navigation">
			<a href="/templates/dashboard" aria-current="page">Dashboard</a>
			<a href="/templates/dashboard">Projects</a>
			<a href="/templates/dashboard">Team</a>
			<a href="/templates/dashboard">Analytics</a>
			<a href="/templates/dashboard">Messages</a>
			<details open>
				<summary>Settings</summary>
				<a href="/templates/dashboard">General</a>
				<a href="/templates/dashboard">Billing</a>
				<a href="/templates/dashboard">Security</a>
			</details>
		</nav>

		<p class="fs-xs text-faint" style="margin-block-start: auto;">v2.4.1</p>
	</aside>

	<section class="app-shell">
		<header class="header border" style="--gap: var(--vs-m); padding-inline: var(--pad-xl); flex-wrap: wrap;">
			<div class="stack" style="--gap: var(--vs-xs);">
				<h1 class="h3">Dashboard</h1>
				<p class="fs-xs text-muted">Monitor storefront performance and fulfillment activity.</p>
			</div>
			<div class="cluster">
				<button class="ghost" type="button">Last 30 days</button>
				<button class="ghost" type="button">Status: all</button>
				<button class="primary" type="button">Create report</button>
			</div>
		</header>

		<main class="stack" style="padding: var(--pad-xl); --gap: var(--vs-xl);">
			<section class="layout-split">
				<article class="stat-card">
					<small>Total Revenue</small>
					<strong>$48,250</strong>
					<span class="tag success" style="margin-block-start: auto;">+12.5%</span>
				</article>
				<article class="stat-card">
					<small>Active Users</small>
					<strong>2,420</strong>
					<span class="tag success" style="margin-block-start: auto;">+8.1%</span>
				</article>
				<article class="stat-card">
					<small>Conversion Rate</small>
					<strong>3.6%</strong>
					<span class="tag error" style="margin-block-start: auto;">-0.4%</span>
				</article>
				<article class="stat-card">
					<small>Support Tickets</small>
					<strong>18</strong>
					<span class="tag success" style="margin-block-start: auto;">Down 3 this week</span>
				</article>
			</section>

			<article class="card">
				<header class="split center" style="--gap: var(--vs-m);">
					<div class="stack" style="--gap: var(--vs-xs);">
						<h2 class="h5">Recent Orders</h2>
						<p class="fs-xs text-muted">Latest fulfilled and in-flight orders across channels.</p>
					</div>
					<div class="cluster">
						<button class="ghost" type="button">Export CSV</button>
						<button type="button">View all orders</button>
					</div>
				</header>
				<div class="table">
					<table style="min-width: 44rem;">
						<caption class="visually-hidden">Recent orders with status, amount, and order date.</caption>
						<thead>
							<tr>
								<th scope="col">Order</th>
								<th scope="col">Customer</th>
								<th scope="col">Status</th>
								<th scope="col">Amount</th>
								<th scope="col">Date</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>#3210</td>
								<td>Olivia Martin</td>
								<td><span class="tag success">Completed</span></td>
								<td>$250.00</td>
								<td>Feb 28, 2026</td>
							</tr>
							<tr>
								<td>#3209</td>
								<td>Jackson Lee</td>
								<td><span class="tag success">Completed</span></td>
								<td>$150.00</td>
								<td>Feb 27, 2026</td>
							</tr>
							<tr>
								<td>#3208</td>
								<td>Isabella Nguyen</td>
								<td><span class="tag info">Processing</span></td>
								<td>$350.00</td>
								<td>Feb 27, 2026</td>
							</tr>
							<tr>
								<td>#3207</td>
								<td>William Kim</td>
								<td><span class="tag info">Processing</span></td>
								<td>$450.00</td>
								<td>Feb 26, 2026</td>
							</tr>
							<tr>
								<td>#3206</td>
								<td>Sofia Davis</td>
								<td><span class="tag warning">Pending</span></td>
								<td>$550.00</td>
								<td>Feb 26, 2026</td>
							</tr>
							<tr>
								<td>#3205</td>
								<td>Liam Johnson</td>
								<td><span class="tag error">Cancelled</span></td>
								<td>$200.00</td>
								<td>Feb 25, 2026</td>
							</tr>
							<tr>
								<td>#3204</td>
								<td>Emma Wilson</td>
								<td><span class="tag success">Completed</span></td>
								<td>$175.00</td>
								<td>Feb 25, 2026</td>
							</tr>
							<tr>
								<td>#3203</td>
								<td>Noah Brown</td>
								<td><span class="tag success">Completed</span></td>
								<td>$625.00</td>
								<td>Feb 24, 2026</td>
							</tr>
						</tbody>
					</table>
				</div>
			</article>
		</main>
	</section>
</div>
