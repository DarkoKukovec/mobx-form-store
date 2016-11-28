export function mapValues(array, property, itemProperty) {
  const obj = {};
  array.forEach((item) => {
    obj[item[property]] = itemProperty ? item[itemProperty] : item;
  });
  return obj;
}

export function noop() { /* noop */ }
