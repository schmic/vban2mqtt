<script lang="ts">
	import ChannelControl from 'src/components/channelControl.svelte'
	import NavBar from 'src/components/navBar.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<NavBar />

{#each Object.keys(data.store) as streamName}
	<div class="flex flex-wrap">
		{#each Object.entries(data.store[streamName]) as [channelControl, options]}
			<ChannelControl {streamName} {channelControl} {options} />
		{/each}
	</div>
{/each}
