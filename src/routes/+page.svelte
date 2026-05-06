<script lang="ts">
	const taglines = [
		'Would you pick the same option as ChatGPT?',
		'Turns out AIs have opinions. Do you share them?',
		'Totally scientific. Marginally useful.',
		'Your answers vs the machines.',
	];
	const tagline = taglines[Math.floor(Math.random() * taglines.length)];
</script>

<div class="landing">
	<h1 class="headline">
		How Much of an <span class="gradient-text">AI</span> Are You?
	</h1>
	<p class="subhead">{tagline}</p>
	<a href="/quiz" class="cta-btn">
		Start the Quiz →
	</a>
</div>

<style>
	.landing {
		min-height: calc(100vh - 80px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.75rem;
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.headline {
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		font-weight: 900;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--text);
	}

	.gradient-text {
		background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subhead {
		font-size: 1rem;
		color: var(--muted);
		font-style: italic;
	}

	.cta-btn {
		display: inline-block;
		background: var(--accent);
		color: var(--bg);
		padding: 0.875rem 2rem;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 800;
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: all 0.18s ease;
	}

	.cta-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(249, 115, 22, 0.3);
	}
</style>
