import { store, update } from 'src/lib/server/store'
import type { Actions, PageServerLoad } from './$types'

export const load = (async () => {
	return {
		store,
	}
}) satisfies PageServerLoad

export const actions: Actions = {
	async default({ request }) {
		const { streamName, channelControl, options } = Object.fromEntries(
			await request.formData(),
		) as unknown as {
			streamName: string
			channelControl: string
			options: string
		}

		update(streamName, channelControl, JSON.parse(options))

		return { success: true }
	},
}
