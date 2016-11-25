/**
 * Check if the field has a value
 *
 * @return {Boolean} Field has a value set
 */
export function required() {
}

/**
 * Check if the field value has a minimal length
 *
 * @param {Number} length - Minimal required length
 * @return {Boolean} Field value has a minimal length
 */
export function minLength(length) {
}

/**
 * Check if the field value has a maximal length
 *
 * @param {Number} length - Minimal required length
 * @return {Boolean} Field value has a maximal length
 */
export function maxLength(length) {
}

/**
 * Check if the field value is a valid email
 *
 * @return {Boolean} Field value is a valid email
 */
export function email() {
}

/**
 * Check if the field values match
 *
 * @param {String} fieldName - Name of the other field beeing compared to
 * @return {Boolean} Field value matches the fieldName field value
 */
export function equals(fieldName) {
}
