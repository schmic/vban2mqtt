import { connect, type IClientOptions } from 'mqtt'
import { availabilityTopic, deviceID } from './mqtt.topics'
import { setupHADevices } from './store'

type ClientOptions = { will: { qos: 0 | 1 | 2; retain: boolean } } & IClientOptions

const mqttOptions: ClientOptions = {
	protocol: 'mqtt',
	hostname: 'mqtt.home',
	port: 1883,
	clean: true,
	connectTimeout: 5000,
	clientId: 'vban2mqtt',
	will: {
		topic: availabilityTopic(deviceID),
		payload: 'offline',
		qos: 1,
		retain: true,
	},
}

if (globalThis.__mqtt) {
	globalThis.__mqtt.removeAllListeners()
	globalThis.__mqtt.end()
}

const mqtt = connect(mqttOptions)

globalThis.__mqtt = mqtt

mqtt.on('connect', () => {
	updateAvailabilityTopic()
	console.log('👉 MQTT: connected\n')
})

mqtt.on('error', (error) => {
	console.debug('👉 error.name', error.name)
	throw error
})

export default mqtt

export async function reconnect() {
	mqtt.reconnect()
}

export async function updateAvailabilityTopic() {
	const { retain, qos } = mqttOptions.will

	if (mqtt.connected) {
		setupHADevices()
		mqtt.publish(availabilityTopic(deviceID), 'online', { retain, qos })
	}
}
