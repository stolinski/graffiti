<div class="layout-sidebar fill" style="min-height: 100dvh; --layout-gap: 0px;">
	<aside class="split vertical" style="border-inline-end: var(--border-1); padding: var(--pad-l);">
		<nav class="sidebar-nav">
			<p style="padding: var(--pad-s) var(--pad-m); margin: 0 0 var(--vs-s) 0;">
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
		<p class="fs-xs text-faint" style="padding: var(--pad-s) var(--pad-m); margin: 0;">
			Logged in as alex@example.com
		</p>
	</aside>

	<main class="stack" style="padding: var(--pad-xl); --gap: var(--vs-xl);">

		<!-- Profile Section -->
		<section class="stack" style="--gap: var(--vs-m);">
			<div>
				<h1 class="h3" style="margin: 0;">Profile</h1>
				<p class="text-muted" style="margin: var(--vs-xs) 0 0 0;">
					Manage your public profile information.
				</p>
			</div>

			<div class="cluster" style="--gap: var(--vs-m); align-items: center;">
				<div class="avatar xl" aria-label="Alex Johnson's avatar">AJ</div>
				<div class="stack" style="--gap: var(--vs-xs);">
					<button class="ghost mini">Change photo</button>
					<button class="minimal mini text-faint">Remove</button>
				</div>
			</div>

			<div class="stack" style="--gap: var(--vs-m);">
				<div class="layout-split">
					<div>
						<label for="first-name">First name</label>
						<input type="text" id="first-name" value="Alex">
					</div>
					<div>
						<label for="last-name">Last name</label>
						<input type="text" id="last-name" value="Johnson">
					</div>
				</div>

				<div>
					<label for="email">Email address</label>
					<input type="email" id="email" value="alex@example.com">
					<small class="text-faint">This is the email used for notifications and login.</small>
				</div>

				<div>
					<label for="username">Username</label>
					<div class="input-group">
						<input type="text" id="username" value="alexjohnson">
						<button>Check availability</button>
					</div>
				</div>

				<div>
					<label for="bio">Bio</label>
					<textarea id="bio" rows="3">Product designer and developer based in Portland. I love building tools that make people's lives easier.</textarea>
				</div>
			</div>

			<div class="cluster">
				<button class="primary">Save changes</button>
				<button class="ghost">Cancel</button>
			</div>
		</section>

		<hr style="border: none; border-top: var(--border-1); margin: 0;">

		<!-- Notifications Section -->
		<section class="stack" style="--gap: var(--vs-m);">
			<div>
				<h2 class="h3" style="margin: 0;">Notifications</h2>
				<p class="text-muted" style="margin: var(--vs-xs) 0 0 0;">
					Choose what notifications you receive.
				</p>
			</div>

			<div class="stack" style="--gap: var(--vs-s);">
				<div class="box split center">
					<div>
						<p style="margin: 0;"><strong>Email notifications</strong></p>
						<p class="fs-xs text-muted" style="margin: var(--vs-xs) 0 0 0;">
							Receive email updates about your account activity.
						</p>
					</div>
					<input type="checkbox" class="toggle" checked aria-label="Email notifications">
				</div>

				<div class="box split center">
					<div>
						<p style="margin: 0;"><strong>Push notifications</strong></p>
						<p class="fs-xs text-muted" style="margin: var(--vs-xs) 0 0 0;">
							Get push notifications on your devices.
						</p>
					</div>
					<input type="checkbox" class="toggle" checked aria-label="Push notifications">
				</div>

				<div class="box split center">
					<div>
						<p style="margin: 0;"><strong>Marketing emails</strong></p>
						<p class="fs-xs text-muted" style="margin: var(--vs-xs) 0 0 0;">
							Receive tips, product updates, and inspiration.
						</p>
					</div>
					<input type="checkbox" class="toggle" aria-label="Marketing emails">
				</div>

				<div class="box split center">
					<div>
						<p style="margin: 0;"><strong>Weekly digest</strong></p>
						<p class="fs-xs text-muted" style="margin: var(--vs-xs) 0 0 0;">
							A weekly summary of your activity and stats.
						</p>
					</div>
					<input type="checkbox" class="toggle" checked aria-label="Weekly digest">
				</div>
			</div>
		</section>

		<hr style="border: none; border-top: var(--border-1); margin: 0;">

		<!-- Appearance Section -->
		<section class="stack" style="--gap: var(--vs-m);">
			<div>
				<h2 class="h3" style="margin: 0;">Appearance</h2>
				<p class="text-muted" style="margin: var(--vs-xs) 0 0 0;">
					Customize how the app looks and feels.
				</p>
			</div>

			<fieldset style="border: none; padding: 0; margin: 0;">
				<legend style="margin-bottom: var(--vs-s);"><strong>Theme</strong></legend>
				<div class="cluster" style="--gap: var(--vs-m);">
					<label style="display: inline-flex; align-items: center; gap: var(--vs-s); cursor: pointer;">
						<input type="radio" name="theme" value="light">
						Light
					</label>
					<label style="display: inline-flex; align-items: center; gap: var(--vs-s); cursor: pointer;">
						<input type="radio" name="theme" value="dark">
						Dark
					</label>
					<label style="display: inline-flex; align-items: center; gap: var(--vs-s); cursor: pointer;">
						<input type="radio" name="theme" value="system" checked>
						System
					</label>
				</div>
			</fieldset>

			<div>
				<label for="language">Language</label>
				<select id="language" style="max-width: 300px;">
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

			<div>
				<button class="primary">Save preferences</button>
			</div>
		</section>

		<hr style="border: none; border-top: var(--border-1); margin: 0;">

		<!-- Danger Zone Section -->
		<section class="stack" style="--gap: var(--vs-m);">
			<div>
				<h2 class="h3" style="margin: 0; color: var(--red);">Danger Zone</h2>
			</div>

			<div class="callout error" style="--gap: var(--vs-s);">
				<div class="stack" style="--gap: var(--vs-s);">
					<p style="margin: 0;"><strong>Delete your account</strong></p>
					<p style="margin: 0; color: var(--fg-6);">
						Once you delete your account, there is no going back. All of your data,
						projects, and settings will be permanently removed. This action cannot be undone.
					</p>
					<div>
						<button class="error">Delete Account</button>
					</div>
				</div>
			</div>
		</section>

	</main>
</div>
