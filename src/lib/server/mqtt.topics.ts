import type { ChannelControlOptions } from './store'

export const deviceID = 'vban' // use packet.streamName name

const device = {
	ids: deviceID,
	name: 'VBAN',
	sw: 'vban2mqtt',
	mf: 'VoiceMeeter',
	mdl: 'Banana',
}

export const availabilityTopic = (deviceID: string) => `vban/${deviceID}/state`
export const stateTopic = (streamName: string, name: string) => `vban/${streamName}/${name}/state`
export const commandTopic = (streamName: string, name: string) =>
	`vban/${streamName}/${name}/command`

export const sensorDiscoveryTopic = (streamName: string, sensorName: string) =>
	`homeassistant/sensor/${deviceID}/${streamName}_${sensorName}/config`
export const sensorHAConfig = (
	streamName: string,
	faderName: string,
	options: ChannelControlOptions,
) =>
	`{
  "name": "${options.name}",
  "availability_topic": "${availabilityTopic(deviceID)}",
  "state_topic": "${stateTopic(streamName, faderName)}",
  "icon": "mdi:knob",
  "object_id": "${deviceID}_${streamName}_${faderName}", 
  "unique_id": "${deviceID}_${streamName}_${faderName}",
  "device": ${JSON.stringify(device)}
}`

export const binarySensorDiscoveryTopic = (streamName: string, buttonName: string) =>
	`homeassistant/binary_sensor/${streamName}/${buttonName}/config`
export const binarySensorHAConfig = (
	streamName: string,
	buttonName: string,
	options: ChannelControlOptions,
) =>
	`{
  "name": "${options.name}",
  "availability_topic": "${availabilityTopic(deviceID)}",
  "state_topic": "${stateTopic(streamName, buttonName)}",
  "icon": "mdi:button-pointer",
  "object_id": "${deviceID}_${streamName}_${buttonName}",
  "unique_id": "${deviceID}_${streamName}_${buttonName}",
  "device": ${JSON.stringify(device)}
}`

export const discoveryTopic = (
	streamName: string,
	channelControl: string,
	options: ChannelControlOptions,
) => {
	switch (options.type) {
		case 'button':
			return binarySensorDiscoveryTopic(streamName, channelControl)
		case 'slider':
			return sensorDiscoveryTopic(streamName, channelControl)
	}
}

export const haConfig = (
	streamName: string,
	channelControl: string,
	options: ChannelControlOptions,
) => {
	switch (options.type) {
		case 'button':
			return binarySensorHAConfig(streamName, channelControl, options)
		case 'slider':
			return sensorHAConfig(streamName, channelControl, options)
	}
}

// TODO Implement more HA Components

// export const switchDiscoveryTopic = (streamName: string, switchName: string) =>
// 	`homeassistant/switch/${streamName}/${switchName}/config`
// export const switchHAConfig = (streamName: string, switchName: string) =>
// 	`{
//   "name": "${streamName + ' ' + switchName}",
//   "availability_topic": "${availabilityTopic(deviceID)}",
//   "command_topic": "${commandTopic(streamName, switchName)}",
//   "state_topic": "${stateTopic(streamName, switchName)}",
//   "unique_id": "${deviceID}_${streamName}_${switchName}",
//   "device": ${JSON.stringify(device)}
// }`

// const buttonTriggerDiscoveryTopic = (deviceID: string, binarySensorName: string) =>
// 	`homeassistant/device_automation/${deviceID}/${binarySensorName}/config`

// const ButtonHAConfig = (deviceID: string, buttonName: string) => `
// {
//   "automation_type": "trigger",
//   "topic": "${stateTopic(deviceID, buttonName)}",
//   "type": "button_short_press",
//   "subtype": "${buttonName}",
//   "device": {
//     "identifiers": [
//       "${deviceID}"
//     ],
//     "name": "${deviceID}"
//   }
// }`

// const LightHAConfig = (deviceID: string, lightName: string) => `
// {
//   "availability": [
//     {
//       "topic": "${availabilityTopic(deviceID)}"
//     }
//   ],
//   "device": {
//     "identifiers": [
//       "${deviceID}"
//     ],
//     "name": "${deviceID}"
//   },
//   "name": "${deviceID + ' ' + lightName}",
//   "command_topic": "${commandTopic(deviceID, lightName)}",
//   "state_topic": "${stateTopic(deviceID, lightName)}",
//   "unique_id": "${deviceID + lightName}"
// }`

// const DimmableLightHAConfig = (deviceID: string, lightName: string) => `
// {
//   "availability": [
//     {
//       "topic": "${availabilityTopic(deviceID)}"
//     }
//   ],
//   "device": {
//     "identifiers": [
//       "${deviceID}"
//     ],
//     "name": "${deviceID}"
//   },
//   "name": "${deviceID + ' ' + lightName}",
//   "command_topic": "${commandTopic(deviceID, lightName)}",
//   "brightness_command_topic": "${commandTopic(deviceID, lightName)}",
//   "state_topic": "${stateTopic(deviceID, lightName)}",
//   "unique_id": "${deviceID + lightName}"
// }`
