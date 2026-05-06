<script lang="ts">
	import type { PageData } from './$types';
	import type { QuizAnswer } from '$lib/types';

	let { data }: { data: PageData } = $props();

	type Phase = 'quiz' | 'submitting' | 'done';

	let phase = $state<Phase>('quiz');
	let currentIndex = $state(0);
	let answers = $state<QuizAnswer[]>([]);
	let selectedOption = $state<string | null>(null);
	let isAnimating = $state(false);

	// Dispute easter egg state
	let disputeUsed = $state(false);         // Passed to evaluate (affects score)
	let disputeBonusGranted = $state(false); // Has bonus been granted yet?
	let showDisputeModal = $state(false);
	let disputeText = $state('');
	let disputeModalState = $state<'input' | 'response'>('input');
	let isRepeatDispute = $state(false);     // True when user disputes a 2nd+ time

	let currentQuestion = $derived(data.questions[currentIndex]);
	let progress = $derived(((currentIndex) / data.questions.length) * 100);
	let isLastQuestion = $derived(currentIndex === data.questions.length - 1);

	function selectOption(option: string) {
		if (isAnimating) return;
		selectedOption = option;
	}

	function nextQuestion() {
		if (!selectedOption || isAnimating) return;

		answers.push({ questionId: currentQuestion.id, answer: selectedOption });
		isAnimating = true;

		setTimeout(() => {
			if (isLastQuestion) {
				submitQuiz();
			} else {
				currentIndex++;
				selectedOption = null;
				isAnimating = false;
			}
		}, 300);
	}

	async function submitQuiz() {
		phase = 'submitting';
		try {
			const response = await fetch('/api/evaluate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answers, disputeUsed }),
			});
			const result = await response.json();
			sessionStorage.setItem('llmeter_result', JSON.stringify(result));
			sessionStorage.setItem('llmeter_models', JSON.stringify(data.models));
			window.location.href = '/results';
		} catch {
			phase = 'quiz';
			isAnimating = false;
		}
	}

	function openDisputeModal() {
		showDisputeModal = true;
		disputeModalState = 'input';
		disputeText = '';
	}

	function closeDisputeModal() {
		showDisputeModal = false;
	}

	function submitDispute() {
		disputeModalState = 'response';
		if (!disputeBonusGranted) {
			disputeUsed = true;
			disputeBonusGranted = true;
			isRepeatDispute = false;
		} else {
			isRepeatDispute = true;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && selectedOption) nextQuestion();
		if (e.key === 'Escape') closeDisputeModal();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="quiz-page">
	{#if data.questions.length === 0}
		<div class="empty-state">
			<p class="empty-icon">🤖</p>
			<h2>No questions yet</h2>
			<p>The interrogator hasn't run yet. Check back soon!</p>
			<a href="/" class="back-home">← Back to Home</a>
		</div>
	{:else if phase === 'quiz'}
		<div class="quiz-container">
			<header class="quiz-header">
				<a href="/" class="back-link">← Back</a>
				<div class="progress-wrapper">
					<div class="progress-track">
						<div class="progress-fill" style="width: {progress}%"></div>
					</div>
					<span class="progress-label">{currentIndex} / {data.questions.length}</span>
				</div>
			</header>

			<div class="question-area" class:fading={isAnimating}>
				<p class="question-number">Question {currentIndex + 1}</p>
				<h1 class="question-text">{currentQuestion.text}</h1>

				<div class="options-grid">
					{#each currentQuestion.options as option}
						<button
							class="option-btn"
							class:selected={selectedOption === option}
							onclick={() => selectOption(option)}
						>
							<span class="option-text">{option}</span>
						</button>
					{/each}
				</div>

				<div class="question-actions">
					<button
						class="next-btn"
						disabled={!selectedOption || isAnimating}
						onclick={nextQuestion}
					>
						{isLastQuestion ? 'See My Results →' : 'Next Question →'}
					</button>

					<button class="dispute-link" onclick={openDisputeModal}>
						I object to these options
					</button>
				</div>
			</div>
		</div>
	{:else if phase === 'submitting'}
		<div class="loading-screen">
			<div class="loading-spinner"></div>
			<p>Consulting the machines…</p>
		</div>
	{/if}

	{#if showDisputeModal}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal-backdrop" onclick={closeDisputeModal} role="presentation">
			<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
				{#if disputeModalState === 'input'}
					<h2 class="modal-title">Lodging a Formal Objection?</h2>
					<p class="modal-desc">
						Go ahead. Tell us exactly what's wrong with these perfectly reasonable options.
					</p>
					<textarea
						class="dispute-textarea"
						bind:value={disputeText}
						placeholder="My grievances are as follows..."
						rows="4"
					></textarea>
					<div class="modal-actions">
						<button class="modal-cancel" onclick={closeDisputeModal}>Actually, never mind</button>
						<button class="modal-submit" onclick={submitDispute} disabled={!disputeText.trim()}>
							Submit Objection
						</button>
					</div>
				{:else}
					{#if !isRepeatDispute}
						<h2 class="modal-title">📋 Noted. (Not Really.)</h2>
						<p class="modal-desc response-text">
							Your objection went nowhere. There's no feedback system here — this text field is purely decorative.
						</p>
						<p class="modal-desc response-text">
							That said: the AIs were given the exact same options and told they <em>must</em> pick one. No appeals, no write-ins. The fact that you pushed back when they couldn't? Very human of you.
						</p>
						<p class="modal-highlight">+5% humanity bonus applied. 🧑</p>
					{:else}
						<h2 class="modal-title">⚠️ No Further Bonuses Apply</h2>
						<p class="modal-desc response-text">
							You've already registered your dissent. The algorithm has taken note once, and once is
							enough. No further humanity bonuses apply.
						</p>
						<p class="modal-desc response-text">
							Interestingly, trying again is itself a very human thing to do.
						</p>
					{/if}

					<div class="modal-actions">
						<button class="modal-submit" onclick={closeDisputeModal}>Fine.</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.quiz-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.quiz-container {
		width: 100%;
		max-width: 680px;
	}

	.quiz-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.back-link {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.9rem;
		white-space: nowrap;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--text);
	}

	.progress-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.progress-track {
		flex: 1;
		height: 6px;
		background: var(--surface-2);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 3px;
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.progress-label {
		font-size: 0.8rem;
		color: var(--muted);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.question-area {
		transition: opacity 0.25s ease, transform 0.25s ease;
	}

	.question-area.fading {
		opacity: 0;
		transform: translateX(-12px);
	}

	.question-number {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		margin: 0 0 0.75rem;
	}

	.question-text {
		font-size: clamp(1.4rem, 3vw, 1.9rem);
		font-weight: 700;
		line-height: 1.3;
		margin: 0 0 2rem;
		color: var(--text);
	}

	.options-grid {
		display: grid;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.option-btn {
		display: flex;
		align-items: center;
		padding: 1rem 1.25rem;
		background: var(--surface);
		border: 2px solid var(--border);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.18s ease;
		text-align: left;
	}

	.option-btn:hover {
		border-color: var(--accent);
		background: var(--surface-hover);
		transform: translateX(4px);
	}

	.option-btn.selected {
		border-color: var(--accent);
		background: var(--accent-subtle);
		box-shadow: 0 0 0 1px var(--accent);
	}

	.option-text {
		font-size: 1rem;
		color: var(--text);
		font-weight: 500;
	}

	.question-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.next-btn {
		padding: 0.875rem 2rem;
		background: var(--accent);
		color: var(--bg);
		border: none;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.18s ease;
		letter-spacing: 0.02em;
	}

	.next-btn:hover:not(:disabled) {
		background: var(--accent-bright);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(99, 179, 237, 0.35);
	}

	.next-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.dispute-link {
		background: none;
		border: none;
		color: var(--muted);
		font-size: 0.78rem;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-style: dotted;
	}

	.dispute-link:hover {
		color: var(--text-dim);
	}

	/* Loading */
	.loading-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		color: var(--muted);
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
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

	/* Empty state */
	.empty-state {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		max-width: 400px;
	}

	.empty-icon {
		font-size: 3rem;
	}

	.empty-state h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text);
	}

	.empty-state p {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.back-home {
		color: var(--accent);
		text-decoration: none;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		z-index: 100;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
	}

	.modal {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 2rem;
		width: 100%;
		max-width: 480px;
		animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
	}

	.modal-title {
		font-size: 1.2rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
		color: var(--text);
	}

	.modal-desc {
		font-size: 0.9rem;
		color: var(--text-dim);
		margin: 0 0 1rem;
		line-height: 1.6;
	}

	.response-text {
		color: var(--text-dim);
	}

	.modal-highlight {
		background: var(--accent-subtle);
		border: 1px solid var(--accent);
		border-radius: 8px;
		padding: 0.75rem 1rem;
		color: var(--accent-bright);
		font-weight: 600;
		font-size: 0.9rem;
		margin: 0.5rem 0 1.5rem;
	}

	.dispute-textarea {
		width: 100%;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--text);
		font-family: inherit;
		font-size: 0.9rem;
		padding: 0.75rem;
		resize: vertical;
		margin-bottom: 1.25rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	.dispute-textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.modal-cancel {
		background: none;
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--muted);
		padding: 0.6rem 1rem;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.modal-cancel:hover {
		border-color: var(--text-dim);
		color: var(--text-dim);
	}

	.modal-submit {
		background: var(--accent);
		border: none;
		border-radius: 8px;
		color: var(--bg);
		padding: 0.6rem 1.25rem;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.18s ease;
	}

	.modal-submit:hover:not(:disabled) {
		background: var(--accent-bright);
	}

	.modal-submit:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
