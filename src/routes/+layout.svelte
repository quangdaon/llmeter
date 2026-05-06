<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>LLMeter — How much of an AI are you?</title>
	<meta name="description" content="A quiz that compares your answers to leading AI models. Are you more human or machine?" />
</svelte:head>

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<p>
		A <a href="https://www.quangdao.com" target="_blank" rel="noopener noreferrer">Quangdao Nguyen</a> Catastrophe. All Rights Reserved.
		<span class="sep">·</span>
		<a href="/about" class="repo-link">About</a>
		<span class="sep">·</span>
		<a href="/privacy" class="repo-link">Privacy</a>
		<span class="sep">·</span>
		<a href="#repo" class="repo-link">View Source</a>
	</p>
</footer>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(:root) {
		/* Color palette — warm, light, jolly */
		--bg: #fef9f2;
		--surface: #ffffff;
		--surface-2: #fdf4e7;
		--surface-hover: #fff8f0;
		--border: #e8d5b8;
		--text: #1e1208;
		--text-dim: #6b4a2e;
		--muted: #a87d5a;

		/* Accent: warm orange */
		--accent: #f97316;
		--accent-bright: #fb923c;
		--accent-subtle: rgba(249, 115, 22, 0.1);

		/* Semantic colors */
		--human-color: #e11d48;
		--ai-color: #6366f1;

		/* Typography */
		--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
	}

	:global(html) {
		font-family: var(--font-sans);
		background: var(--bg);
		color: var(--text);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(body) {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background:
			radial-gradient(ellipse 55% 45% at 85% 5%, rgba(251, 146, 60, 0.18) 0%, transparent 60%),
			radial-gradient(ellipse 50% 40% at 15% 95%, rgba(167, 139, 250, 0.14) 0%, transparent 60%),
			var(--bg);
	}

	:global(a) {
		color: var(--accent);
	}

	:global(button) {
		font-family: var(--font-sans);
	}

	:global(::selection) {
		background: var(--accent-subtle);
		color: var(--accent);
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 4px;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.site-footer {
		text-align: center;
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--border);
		margin-top: 2rem;
	}

	.site-footer p {
		font-size: 0.8rem;
		color: var(--muted);
	}

	.site-footer a {
		color: var(--text-dim);
		text-decoration: none;
		transition: color 0.2s;
	}

	.site-footer a:hover {
		color: var(--text);
	}

	.sep {
		margin: 0 0.5rem;
	}

	.repo-link {
		color: var(--muted) !important;
	}
</style>
