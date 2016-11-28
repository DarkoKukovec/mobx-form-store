export function mapValues(array) {
  const obj = {};
  array.forEach((item) => {
    obj[item.name] = item.obj;
  });
  return obj;
}
