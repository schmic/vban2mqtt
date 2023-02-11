import { env } from '$env/dynamic/private'
import { parseHexToInt } from 'src/lib/utils'
import {
	EServicePINGApplicationType,
	EServicePINGFeatures,
	ESubProtocol,
	VBANSerialPacket,
	VBANServer,
	type IVBANServerOptions,
} from 'vban'
import mqtt, { updateAvailabilityTopic } from './mqtt'
import { stateTopic } from './mqtt.topics'
import { add, store } from './store'

const vbanOptions: IVBANServerOptions = {
	application: {
		applicationName: 'VBAN Foo',
		applicationType: EServicePINGApplicationType.SERVER,
		features: [EServicePINGFeatures.TXT, EServicePINGFeatures.SERIAL],
		color: { blue: 74, green: 232, red: 57 },
	},
	autoReplyToPing: true,
}

if (globalThis.__vban) globalThis.__vban.close()
const vban = new VBANServer(vbanOptions)
globalThis.__vban = vban

vban.on('error', (err) => {
	console.log(`server error:\n${err.stack}`)
	vban.close()
})

vban.on('message', (packet, sender) => {
	if (packet.subProtocol == ESubProtocol.SERIAL) {
		const { data } = packet as VBANSerialPacket
		const dataParts = data.toString('hex').toUpperCase().match(/.{6}/g)

		dataParts
			?.map((p) => p.match(/.{2}/g))
			.forEach((dataPart) => {
				if (!dataPart) return

				const [channel, control, hex] = dataPart as [string, string, string]
				const value = parseHexToInt(hex)

				const { streamName } = packet
				const channelControl = `${channel}_${control}`
				console.debug('👉 stateTopic', stateTopic(streamName, channelControl), value)

				add(streamName, channelControl)

				if (store[streamName][channelControl].type === 'slider')
					mqtt.publish(stateTopic(streamName, channelControl), value.toString(), { retain: true })
				if (store[streamName][channelControl].type === 'button')
					mqtt.publish(stateTopic(streamName, channelControl), value === 0 ? 'OFF' : 'ON', {
						retain: true,
					})
			})
	}
})

vban.on('listening', () => {
	const address = vban.address()
	updateAvailabilityTopic()
	console.log(`👉 VBAN: Listening on: ${address.address}:${address.port}`)
})

vban.bind(env.VBAN_PORT ? parseInt(env.VBAN_PORT) : 6980, env.VBAN_ADDRESS)

export default vban

// if (packet.subProtocol == ESubProtocol.SERVICE) {
// 	const { data, streamName } = packet as VBANServicePacket
// 	console.log('####', streamName, data)
// }

//We will send a text message each time we receive a packet (for example)
//try to create a new TEXT packet
// const textPacket = new VBANTEXTPacket(
//     {
//         streamName: 'Command1', //the streamName waited by the other tool
//         formatBit: EFormatBit.VBAN_DATATYPE_BYTE8, //the storage format, currently this is the only option available
//         streamType: ETextEncoding.VBAN_TXT_UTF8 //we will send it in UTF8, most of VM Tools use UTF8
//     },
//     'test' // => the message we want to send (always in UTF8, if streamType is not UTF8, the library will convert)
// );
//send it to 127.0.0.1 on port 6980
// vban.send(textPacket, 6980, '127.0.0.1');
