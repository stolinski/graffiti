<div class="layout-sidebar fill" style="min-height: 100dvh; --layout-gap: 0px;">
	<aside class="split vertical" style="border-inline-end: var(--border-1); padding: var(--pad-l);">
		<nav class="sidebar-nav">
			<p style="padding: var(--pad-s) var(--pad-m); margin: 0 0 var(--vs-s) 0;"><strong class="fs-s">Acme Inc.</strong></p>
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
		<p class="fs-xs text-faint" style="padding: var(--pad-s) var(--pad-m); margin: 0;">v2.4.1</p>
	</aside>

	<main class="stack" style="padding: var(--pad-xl);">
		<div class="split">
			<h1 class="h3" style="margin: 0;">Dashboard</h1>
			<button class="ghost">Last 30 days</button>
		</div>

		<div class="layout-card" style="--min-card-width: 200px;">
			<div class="stat-card">
				<small>Total Revenue</small>
				<strong>$48,250</strong>
				<span class="tag" style="--tag-color: var(--green);">+12.5%</span>
			</div>
			<div class="stat-card">
				<small>Active Users</small>
				<strong>2,420</strong>
				<span class="tag" style="--tag-color: var(--green);">+8.1%</span>
			</div>
			<div class="stat-card">
				<small>Conversion Rate</small>
				<strong>3.6%</strong>
				<span class="tag" style="--tag-color: var(--red);">-0.4%</span>
			</div>
			<div class="stat-card">
				<small>Support Tickets</small>
				<strong>18</strong>
				<span class="tag" style="--tag-color: var(--green);">-3 from last week</span>
			</div>
		</div>

		<div class="card">
			<header>
				<h2 class="h5" style="margin: 0;">Recent Orders</h2>
			</header>
			<div class="table">
				<table>
					<thead>
						<tr>
							<th>Order</th>
							<th>Customer</th>
							<th>Status</th>
							<th>Amount</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>#3210</td>
							<td>Olivia Martin</td>
							<td><span class="tag" style="--tag-color: var(--green);">Completed</span></td>
							<td>$250.00</td>
							<td>Feb 28, 2026</td>
						</tr>
						<tr>
							<td>#3209</td>
							<td>Jackson Lee</td>
							<td><span class="tag" style="--tag-color: var(--green);">Completed</span></td>
							<td>$150.00</td>
							<td>Feb 27, 2026</td>
						</tr>
						<tr>
							<td>#3208</td>
							<td>Isabella Nguyen</td>
							<td><span class="tag" style="--tag-color: var(--blue);">Processing</span></td>
							<td>$350.00</td>
							<td>Feb 27, 2026</td>
						</tr>
						<tr>
							<td>#3207</td>
							<td>William Kim</td>
							<td><span class="tag" style="--tag-color: var(--blue);">Processing</span></td>
							<td>$450.00</td>
							<td>Feb 26, 2026</td>
						</tr>
						<tr>
							<td>#3206</td>
							<td>Sofia Davis</td>
							<td><span class="tag" style="--tag-color: var(--yellow);">Pending</span></td>
							<td>$550.00</td>
							<td>Feb 26, 2026</td>
						</tr>
						<tr>
							<td>#3205</td>
							<td>Liam Johnson</td>
							<td><span class="tag" style="--tag-color: var(--red);">Cancelled</span></td>
							<td>$200.00</td>
							<td>Feb 25, 2026</td>
						</tr>
						<tr>
							<td>#3204</td>
							<td>Emma Wilson</td>
							<td><span class="tag" style="--tag-color: var(--green);">Completed</span></td>
							<td>$175.00</td>
							<td>Feb 25, 2026</td>
						</tr>
						<tr>
							<td>#3203</td>
							<td>Noah Brown</td>
							<td><span class="tag" style="--tag-color: var(--green);">Completed</span></td>
							<td>$625.00</td>
							<td>Feb 24, 2026</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>
