export const _toString = Object.prototype.toString;

export function isPlainObject(o) {
  return _toString.call(o) === '[object Object]';
}

export function isArray(o) {
  return Array.isArray(o);
}
