/**
 * Get the Key of a Object passed the value
 * 
 * @param {object} object - Obect to find the the key of the value
 * @param {string} value - Value used to retrieve the key of the Object
 * @returns {string} Key of the Object match the value
 */
const getKeyByValue = (object, value) => {
	return Object.keys(object).find(key => object[key] === value)
}

export { getKeyByValue }