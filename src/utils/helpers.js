/** @module mobx-from-store/helpers */

/**
 * Allows you to map the values of an array by properies. This way you can
 * create an object with a key as the first property and the whole object, or
 * just a value of a second property.
 *
 * @public
 * @method
 * @exports
 * @param {Object[]} array - Array to map
 * @param {String}  property - First property to map against
 * @param {String} itemProperty - Second property to map against
 * @returns {Object} Mapped object
 */
export function mapValues(array, property, itemProperty) {
  const obj = {};
  array.forEach((item) => {
    obj[item[property]] = itemProperty ? item[itemProperty] : item;
  });
  return obj;
}

/**
 * A noop Method
 *
 * @public
 * @method
 * @exports
 * @returns {undefined}
 */
export function noop() { /* noop */ }
