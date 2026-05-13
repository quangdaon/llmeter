<script lang="ts">
	import { page } from '$app/state';
	import { resolve, base } from '$app/paths';
	import { siAnthropic, siGoogle, siMeta, siMistralai, siOllama } from 'simple-icons';

	const is404 = $derived(page.status === 404);

	// Decorative model bubbles — one per provider
	const bubbles = [
		{ name: 'Anthropic', color: '#D97757', path: siAnthropic.path },
		{ name: 'Google', color: '#4285F4', path: siGoogle.path },
		{ name: 'OpenAI', color: '#10A37F', path: null },
		{ name: 'Meta', color: '#0082FB', path: siMeta.path },
		{ name: 'Mistral', color: '#FF7000', path: siMistralai.path },
		{ name: 'Ollama', color: '#6b7280', path: siOllama.path },
	];
</script>

<div class="error-page">
	{#if is404}
		<div class="score-block">
			<p class="eyebrow">Error</p>
			<div class="score-display">
				<span class="score-number">404</span>
			</div>
			<div class="verdict-badge">
				<span>Page Not Found</span>
			</div>
		</div>

		<p class="lead">We put this URL to our full panel of AI models.</p>

		<div class="bubble-row" aria-hidden="true">
			{#each bubbles as b}
				<div class="bubble" style="--bcolor: {b.color}" title={b.name}>
					{#if b.path}
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="fill: {b.color};">
							<path d={b.path} />
						</svg>
					{:else}
						<!-- OpenAI: no icon in simple-icons, use their static SVG -->
						<img src="{base}/images/models/openai.svg" alt="OpenAI" width="18" height="18" />
					{/if}
					<span class="bubble-x">✕</span>
				</div>
			{/each}
		</div>

		<p class="verdict-line">Every single one of them: <em>"Yeah, that doesn't exist."</em></p>
		<p class="kicker">First time they've ever agreed on anything.</p>

		<div class="cta-row">
			<a href="{resolve('/')}" class="btn-primary">← Go Home</a>
			<a href="{resolve('/quiz')}" class="btn-secondary">Take the Quiz</a>
		</div>
	{:else}
		<div class="score-block">
			<p class="eyebrow">Something went wrong</p>
			<div class="score-display">
				<span class="score-number generic">{page.status}</span>
			</div>
			<div class="verdict-badge">
				<span>{page.error?.message ?? 'Unexpected error'}</span>
			</div>
		</div>
		<div class="cta-row">
			<a href="{resolve('/')}" class="btn-primary">← Go Home</a>
		</div>
	{/if}
</div>

<style>
	.error-page {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		text-align: center;
		gap: 1.5rem;
	}

	/* Score-style number block */
	.score-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.eyebrow {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0;
	}

	.score-display {
		line-height: 1;
	}

	.score-number {
		font-size: clamp(5rem, 20vw, 9rem);
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--ai-color);
	}

	.score-number.generic {
		color: var(--human-color);
	}

	.verdict-badge {
		display: inline-flex;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 50px;
		padding: 0.45rem 1.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text);
	}

	/* Copy */
	.lead {
		font-size: 1rem;
		color: var(--text-dim);
		margin: 0;
		max-width: 380px;
	}

	.verdict-line {
		font-size: 1rem;
		color: var(--text-dim);
		margin: 0;
	}

	.verdict-line em {
		font-style: normal;
		font-weight: 600;
		color: var(--text);
	}

	.kicker {
		font-size: 0.88rem;
		color: var(--muted);
		font-style: italic;
		margin: -0.75rem 0 0;
	}

	/* AI bubbles */
	.bubble-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	.bubble {
		position: relative;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: 2px solid var(--bcolor);
		background: var(--surface);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bubble-x {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--human-color);
		color: white;
		font-size: 0.55rem;
		font-weight: 900;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	/* CTAs */
	.cta-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.5rem;
	}

	.btn-primary {
		display: inline-block;
		background: var(--accent);
		color: var(--bg);
		padding: 0.875rem 2rem;
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 800;
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: all 0.18s ease;
	}

	.btn-primary:hover {
		background: var(--accent-bright);
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(249, 115, 22, 0.3);
	}

	.btn-secondary {
		display: inline-block;
		background: transparent;
		color: var(--text-dim);
		padding: 0.875rem 2rem;
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 600;
		text-decoration: none;
		border: 1px solid var(--border);
		transition: all 0.18s ease;
	}

	.btn-secondary:hover {
		border-color: var(--text-dim);
		color: var(--text);
	}
</style>
