/** @module mobx-from-store/validators */

const EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

/**
 * Check if the field has a value
 *
 * @public
 * @method
 * @exports
 * @param {Object} field - object with value
 * @return {Boolean} Field has a value set
 */
export function required(field) {
  return Boolean(field.value) || field.value === 0;
}

/**
 * Check if the field value has a minimal length
 *
 * @public
 * @method
 * @exports
 * @param {Object} field - object with value
 * @param {Number} length - Minimal required length
 * @return {Boolean} Field value has a minimal length
 */
export function minLength(field, length) {
  return field.value
    ? field.value.length >= length || !field.value.length
    : false;
}

/**
 * Check if the field value has a maximal length
 *
 * @public
 * @method
 * @exports
 * @param {Object} field - object with value
 * @param {Number} length - Minimal required length
 * @return {Boolean} Field value has a maximal length
 */
export function maxLength(field, length) {
  return field.value
    ? field.value.length <= length
    : false;
}

/**
 * Check if the field value is a valid email
 *
 * @public
 * @method
 * @exports
 * @param {Object} field - object with value
 * @return {Boolean} Field value is a valid email
 */
export function email(field) {
  return EMAIL.test(field.value);
}

/**
 * Check if the field values match
 *
 * @public
 * @method
 * @exports
 * @param {Object} field - object with value
 * @param {String} fieldName - Name of the other field beeing compared to
 * @return {Boolean} Field value matches the fieldName field value
 */
export function equals(field, fieldName) {
  return field.value === this.fields[fieldName].value;
}
