<script lang="ts">
	import type { ChannelControlOptions } from 'src/lib/server/store'

	const channelControlOptions = {
		type: ['slider', 'button'],
	}

	export let streamName: string
	export let channelControl: string
	export let options: ChannelControlOptions

	let formRef: any

	const submit = () => {
		console.debug('👉 formRef', formRef)
		formRef?.requestSubmit()
	}
</script>

<div class="card w-96 bg-neutral text-neutral-content m-4">
	<div class="card-body">
		<span class="card-title">{streamName}#{channelControl}</span>
		<form method="POST" bind:this={formRef}>
			<input type="hidden" name="streamName" value={streamName} />
			<input type="hidden" name="channelControl" value={channelControl} />
			<input type="hidden" name="options" value={JSON.stringify(options)} />
			<div class="card-actions justify-start flex-col">
				<div class="form-control">
					<label class="label">
						<span class="label-text w-16">Name</span>
						<input
							type="text"
							placeholder="a name ..."
							class="input input-bordered input-sm w-64 max-w-xs"
							on:change={submit}
							bind:value={options.name}
						/>
					</label>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text w-16">Type</span>
						<select
							class="select select-bordered select-sm w-32 max-w-xs"
							bind:value={options.type}
							on:change={submit}
						>
							{#each channelControlOptions.type as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</label>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text w-16">Publish</span>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							on:click={() => { options.publish = !options.publish }}
                            on:change={submit}
							bind:checked={options.publish}
						/>
					</label>
				</div>
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
</style>
