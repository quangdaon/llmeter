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
	<div class="hero">
		<div class="badge">🤖 AI Personality Quiz</div>
		<h1 class="headline">
			How Much of an
			<span class="gradient-text">AI</span>
			Are You?
		</h1>
		<p class="subhead">{tagline}</p>
		<p class="desc">
			Answer 10 questions. We'll compare your choices to responses from leading AI models —
			Claude, GPT, Gemini, and more — and calculate exactly how robotic you are.
		</p>
		<a href="/quiz" class="cta-btn">
			<span>Start the Quiz</span>
			<span class="cta-arrow">→</span>
		</a>
		<p class="disclaimer">10 questions · Takes about 2 minutes · Results are instant</p>
	</div>

	<div class="features">
		<div class="feature-card">
			<span class="feature-icon">⚡</span>
			<h3>Real AI Responses</h3>
			<p>Every AI model was asked the same questions and forced to pick from the same options.</p>
		</div>
		<div class="feature-card">
			<span class="feature-icon">📊</span>
			<h3>Weighted Scoring</h3>
			<p>Questions with more options count for more — picking the AI answer means something.</p>
		</div>
		<div class="feature-card">
			<span class="feature-icon">🔍</span>
			<h3>Full Breakdown</h3>
			<p>See exactly what every AI picked and why. Hover their bubble. Click for reasoning.</p>
		</div>
	</div>
</div>

<style>
	.landing {
		min-height: calc(100vh - 80px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 1.5rem 2rem;
		gap: 4rem;
	}

	.hero {
		text-align: center;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 50px;
		padding: 0.4rem 1rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--muted);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.headline {
		font-size: clamp(2.5rem, 7vw, 4.5rem);
		font-weight: 900;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--text);
	}

	.gradient-text {
		background: linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subhead {
		font-size: 1.1rem;
		color: var(--text-dim);
		font-style: italic;
	}

	.desc {
		font-size: 0.95rem;
		color: var(--muted);
		line-height: 1.7;
		max-width: 520px;
	}

	.cta-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		background: var(--accent);
		color: var(--bg);
		padding: 1rem 2.25rem;
		border-radius: 12px;
		font-size: 1.05rem;
		font-weight: 800;
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: all 0.2s ease;
		box-shadow: 0 0 0 0 rgba(99, 179, 237, 0.4);
	}

	.cta-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(99, 179, 237, 0.3);
	}

	.cta-arrow {
		transition: transform 0.2s;
	}

	.cta-btn:hover .cta-arrow {
		transform: translateX(4px);
	}

	.disclaimer {
		font-size: 0.78rem;
		color: var(--muted);
	}

	/* Features */
	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		max-width: 720px;
		width: 100%;
	}

	.feature-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.5rem;
		text-align: center;
		transition: border-color 0.2s, transform 0.2s;
	}

	.feature-card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
	}

	.feature-icon {
		font-size: 1.75rem;
		display: block;
		margin-bottom: 0.75rem;
	}

	.feature-card h3 {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		font-size: 0.8rem;
		color: var(--muted);
		line-height: 1.6;
	}
</style>
