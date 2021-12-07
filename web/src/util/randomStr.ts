export const RandomStrMaxLength = 300

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
const characterLength = characters.length

/**
 * Generates a random, variable length string of lowercase alphanumeric characters.
 *
 * @param {number} length The length of the random string.
 * @returns {string}
 */
export const randomStr = (length: number): string => {
  let result = ''

  length = length <= 0 ? 1 : length
  length = length > RandomStrMaxLength ? RandomStrMaxLength : length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characterLength))
  }

  return result
}
