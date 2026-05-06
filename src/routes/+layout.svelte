<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>LLMeter — How much of an AI are you?</title>
	<meta name="description" content="A quiz that compares your answers to leading AI models. Are you more human or machine?" />
</svelte:head>

{@render children()}

<footer class="site-footer">
	<p>
		A <a href="https://www.quangdao.com" target="_blank" rel="noopener noreferrer">Quangdao Nguyen</a> Catastrophe. All Rights Reserved.
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
		/* Color palette */
		--bg: #080b14;
		--surface: #111520;
		--surface-2: #1a2035;
		--surface-hover: #161c2e;
		--border: #222840;
		--text: #e8eaf6;
		--text-dim: #9fa8c7;
		--muted: #5c6484;

		/* Accent: electric blue */
		--accent: #63b3ed;
		--accent-bright: #90cdf4;
		--accent-subtle: rgba(99, 179, 237, 0.08);

		/* Semantic colors */
		--human-color: #ff7043;
		--ai-color: #63b3ed;

		/* Typography */
		--font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-mono: 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
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
		background:
			radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99, 179, 237, 0.12) 0%, transparent 60%),
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
		color: var(--accent-bright);
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 4px;
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
