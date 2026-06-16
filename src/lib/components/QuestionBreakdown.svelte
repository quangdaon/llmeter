<script lang="ts">
	import ModelIcon from './ModelIcon.svelte';
	import type { QuestionResult, Model } from '$lib/types';

	let {
		questions,
		models
	}: {
		questions: QuestionResult[];
		models: Model[];
	} = $props();

	let expandedReasoning = $state<{ questionId: string; modelId: string } | null>(null);
	let hoveredBubble = $state<{ questionId: string; modelId: string } | null>(null);

	function getModel(modelId: string): Model | undefined {
		return models.find((m) => m.id === modelId);
	}

	function openReasoning(questionId: string, modelId: string) {
		if (expandedReasoning?.questionId === questionId && expandedReasoning?.modelId === modelId) {
			expandedReasoning = null;
		} else {
			expandedReasoning = { questionId, modelId };
		}
	}

	function isExpanded(questionId: string, modelId: string): boolean {
		return expandedReasoning?.questionId === questionId && expandedReasoning?.modelId === modelId;
	}

	function isHovered(questionId: string, modelId: string): boolean {
		return hoveredBubble?.questionId === questionId && hoveredBubble?.modelId === modelId;
	}
</script>

<div class="questions-list">
	{#each questions as q (q.questionId)}
		<div class="question-card">
			<p class="q-text">{q.questionText}</p>
			<div class="q-options">
				{#each q.options as option (option)}
					{@const isUserAnswer = !!q.userAnswer && option === q.userAnswer}
					{@const respondents = q.aiResponses.filter((r) => r.selection === option)}
					<div class="q-option" class:user-selected={isUserAnswer}>
						<span class="q-option-text">{option}</span>
						{#if isUserAnswer}
							<span class="your-pick">You</span>
						{/if}

						{#if respondents.length > 0}
							<div class="ai-bubbles">
								{#each respondents as resp (resp.modelId)}
									{@const model = getModel(resp.modelId)}
									{#if model}
										<button
											class="ai-bubble"
											class:expanded={isExpanded(q.questionId, resp.modelId)}
											style="--bcolor: {model.color}"
											onclick={() => openReasoning(q.questionId, resp.modelId)}
											onmouseenter={() =>
												(hoveredBubble = { questionId: q.questionId, modelId: resp.modelId })}
											onmouseleave={() => (hoveredBubble = null)}
											title={model.name}
										>
											<ModelIcon logo={model.logo} name={model.name} size={16} />
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
					{#each q.aiResponses.filter((r) => r.selection === option) as resp (resp.modelId)}
						{#if isExpanded(q.questionId, resp.modelId)}
							{@const model = getModel(resp.modelId)}
							{#if model}
								<div class="reasoning-panel" style="--bcolor: {model.color}">
									<div class="reasoning-header">
										<ModelIcon logo={model.logo} name={model.name} size={20} color={model.color} />
										<strong>{model.name}</strong>
										<button class="close-reasoning" onclick={() => (expandedReasoning = null)}
											>×</button
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

<style>
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

	.ai-bubble :global(svg) {
		color: var(--bcolor);
	}

	.ai-bubble :global(img) {
		border-radius: 50%;
		object-fit: cover;
	}

	.ai-bubble:hover :global(svg),
	.ai-bubble.expanded :global(svg) {
		color: white;
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

	.reasoning-header :global(svg),
	.reasoning-header :global(img) {
		border-radius: 4px;
		flex-shrink: 0;
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
</style>
