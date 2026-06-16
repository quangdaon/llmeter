<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="about-page">
	<div class="about-container">
		<a href="{resolve('/')}" class="back-link">← Back</a>

		<h1 class="page-title">About LLMeter</h1>
		<p class="page-subtitle">A quiz about preferences, personality, and the machines that also have opinions.</p>

		<section class="section">
			<h2>What is this?</h2>
			<p>
				LLMeter asks you a series of questions — the kind with no right answer, just preference.
				Do you prefer the top bunk or the bottom? Bars of soap or liquid? Then it compares your
				choices to those of ten leading AI models and calculates how "AI-brained" you are.
			</p>
			<p>
				It won't tell you anything definitive about your personality. But it might make you think
				twice about how much you have in common with a machine that's never slept in a bunk bed.
			</p>
		</section>

		<section class="section">
			<h2>The AI lineup</h2>
			<p>
				We asked twelve AI models the same questions you're about to answer. Here's who showed up:
			</p>

			<div class="model-groups">
				<div class="model-group">
					<div class="maker-label">Google</div>
					<ul class="model-list">
						<li><strong>Gemma 3</strong> — an open-source model from Google, running on local hardware</li>
						<li><strong>Gemma 4</strong> — Google's latest open-source model, running on local hardware</li>
						<li><strong>Gemini 2.5 Pro</strong> — Google's most capable cloud model</li>
						<li><strong>Gemini 2.5 Flash</strong> — Google's faster, lighter cloud model</li>
					</ul>
				</div>

				<div class="model-group">
					<div class="maker-label">Meta</div>
					<ul class="model-list">
						<li><strong>Llama 3.1</strong> — Meta's open-source model, also running on local hardware</li>
					</ul>
				</div>

				<div class="model-group">
					<div class="maker-label">Mistral</div>
					<ul class="model-list">
						<li><strong>Mistral 7B</strong> — Mistral's open-source model, running on local hardware</li>
					</ul>
				</div>

				<div class="model-group">
					<div class="maker-label">OpenAI</div>
					<ul class="model-list">
						<li><strong>GPT-5.5</strong> — OpenAI's latest flagship model</li>
						<li><strong>GPT-4.1</strong> — a capable all-rounder from OpenAI</li>
						<li><strong>GPT-4.1 Mini</strong> — OpenAI's smaller, snappier model</li>
					</ul>
				</div>

				<div class="model-group">
					<div class="maker-label">Anthropic</div>
					<ul class="model-list">
						<li><strong>Claude Opus 4.7</strong> — Anthropic's most powerful model</li>
						<li><strong>Claude Sonnet 4.6</strong> — Anthropic's balanced workhorse</li>
						<li><strong>Claude Haiku 4.5</strong> — Anthropic's fast, lightweight model</li>
					</ul>
				</div>
			</div>
		</section>

		<section class="section">
			<h2>The responses are pre-recorded — not live</h2>
			<p>
				This is important: the AI models are <em>not</em> processing your answers in real-time.
				Before the quiz launched, we ran a script that posed every question to every model and
				saved their answers. What you're comparing yourself to is a snapshot — a fixed record of
				what each model chose at a specific point in time.
			</p>
			<p>
				Think of it like a multiple-choice answer sheet that's already been filled out and sealed
				in an envelope. You fill out your own sheet, then we open the envelope and compare.
				The AIs don't know you took the quiz, and they never will.
			</p>
		</section>

		<section class="section">
			<h2>How the score works</h2>
			<p>
				For each question, we look at how many of the twelve models chose the same option you did.
				If eight out of twelve agreed with you, that question pushes your score up. If only one did,
				it barely moves the needle.
			</p>
			<p>
				Questions with more answer choices carry slightly more weight — it's harder to randomly
				agree with the majority on a six-option question than a two-option one, so that agreement
				means a little more.
			</p>
			<p>
				The final number is a weighted average across all your answers, expressed as a percentage.
				100% means you matched every AI on every question. 0% means you went against the grain
				every single time. Most people land somewhere in the middle, which is honestly reassuring.
			</p>
		</section>

		<section class="section">
			<h2>A note on AI "opinions"</h2>
			<p>
				When an AI picks "Top bunk," it's not because it dreams of sleeping near the ceiling.
				These models are trained on enormous amounts of human-written text, and their answers
				reflect patterns in that data — what people tend to say, prefer, or associate with
				certain things. It's pattern-matching at a massive scale, not genuine preference.
			</p>
			<p>
				That said, it's still genuinely interesting when twelve different models from five different
				companies mostly agree on something. Draw your own conclusions.
			</p>
		</section>

		<div class="cta-row">
			<a href="{resolve('/quiz')}" class="cta-btn">Take the Quiz →</a>
		</div>
	</div>
</div>

<style>
	.about-page {
		flex: 1;
		display: flex;
		justify-content: center;
		padding: 3rem 1.5rem;
	}

	.about-container {
		width: 100%;
		max-width: 680px;
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
		margin-bottom: 0.75rem;
	}

	.page-subtitle {
		font-size: 1.05rem;
		color: var(--muted);
		font-style: italic;
		margin-bottom: 3rem;
		line-height: 1.5;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section h2 {
		font-size: 1.2rem;
		font-weight: 800;
		color: var(--text);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border);
	}

	.section p {
		font-size: 0.975rem;
		color: var(--text-dim);
		line-height: 1.75;
		margin-bottom: 0.9rem;
	}

	.section p:last-child {
		margin-bottom: 0;
	}

	.model-groups {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-top: 1.25rem;
	}

	.model-group {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1rem 1.25rem;
	}

	.maker-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		margin-bottom: 0.6rem;
	}

	.model-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.model-list li {
		font-size: 0.9rem;
		color: var(--text-dim);
		line-height: 1.5;
	}

	.model-list strong {
		color: var(--text);
	}

	.cta-row {
		margin-top: 1rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--border);
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
