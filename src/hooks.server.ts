import type { Handle } from '@sveltejs/kit'
import 'src/lib/server/mqtt'
import 'src/lib/server/vban'

export const handle: Handle = async ({ event, resolve }) => {
	return await resolve(event)
}
