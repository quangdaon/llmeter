<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="privacy-page">
	<div class="privacy-container">
		<a href="{resolve('/')}" class="back-link">← Back</a>

		<h1 class="page-title">Privacy Policy</h1>
		<p class="last-updated">Last updated: May 2026</p>

		<div class="tldr">
			<span class="tldr-label">The short version</span>
			<p>We don't collect anything. You're just here to take a quiz.</p>
		</div>

		<section class="section">
			<h2>No personal information collected</h2>
			<p>
				There are no accounts, no logins, and no forms asking for your name, email address, or
				anything else that could identify you. You are a stranger to us, and we are content with that.
			</p>
		</section>

		<section class="section">
			<h2>Your quiz answers</h2>
			<p>
				Your answers are held temporarily in your browser's session memory — just long enough to
				calculate and display your results. Once you close the tab, they're gone. We don't log them,
				store them, or look at them. The server calculates your score and immediately forgets you exist.
			</p>
		</section>

		<section class="section">
			<h2>Cookies</h2>
			<p>
				These AIs are unable to consume cookies so we didn't put any in this app.
			</p>
		</section>

		<section class="section">
			<h2>Analytics</h2>
			<p>
				None. We don't track page views, referrers, session lengths, or anything else. We have no
				idea how many people visit this site, and honestly, it's probably better that way.
			</p>
		</section>

		<section class="section">
			<h2>Third parties</h2>
			<p>
				No third-party scripts, ad networks, or tracking pixels. The only external request your
				browser makes is to load the page itself — everything else runs locally.
			</p>
		</section>

		<section class="section">
			<h2>Changes to this policy</h2>
			<p>
				If something here ever changes, the "last updated" date at the top will reflect that.
				Given that there's almost nothing to update, we wouldn't hold your breath.
			</p>
		</section>
	</div>
</div>

<style>
	.privacy-page {
		flex: 1;
		display: flex;
		justify-content: center;
		padding: 3rem 1.5rem;
	}

	.privacy-container {
		width: 100%;
		max-width: 620px;
	}

	.back-link {
		display: inline-block;
		color: var(--muted);
		text-decoration: none;
		font-size: 0.9rem;
		margin-bottom: 2.5rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--text);
	}

	.page-title {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--text);
		margin-bottom: 0.4rem;
	}

	.last-updated {
		font-size: 0.8rem;
		color: var(--muted);
		margin-bottom: 2rem;
	}

	.tldr {
		background: var(--accent-subtle);
		border: 1px solid var(--accent);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		margin-bottom: 2.5rem;
	}

	.tldr-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		margin-bottom: 0.4rem;
	}

	.tldr p {
		font-size: 0.95rem;
		color: var(--text);
		font-weight: 600;
		margin: 0;
	}

	.section {
		margin-bottom: 2.25rem;
	}

	.section h2 {
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--text);
		margin-bottom: 0.6rem;
	}

	.section p {
		font-size: 0.95rem;
		color: var(--text-dim);
		line-height: 1.75;
		margin: 0;
	}
</style>
