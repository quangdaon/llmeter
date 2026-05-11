<script lang="ts">
	import QuestionBreakdown from '$lib/components/QuestionBreakdown.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="dev-page">
	<div class="dev-container">
		<div class="dev-badge">DEV ONLY</div>
		<h1 class="page-title">Question Reference</h1>
		<p class="page-meta">
			{data.questions.length} question{data.questions.length === 1 ? '' : 's'} ·
			{data.models.length} model{data.models.length === 1 ? '' : 's'}
		</p>
		<p class="page-hint">
			AI bubbles appear next to each option. Hover to see which model. Click to read their reasoning.
		</p>

		<QuestionBreakdown questions={data.questions} models={data.models} />
	</div>
</div>

<style>
	.dev-page {
		flex: 1;
		padding: 3rem 1.5rem;
		display: flex;
		justify-content: center;
	}

	.dev-container {
		width: 100%;
		max-width: 720px;
	}

	.dev-badge {
		display: inline-block;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		background: #f43f5e;
		color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.page-title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--text);
		margin-bottom: 0.4rem;
	}

	.page-meta {
		font-size: 0.85rem;
		color: var(--muted);
		margin-bottom: 0.5rem;
	}

	.page-hint {
		font-size: 0.82rem;
		color: var(--muted);
		margin-bottom: 2rem;
		line-height: 1.5;
	}
</style>
