import { store } from 'src/lib/server/store'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {
		store,
	}
}) satisfies PageServerLoad
