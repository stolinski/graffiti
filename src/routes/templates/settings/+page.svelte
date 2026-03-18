<div class="layout-sidebar fill" style="--layout-gap: 0;">
	<aside popover="auto" id="settings-sidebar" class="drawer stack surface" aria-label="Settings navigation panel" style="padding: var(--pad-l); border-inline-end: var(--border-1); --gap: var(--vs-m);">
		<nav class="sidebar-nav" aria-label="Settings navigation">
			<p class="sidebar-nav-heading">
				<strong class="fs-s">Settings</strong>
			</p>
			<a href="/templates/settings" aria-current="page">Profile</a>
			<a href="/templates/settings">Account</a>
			<a href="/templates/settings">Notifications</a>
			<a href="/templates/settings">Appearance</a>
			<details open>
				<summary>Security</summary>
				<a href="/templates/settings">Password</a>
				<a href="/templates/settings">Two-Factor</a>
				<a href="/templates/settings">Sessions</a>
			</details>
			<a href="/templates/settings">Billing</a>
			<a href="/templates/settings">API Keys</a>
		</nav>
		<p class="fs-xs text-faint" style="margin-block-start: auto;">Logged in as alex@example.com</p>
	</aside>

	<div class="app-shell">
		<header class="header border" style="padding-inline: var(--pad-xl);">
			<h1 class="h3" style="display: flex; align-items: center; gap: var(--vs-xs);">
				<button class="drawer-toggle minimal" popovertarget="settings-sidebar" aria-label="Open navigation" style="padding: 0; margin-block-start: -2px;">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
				</button>
				Settings
			</h1>
		</header>

		<main class="stack" style="padding: var(--pad-xl); --gap: var(--vs-xl);">
			<section class="stack" aria-labelledby="profile-heading" style="--gap: var(--vs-m);">
				<header class="stack" style="--gap: var(--vs-xs);">
					<h2 id="profile-heading" class="h3">Profile</h2>
					<p class="text-muted">Manage your public profile information.</p>
				</header>

			<div class="cluster" style="--gap: var(--vs-m);">
				<div class="avatar xl" aria-label="Alex Johnson's avatar">AJ</div>
				<div class="stack" style="--gap: var(--vs-xs);">
					<button class="ghost mini" type="button">Change photo</button>
					<button class="minimal mini text-faint" type="button">Remove</button>
				</div>
			</div>

			<form class="stack" aria-labelledby="profile-heading" style="--gap: var(--vs-m);">
				<div class="layout-split" style="--layout-gap: var(--vs-m);">
					<div class="row">
						<label for="first-name">First name</label>
						<input type="text" id="first-name" value="Alex">
					</div>
					<div class="row">
						<label for="last-name">Last name</label>
						<input type="text" id="last-name" value="Johnson">
					</div>
				</div>

				<div class="row">
					<label for="email">Email address</label>
					<input type="email" id="email" value="alex@example.com">
					<small class="text-faint">This is the email used for notifications and login.</small>
				</div>

				<div class="row">
					<label for="username">Username</label>
					<div class="input-group stack-mobile">
						<input type="text" id="username" value="alexjohnson">
						<button type="button">Check availability</button>
					</div>
				</div>

				<div class="row">
					<label for="bio">Bio</label>
					<textarea id="bio" rows="3">Product designer and developer based in Portland. I love building tools that make people's lives easier.</textarea>
				</div>

				<div class="form-actions">
					<button class="primary" type="button">Save changes</button>
					<button class="ghost" type="button">Cancel</button>
				</div>
			</form>
		</section>

		<hr>

		<section class="stack" aria-labelledby="notifications-heading" style="--gap: var(--vs-m);">
			<header class="stack" style="--gap: var(--vs-xs);">
				<h2 id="notifications-heading" class="h3">Notifications</h2>
				<p class="text-muted">Choose what notifications you receive.</p>
			</header>

			<fieldset class="stack" style="padding: 0; margin: 0; border: none; --gap: var(--vs-s);">
				<legend class="visually-hidden">Notification preferences</legend>
				<div class="box split" style="--gap: var(--vs-s);">
					<div class="stack" style="--gap: var(--vs-xs);">
						<label for="notif-email"><strong>Email notifications</strong></label>
						<p class="fs-xs text-muted">Receive email updates about your account activity.</p>
					</div>
					<input id="notif-email" type="checkbox" class="toggle" checked>
				</div>

				<div class="box split" style="--gap: var(--vs-s);">
					<div class="stack" style="--gap: var(--vs-xs);">
						<label for="notif-push"><strong>Push notifications</strong></label>
						<p class="fs-xs text-muted">Get push notifications on your devices.</p>
					</div>
					<input id="notif-push" type="checkbox" class="toggle" checked>
				</div>

				<div class="box split" style="--gap: var(--vs-s);">
					<div class="stack" style="--gap: var(--vs-xs);">
						<label for="notif-marketing"><strong>Marketing emails</strong></label>
						<p class="fs-xs text-muted">Receive tips, product updates, and inspiration.</p>
					</div>
					<input id="notif-marketing" type="checkbox" class="toggle">
				</div>

				<div class="box split" style="--gap: var(--vs-s);">
					<div class="stack" style="--gap: var(--vs-xs);">
						<label for="notif-weekly"><strong>Weekly digest</strong></label>
						<p class="fs-xs text-muted">A weekly summary of your activity and stats.</p>
					</div>
					<input id="notif-weekly" type="checkbox" class="toggle" checked>
				</div>
			</fieldset>
		</section>

		<hr>

		<section class="stack" aria-labelledby="appearance-heading" style="--gap: var(--vs-m);">
			<header class="stack" style="--gap: var(--vs-xs);">
				<h2 id="appearance-heading" class="h3">Appearance</h2>
				<p class="text-muted">Customize how the app looks and feels.</p>
			</header>

			<form class="stack" aria-labelledby="appearance-heading" style="--gap: var(--vs-m);">
				<fieldset class="stack" style="padding: 0; margin: 0; border: none; --gap: var(--vs-s);">
					<legend><strong>Theme</strong></legend>
					<div class="cluster" style="--gap: var(--vs-m);">
						<label class="form-option-row">
							<input type="radio" name="theme" value="light">
							Light
						</label>
						<label class="form-option-row">
							<input type="radio" name="theme" value="dark">
							Dark
						</label>
						<label class="form-option-row">
							<input type="radio" name="theme" value="system" checked>
							System
						</label>
					</div>
				</fieldset>

				<div class="row">
					<label for="language">Language</label>
					<select id="language" style="max-inline-size: 300px;">
						<option selected>English (US)</option>
						<option>English (UK)</option>
						<option>Español</option>
						<option>Français</option>
						<option>Deutsch</option>
						<option>日本語</option>
						<option>한국어</option>
						<option>Português (BR)</option>
					</select>
				</div>

				<div class="form-actions">
					<button class="primary" type="button">Save preferences</button>
				</div>
			</form>
		</section>

		<hr>

		<section class="stack" aria-labelledby="danger-zone-heading" style="--gap: var(--vs-m);">
			<header>
				<h2 id="danger-zone-heading" class="h3" style="color: var(--red);">Danger Zone</h2>
			</header>

			<div class="callout error fill">
				<div class="stack" style="--gap: var(--vs-s);">
					<p><strong>Delete your account</strong></p>
					<p class="text-muted">
						Once you delete your account, there is no going back. All of your data,
						projects, and settings will be permanently removed. This action cannot be undone.
					</p>
					<div class="cluster" style="--gap: var(--vs-s);">
						<button class="error" type="button">Delete Account</button>
					</div>
				</div>
			</div>
		</section>
		</main>
	</div>
</div>
