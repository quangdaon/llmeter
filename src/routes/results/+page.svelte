<script lang="ts">
	import { resolve, base } from '$app/paths';
	import { onMount } from 'svelte';
	import { Copy, Check } from 'lucide-svelte';
	import { siX, siBluesky } from 'simple-icons';
	import ModelIcon from '$lib/components/ModelIcon.svelte';
	import QuestionBreakdown from '$lib/components/QuestionBreakdown.svelte';
	import type { EvaluateResponse, Model, ModelMatch } from '$lib/types';

	let result = $state<EvaluateResponse | null>(null);
	let models = $state<Model[]>([]);
	let error = $state<string | null>(null);

	let shareUrl = $state('');
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		shareUrl = `${window.location.origin}${base}`;
		try {
			const raw = sessionStorage.getItem('llmeter_result');
			const modelsRaw = sessionStorage.getItem('llmeter_models');
			if (!raw) {
				error = 'No results found. Did you complete the quiz?';
				return;
			}
			result = JSON.parse(raw);
			models = modelsRaw ? JSON.parse(modelsRaw) : [];
		} catch {
			error = 'Failed to load results.';
		}
	});

	function shareText(url = shareUrl) {
		return result
			? `I scored ${result.aiPercentage}% AI on LLMeter ("${result.aiLabel}"). How human are you? ${url}`
			: '';
	}

	function twitterUrl() {
		const text = result
			? `I scored ${result.aiPercentage}% AI on LLMeter ("${result.aiLabel}"). How human are you?`
			: '';
		return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
	}

	function bskyUrl() {
		return `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText())}`;
	}

	async function copyToClipboard() {
		if (!shareText()) return;
		await navigator.clipboard.writeText(shareText());
		copied = true;
		clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => (copied = false), 2000);
	}

	function getModel(modelId: string): Model | undefined {
		return models.find((m) => m.id === modelId);
	}

	function getHighlightedMatches(matches: ModelMatch[]): ModelMatch[] {
		return matches.filter((m) => m.totalQuestions > 0 && m.matchCount / m.totalQuestions >= 0.8);
	}

	function getScoreColor(pct: number): string {
		if (pct >= 70) return 'var(--ai-color)';
		if (pct >= 40) return 'var(--accent)';
		return 'var(--human-color)';
	}
</script>

<div class="results-page">
	{#if error}
		<div class="error-screen">
			<p class="error-msg">{error}</p>
			<a href="{resolve('/quiz')}" class="start-btn">Take the Quiz</a>
		</div>
	{:else if !result}
		<div class="loading-screen">
			<div class="spinner"></div>
			<p>Loading your results…</p>
		</div>
	{:else}
		{@const highlighted = getHighlightedMatches(result.modelMatches)}

		<div class="results-container">
			<!-- Score section -->
			<section class="score-section">
				<p class="score-eyebrow">Your Results</p>
				<div class="score-display">
					<span class="score-number" style="color: {getScoreColor(result.aiPercentage)}">
						{result.aiPercentage}%
					</span>
					<span class="score-label">AI</span>
				</div>
				<div class="score-bar-wrap">
					<span class="bar-label human-label">Human ❤️</span>
					<div class="score-bar">
						<div
							class="score-fill ai-fill"
							style="width: {result.aiPercentage}%; background: {getScoreColor(result.aiPercentage)}"
						></div>
					</div>
					<span class="bar-label ai-label">AI 🤖</span>
				</div>
				<div class="verdict-badge">
					<span class="verdict-emoji">{result.aiLabelEmoji}</span>
					<span class="verdict-text">{result.aiLabel}</span>
				</div>

				{#if result.disputeBonus}
					<div class="dispute-note">
						You disputed the options. Your humanity has been noted. (+5% human)
					</div>
				{/if}
			</section>

			<!-- Share -->
			<section class="share-section">
				<p class="share-label">Share your result</p>
				<div class="share-buttons">
					<button class="share-btn copy-btn" onclick={copyToClipboard}>
						{#if copied}
							<Check size={15} strokeWidth={2.5} />
							Copied!
						{:else}
							<Copy size={15} strokeWidth={2} />
							Copy
						{/if}
					</button>
					<a href={twitterUrl()} target="_blank" rel="noopener noreferrer" class="share-btn x-btn">
						<svg role="img" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="fill: currentColor; flex-shrink: 0;">
							<path d={siX.path} />
						</svg>
						Post on X
					</a>
					<a href={bskyUrl()} target="_blank" rel="noopener noreferrer" class="share-btn bsky-btn">
						<svg role="img" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style="fill: currentColor; flex-shrink: 0;">
							<path d={siBluesky.path} />
						</svg>
						Bluesky
					</a>
				</div>
			</section>

			<!-- Model match highlights -->
			{#if highlighted.length > 0}
				<section class="matches-section">
					<h2 class="section-title">You Think Like…</h2>
					<div class="matches-grid">
						{#each highlighted as match}
							{@const model = getModel(match.modelId)}
							{#if model}
								<div class="match-card" style="--model-color: {model.color}">
									<ModelIcon logo={model.logo} name={model.name} size={40} color={model.color} />
									<div class="match-info">
										<p class="match-name">{model.name}</p>
										<p class="match-stat">
											{match.matchCount}/{match.totalQuestions} matching answers
										</p>
									</div>
									<div class="match-pct">
										{Math.round((match.matchCount / match.totalQuestions) * 100)}%
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</section>
			{/if}

			<!-- Question summary -->
			<section class="summary-section">
				<h2 class="section-title">Question Breakdown</h2>
				<p class="summary-hint">
					AI bubbles appear next to each option. Hover to see which model. Click to read their reasoning.
				</p>
				<QuestionBreakdown questions={result.questions} {models} />
			</section>

			<div class="cta-row">
				<a href="{resolve('/quiz')}" class="play-again-btn">Play Again</a>
				<a href="{resolve('/')}" class="home-link">← Home</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.results-page {
		flex: 1;
		padding: 3rem 1.5rem;
		display: flex;
		justify-content: center;
	}

	.results-container {
		width: 100%;
		max-width: 720px;
	}

	.error-screen,
	.loading-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding-top: 4rem;
		color: var(--muted);
	}

	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid var(--surface-2);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Score */
	.score-section {
		text-align: center;
		padding: 3rem 0 2.5rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 3rem;
	}

	.score-eyebrow {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 1rem;
	}

	.score-display {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.score-number {
		font-size: clamp(5rem, 14vw, 8rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.03em;
		transition: color 0.3s;
	}

	.score-label {
		font-size: 2rem;
		font-weight: 700;
		color: var(--muted);
	}

	.score-bar-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 400px;
		margin: 0 auto 1.5rem;
	}

	.bar-label {
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.human-label {
		color: var(--human-color);
	}

	.ai-label {
		color: var(--ai-color);
	}

	.score-bar {
		flex: 1;
		height: 10px;
		background: var(--surface-2);
		border-radius: 5px;
		overflow: hidden;
	}

	.score-fill {
		height: 100%;
		border-radius: 5px;
		transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.verdict-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 50px;
		padding: 0.5rem 1.25rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text);
	}

	.verdict-emoji {
		font-size: 1.2rem;
	}

	.dispute-note {
		margin-top: 1rem;
		font-size: 0.82rem;
		color: var(--muted);
		font-style: italic;
	}

	/* Share */
	.share-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1.25rem 0 2.5rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 3rem;
	}

	.share-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		white-space: nowrap;
	}

	.share-buttons {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.share-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.9rem;
		border-radius: 8px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.15s ease;
		border: 1px solid var(--border);
		white-space: nowrap;
	}

	.copy-btn {
		background: var(--surface);
		color: var(--text-dim);
	}

	.copy-btn:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.x-btn {
		background: #000;
		color: #fff;
		border-color: #000;
	}

	.x-btn:hover {
		background: #222;
	}

	.bsky-btn {
		background: #0085ff;
		color: #fff;
		border-color: #0085ff;
	}

	.bsky-btn:hover {
		background: #0070e0;
	}

	/* Matches */
	.matches-section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
		margin: 0 0 1.25rem;
		letter-spacing: -0.01em;
	}

	.matches-grid {
		display: grid;
		gap: 0.75rem;
	}

	.match-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-left: 3px solid var(--model-color, var(--accent));
		border-radius: 12px;
	}

	.match-card :global(svg),
	.match-card :global(img) {
		border-radius: 6px;
	}

	.match-info {
		flex: 1;
	}

	.match-name {
		font-weight: 600;
		color: var(--text);
		margin: 0 0 0.2rem;
		font-size: 0.95rem;
	}

	.match-stat {
		font-size: 0.8rem;
		color: var(--muted);
		margin: 0;
	}

	.match-pct {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--model-color, var(--accent));
	}

	/* Summary */
	.summary-section {
		margin-bottom: 3rem;
	}

	.summary-hint {
		font-size: 0.82rem;
		color: var(--muted);
		margin: -0.75rem 0 1.5rem;
		line-height: 1.5;
	}

	/* CTA */
	.cta-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.play-again-btn {
		padding: 0.875rem 2rem;
		background: var(--accent);
		color: var(--bg);
		border-radius: 10px;
		font-weight: 700;
		font-size: 0.95rem;
		text-decoration: none;
		transition: all 0.18s ease;
		letter-spacing: 0.02em;
	}

	.play-again-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-1px);
	}

	.home-link {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s;
	}

	.home-link:hover {
		color: var(--text);
	}

	.start-btn {
		padding: 0.875rem 2rem;
		background: var(--accent);
		color: var(--bg);
		border-radius: 10px;
		font-weight: 700;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.error-msg {
		font-size: 1rem;
		color: var(--text-dim);
	}
</style>
