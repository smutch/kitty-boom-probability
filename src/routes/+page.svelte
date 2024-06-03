<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	let started = false;
	let nPlayers = 3;
	let nBombs = 4;
	let nDiscardedDiffuse = 0;
	let nCards = 56;

	const init = (started: boolean) => {
		if (!started) return;
		nBombs = nPlayers - 1;
		nDiscardedDiffuse = nPlayers < 4 ? 6 - nPlayers - 2 : 0;
		nCards = 56 - nPlayers * 8 - (4 - nBombs) - nDiscardedDiffuse;
	};

	$: init(started);

	$: nBombs = nPlayers - 1;
	$: chance = Math.min(nBombs / nCards, 1.0) * 100;
	$: threatLevel = chance < 50 ? 'success' : chance < 75 ? 'warning' : 'error';

	const popupWhoops: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupWhoops',
		// Defines which side of your trigger the popup will appear
		placement: 'top'
	};

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'alert',
		title: 'Boom!',
		image:
			'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2VlMnNlYTN5cnFtM2M0YjBjNzV3emxqd3BhdWlpMTh5ZW9jenhqbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/E5jmd4OQ7PSo7JKlAR/giphy.gif',
		buttonTextCancel: 'X'
	};

	const aboutModal: ModalSettings = {
		type: 'alert',
		title: 'About',
		body: '<p>This is a simple utility to track the random probability of picking up an exploding kitten in the game <a href="https://www.explodingkittens.com/">Exploding Kittens</a>. It is not endorsed by, nor affiliated with, Exploding Kittens Inc.</p> <p class="mt-4">Created by <a href="https://github.com/smutch">@smutch</a> using <a href="https://kit.svelte.dev">SvelteKit</a> and <a href="https://www.skeleton.dev/">Skeleton</a>.<br/>Exploding kitten gif by <a href="https://giphy.com/gifs/yay-congratulations-yesss-E5jmd4OQ7PSo7JKlAR">@tutimon</a>.</p>',
		buttonTextCancel: 'X',
		modalClasses:
			'bg-surface-100-800-token w-screen h-screen p-4 flex flex-col justify-center items-center'
	};
</script>

<div
	class="container h-full mx-auto flex flex-col justify-center items-center align-middle absolute"
>
	{#if !started}
		<div class="w-fit contents">
			<label class="label">
				<span>Players: {nPlayers}</span>
				<input type="range" bind:value={nPlayers} min="2" max="5" />
			</label>
			<label class="label mt-8">
				<button type="button" class="btn variant-ghost-success" on:click={() => (started = true)}
					>Start game!</button
				>
			</label>
		</div>
	{:else}
		<div transition:fade class="w-fit contents">
			<button
				type="button"
				class="btn btn-xl bg-gradient-to-br variant-gradient-error-warning"
				on:click={() => (nCards -= 1)}>Pick up a card</button
			>
			<p class="my-4 text-center">Cards left: {nCards}<br />Exploding kittens left: {nBombs}</p>
			<ProgressRadial
				class="my-8"
				meter="stroke-{threatLevel}-500"
				stroke={100}
				lowChance
				value={chance}>{chance.toFixed(2)}%</ProgressRadial
			>
			<button
				type="button"
				class="btn bg-gradient-to-br variant-filled-error dark:bg-error-600 mt-8"
				on:click={() => {
					nPlayers -= 1;
					modalStore.trigger(modal);
				}}>Player went BOOM!</button
			>
			<button class="btn btn-sm variant-ringed-warning mt-8" use:popup={popupWhoops}>Whoops!</button
			>
			<div class="card p-4 w-modal-slim" data-popup="popupWhoops">
				<p class="mb-4">Made a mistake?</p>
				<button
					type="button"
					class="btn bg-gradient-to-br variant-ringed-warning"
					on:click={() => (nCards += 1)}>Put a card back</button
				>
				<button
					type="button"
					class="btn bg-gradient-to-br variant-ringed-warning"
					on:click={() => (nPlayers += 1)}>Unexplode a player</button
				>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		</div>
	{/if}
</div>

<footer class="fixed bottom-0 right-0 m-8">
	<button
		class="btn btn-sm variant-ringed-primary mt-8"
		on:click={() => modalStore.trigger(aboutModal)}>About</button
	>
</footer>
