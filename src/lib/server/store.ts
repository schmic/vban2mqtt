import { readFile, stat, writeFile } from 'fs/promises'
import mqtt from './mqtt'
import {
	binarySensorDiscoveryTopic,
	discoveryTopic,
	haConfig,
	sensorDiscoveryTopic,
} from './mqtt.topics'

export type ChannelControlOptions = {
	type: 'slider' | 'button'
	name: string
	publish: boolean
}

type Store = {
	[key: string]: {
		[key: string]: ChannelControlOptions
	}
}

const publishOnAdd = false
const defaultOptions = (name: string): ChannelControlOptions => {
	return {
		type: 'slider',
		name,
		publish: publishOnAdd,
	}
}

export const store: Store = await initStore()

export async function add(streamName: string, channelControl: string) {
	store[streamName] = store[streamName] || {}

	if (store[streamName][channelControl]) return

	const options = defaultOptions(channelControl)
	store[streamName][channelControl] = options
	writeFile('store.json', JSON.stringify(store, undefined, 2))

	console.debug('👉 add, streamName, channelControl', streamName, channelControl)

	update(streamName, channelControl, options)
}

export async function update(
	streamName: string,
	channelControl: string,
	options: ChannelControlOptions,
) {
	const optionsBefore = store[streamName][channelControl]
	store[streamName][channelControl] = options
	writeFile('store.json', JSON.stringify(store, undefined, 2))

	console.debug('👉 update, streamName, channelControl', streamName, channelControl, options)

	if (optionsBefore.type !== options.type) {
		mqtt.publish(discoveryTopic(streamName, channelControl, optionsBefore), '')
	}

	mqtt.publish(
		discoveryTopic(streamName, channelControl, options),
		options.publish ? haConfig(streamName, channelControl, options) : '',
		{ retain: options.publish },
	)
}

export async function setupHADevices() {
	console.log(`👉 Setting up Home Assistant Discovery & Devices ...`)

	Object.entries(store).forEach((entry) => {
		const [streamName, channelControls] = entry
		Object.entries(channelControls).forEach((entry) => {
			const [channelControl, options] = entry

			console.debug(
				`   [streamName: ${streamName}], [channelControl: ${channelControl}],\n     [options: ${JSON.stringify(
					options,
				)}]`,
			)

			mqtt.publish(
				discoveryTopic(streamName, channelControl, options),
				options.publish ? haConfig(streamName, channelControl, options) : '',
				{ retain: options.publish },
			)
		})
	})
}

export async function clearHADevices() {
	console.log(`👉 Clearing Home Assistant Discovery ...`)

	Object.entries(store).forEach((entry) => {
		const [streamName, channelControls] = entry
		Object.entries(channelControls).forEach((entry) => {
			const [channelControl, options] = entry

			console.debug('👉 streamName, channelControl, options:', streamName, channelControl, options)

			if (options.type === 'slider')
				mqtt.publish(sensorDiscoveryTopic(streamName, channelControl), '')
			if (options.type === 'button')
				mqtt.publish(binarySensorDiscoveryTopic(streamName, channelControl), '')
		})
	})
}

async function initStore(): Promise<Store> {
	const filename = 'store.json'
	try {
		await stat(filename)
		const jsonContent = (await readFile(filename)).toString()
		return JSON.parse(jsonContent)
	} catch {
		return {}
	}
}
