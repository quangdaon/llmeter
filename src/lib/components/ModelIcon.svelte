<script lang="ts">
	import { base } from '$app/paths';
	import { siAnthropic, siGoogle, siMeta, siMistralai, siOllama } from 'simple-icons';

	let {
		logo,
		name,
		size = 24,
		color = 'currentColor',
	}: { logo: string; name: string; size?: number; color?: string } = $props();

	type SimpleIcon = { path: string };

	const ICONS: Record<string, SimpleIcon> = {
		anthropic: siAnthropic,
		google: siGoogle,
		meta: siMeta,
		mistral: siMistralai,
		ollama: siOllama,
	};

	const slug = $derived(logo.split('/').pop()?.replace('.svg', '') ?? '');
	const icon = $derived(ICONS[slug] as SimpleIcon | undefined);
</script>

{#if icon}
	<svg
		role="img"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		style="fill: {color}; flex-shrink: 0;"
		aria-label={name}
	>
		<path d={icon.path} />
	</svg>
{:else}
	<img src="{base}{logo}" alt={name} width={size} height={size} style="flex-shrink: 0;" />
{/if}
