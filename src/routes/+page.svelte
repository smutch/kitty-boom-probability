<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	let started = false;
	let nPlayers = 3;
	let nBombs = nPlayers - 1;
	let nDiscardedDiffuse = nPlayers < 4 ? 6 - nPlayers - 2 : 0;
	let nCards = 56 - nPlayers * 8 - (4 - nBombs) - nDiscardedDiffuse;

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
</script>

<div
	class="container h-full mx-auto flex flex-col justify-center items-center m-8 align-middle absolute x-50 y-50"
>
	{#if started}
		<div class="w-modal-slim contents">
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
				on:click={() => (nPlayers -= 1)}>Player went BOOM!</button
			>
			<p>
				<a href="https://giphy.com/gifs/yay-congratulations-yesss-E5jmd4OQ7PSo7JKlAR">via GIPHY</a>
			</p>
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
