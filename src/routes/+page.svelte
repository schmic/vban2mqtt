<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

{#each Object.keys(data.store) as streamName}
	<h2>
		{streamName}
	</h2>
	{#each Object.entries(data.store[streamName]) as [channelControl, options]}
		<p>{channelControl} - {JSON.stringify(options)}</p>
	{/each}
{/each}
