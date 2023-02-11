import { readFile, stat, writeFile } from 'fs/promises'
import mqtt from './mqtt'
import {
	binarySensorDiscoveryTopic,
	binarySensorHAConfig,
	sensorDiscoveryTopic,
	sensorHAConfig,
} from './mqtt.topics'

type ChannelControlOptions = {
	type: 'slider' | 'button'
	name: string
	ignore: boolean
}

type Store = {
	[key: string]: {
		[key: string]: ChannelControlOptions
	}
}

export const store: Store = await initStore()

export async function add(streamName: string, channelControl: string) {
	store[streamName] = store[streamName] || {}

	if (!store[streamName][channelControl]) {
		store[streamName][channelControl] = {
			type: 'slider',
			name: channelControl,
			ignore: false,
		}
		console.debug('👉 add, streamName, channelControl', streamName, channelControl)
		mqtt.publish(
			sensorDiscoveryTopic(streamName, channelControl),
			sensorHAConfig(streamName, channelControl),
			{ retain: true },
		)
	}

	writeFile('store.json', JSON.stringify(store, undefined, 2))
}

export async function setupHADevices() {
	console.log(`👉 Setting up Home Assistant Discovery & Devices ...`)

	Object.entries(store).forEach((entry) => {
		const [streamName, channelControls] = entry
		Object.entries(channelControls).forEach((entry) => {
			const [channelControl, options] = entry

			if (options.ignore) {
				console.log(`👉 ignore ${streamName}/${channelControl}`)
				return
			}

			console.debug(
				`   [streamName: ${streamName}], [channelControl: ${channelControl}], [options: ${options}]`,
			)

			if (options.type === 'slider')
				mqtt.publish(
					sensorDiscoveryTopic(streamName, channelControl),
					sensorHAConfig(streamName, channelControl, options.name),
					{ retain: true },
				)
			if (options.type === 'button')
				mqtt.publish(
					binarySensorDiscoveryTopic(streamName, channelControl),
					binarySensorHAConfig(streamName, channelControl, options.name),
					{ retain: true },
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
