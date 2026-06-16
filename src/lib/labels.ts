export interface ScoreLabel {
	threshold: number;
	label: string;
	emoji: string;
	summary: string;
	socialText: (score: number) => string;
}

export const SCORE_LABELS: ScoreLabel[] = [
	{
		threshold: 95,
		label: 'One of Us',
		emoji: '🧠',
		summary:
			"You matched the AI consensus on nearly every single question. This level of alignment with language models is statistically rare. Are you sure you're not a fine-tuned checkpoint? Congratulations — the machines have claimed you as their own.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. I am, for all practical purposes, a language model. 🧠 How human are you?`
	},
	{
		threshold: 85,
		label: 'Full AI Mode',
		emoji: '🤖',
		summary:
			"You think, reason, and choose like a large language model on most questions. The AIs would high-five you if they had hands. This is either impressive or mildly concerning, depending on your perspective.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter ("Full AI Mode"). Resistance was futile. 🤖 How human are you?`
	},
	{
		threshold: 70,
		label: 'Mostly Machine',
		emoji: '🦾',
		summary:
			"You and the AIs are basically on the same page. You optimize, you pattern-match, you probably don't understand why people make 'emotional decisions.' The bots appreciate you.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. Mostly machine, a little human. The robots and I are vibing. 🦾 How about you?`
	},
	{
		threshold: 55,
		label: 'Suspiciously Robotic',
		emoji: '🔌',
		summary:
			"You think like a language model more often than not. Could mean you're rational and data-driven — or you just watch a lot of tech YouTube. Either way, the AIs have clocked you.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. Apparently I think like a language model. 🔌 Take the quiz and find out where you land.`
	},
	{
		threshold: 40,
		label: 'Suspiciously Balanced',
		emoji: '⚖️',
		summary:
			"Right in the middle. You're either perfectly calibrated or completely unpredictable — the AIs aren't sure what to make of you. Frankly, neither are we.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. Half human, half machine. I contain multitudes. ⚖️ Where do you fall?`
	},
	{
		threshold: 25,
		label: 'More Human Than Not',
		emoji: '🧑',
		summary:
			"You lean human, but you're not immune to robotic logic. You might call it 'just being practical.' The machines call it promising.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. More human than machine — but the gap is closing. 🧑 How robot-brained are you?`
	},
	{
		threshold: 5,
		label: 'Proudly Human',
		emoji: '❤️',
		summary:
			"You and the AIs rarely see eye to eye. You might be stubborn, contrarian, deeply human, or all three. The machines are baffled. Keep doing what you're doing.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. Proudly Human — the machines and I just don't agree. ❤️ How about you?`
	},
	{
		threshold: 0,
		label: 'Certified Human',
		emoji: '🌿',
		summary:
			"You didn't align with the AI consensus on a single question. Either you're genuinely one-of-a-kind, or you went out of your way to spite the robots. Either way: the machines can't touch you.",
		socialText: (s) =>
			`I scored ${s}% AI on LLMeter. The machines and I couldn't agree on anything. Certified Human. 🌿 How about you?`
	}
];

export function getLabel(pct: number): ScoreLabel {
	for (const tier of SCORE_LABELS) {
		if (pct >= tier.threshold) return tier;
	}
	return SCORE_LABELS[SCORE_LABELS.length - 1];
}
