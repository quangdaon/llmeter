<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { EvaluateResponse, Model, ModelMatch } from '$lib/types';

	let result = $state<EvaluateResponse | null>(null);
	let models = $state<Model[]>([]);
	let error = $state<string | null>(null);

	let expandedReasoning = $state<{ questionId: string; modelId: string } | null>(null);
	let hoveredBubble = $state<{ questionId: string; modelId: string } | null>(null);

	onMount(() => {
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

	function getModel(modelId: string): Model | undefined {
		return models.find((m) => m.id === modelId);
	}

	function getHighlightedMatches(matches: ModelMatch[]): ModelMatch[] {
		return matches.filter((m) => m.totalQuestions > 0 && m.matchCount / m.totalQuestions >= 0.8);
	}

	function openReasoning(questionId: string, modelId: string) {
		if (
			expandedReasoning?.questionId === questionId &&
			expandedReasoning?.modelId === modelId
		) {
			expandedReasoning = null;
		} else {
			expandedReasoning = { questionId, modelId };
		}
	}

	function isExpanded(questionId: string, modelId: string): boolean {
		return (
			expandedReasoning?.questionId === questionId && expandedReasoning?.modelId === modelId
		);
	}

	function isHovered(questionId: string, modelId: string): boolean {
		return (
			hoveredBubble?.questionId === questionId && hoveredBubble?.modelId === modelId
		);
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

			<!-- Model match highlights -->
			{#if highlighted.length > 0}
				<section class="matches-section">
					<h2 class="section-title">You Think Like…</h2>
					<div class="matches-grid">
						{#each highlighted as match}
							{@const model = getModel(match.modelId)}
							{#if model}
								<div class="match-card" style="--model-color: {model.color}">
									<img
										src={model.logo}
										alt={model.name}
										class="match-logo"
										width="48"
										height="48"
									/>
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

				<div class="questions-list">
					{#each result.questions as q}
						<div class="question-card">
							<p class="q-text">{q.questionText}</p>
							<div class="q-options">
								{#each q.options as option}
									{@const isUserAnswer = option === q.userAnswer}
									{@const respondents = q.aiResponses.filter((r) => r.selection === option)}
									<div
										class="q-option"
										class:user-selected={isUserAnswer}
									>
										<span class="q-option-text">{option}</span>
										{#if isUserAnswer}
											<span class="your-pick">You</span>
										{/if}

										{#if respondents.length > 0}
											<div class="ai-bubbles">
												{#each respondents as resp}
													{@const model = getModel(resp.modelId)}
													{#if model}
														<!-- svelte-ignore a11y_mouse_events_have_key_events -->
														<button
															class="ai-bubble"
															class:expanded={isExpanded(q.questionId, resp.modelId)}
															style="--bcolor: {model.color}"
															onclick={() => openReasoning(q.questionId, resp.modelId)}
															onmouseenter={() =>
																(hoveredBubble = {
																	questionId: q.questionId,
																	modelId: resp.modelId,
																})}
															onmouseleave={() => (hoveredBubble = null)}
															title={model.name}
														>
															<img
																src={model.logo}
																alt={model.name}
																width="20"
																height="20"
																class="bubble-logo"
															/>
															{#if isHovered(q.questionId, resp.modelId)}
																<span class="bubble-tooltip">{model.name}</span>
															{/if}
														</button>
													{/if}
												{/each}
											</div>
										{/if}
									</div>

									<!-- Reasoning panels -->
									{#each q.aiResponses.filter((r) => r.selection === option) as resp}
										{#if isExpanded(q.questionId, resp.modelId)}
											{@const model = getModel(resp.modelId)}
											{#if model}
												<div class="reasoning-panel" style="--bcolor: {model.color}">
													<div class="reasoning-header">
														<img src={model.logo} alt={model.name} width="24" height="24" />
														<strong>{model.name}</strong>
														<button
															class="close-reasoning"
															onclick={() => (expandedReasoning = null)}>×</button
														>
													</div>
													<p class="reasoning-text">{resp.reasoning}</p>
												</div>
											{/if}
										{/if}
									{/each}
								{/each}
							</div>
						</div>
					{/each}
				</div>
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
		min-height: 100vh;
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

	.match-logo {
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
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

	.questions-list {
		display: grid;
		gap: 1rem;
	}

	.question-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.25rem;
	}

	.q-text {
		font-weight: 600;
		color: var(--text);
		margin: 0 0 1rem;
		font-size: 0.95rem;
	}

	.q-options {
		display: grid;
		gap: 0.4rem;
	}

	.q-option {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		background: var(--bg);
		border: 1px solid transparent;
		flex-wrap: wrap;
	}

	.q-option.user-selected {
		border-color: var(--accent);
		background: var(--accent-subtle);
	}

	.q-option-text {
		font-size: 0.88rem;
		color: var(--text-dim);
		flex: 1;
	}

	.user-selected .q-option-text {
		color: var(--text);
		font-weight: 500;
	}

	.your-pick {
		font-size: 0.7rem;
		font-weight: 700;
		background: var(--accent);
		color: var(--bg);
		padding: 0.15rem 0.5rem;
		border-radius: 50px;
		letter-spacing: 0.04em;
	}

	.ai-bubbles {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
	}

	.ai-bubble {
		position: relative;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2px solid var(--bcolor, var(--accent));
		background: var(--surface);
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
		overflow: visible;
	}

	.ai-bubble:hover,
	.ai-bubble.expanded {
		background: var(--bcolor, var(--accent));
		transform: scale(1.15);
	}

	.bubble-logo {
		border-radius: 50%;
		object-fit: cover;
	}

	.bubble-tooltip {
		position: absolute;
		bottom: calc(100% + 6px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--surface-2);
		color: var(--text);
		font-size: 0.7rem;
		font-weight: 600;
		white-space: nowrap;
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		pointer-events: none;
		z-index: 10;
		border: 1px solid var(--border);
	}

	.reasoning-panel {
		background: var(--bg);
		border: 1px solid var(--bcolor, var(--accent));
		border-radius: 8px;
		padding: 0.875rem 1rem;
		margin-top: 0.25rem;
		animation: slideDown 0.2s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}

	.reasoning-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.reasoning-header img {
		border-radius: 4px;
	}

	.reasoning-header strong {
		font-size: 0.85rem;
		color: var(--text);
		flex: 1;
	}

	.close-reasoning {
		background: none;
		border: none;
		color: var(--muted);
		font-size: 1.2rem;
		cursor: pointer;
		line-height: 1;
		padding: 0 0.2rem;
		transition: color 0.2s;
	}

	.close-reasoning:hover {
		color: var(--text);
	}

	.reasoning-text {
		font-size: 0.85rem;
		color: var(--text-dim);
		line-height: 1.6;
		margin: 0;
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
