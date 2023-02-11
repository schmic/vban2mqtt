export const parseHexToPercent = (hex: string, toFixed = 1) => {
	return Number.parseFloat(((parseInt(hex, 16) * 100) / 127).toFixed(toFixed))
}
export const parseHexToInt = (hex: string, toFixed = 0) => {
	return Number.parseInt(parseInt(hex, 16).toFixed(toFixed))
}
