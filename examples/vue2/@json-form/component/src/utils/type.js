export function isArray(target) {
  return target instanceof Array;
}

export function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

export function isEmpty(target) {
  return target === undefined || target === '' || target === null;
}

export function isEmptyArray(target) {
  return isArray(target) && (target.length < 1)
}

export function isDate(target) {
  return target instanceof Date;
}

export function isUef(target) {
  return target === undefined;
}

export function isString(target) {
  return typeof target === 'string';
}

export function isFunction (target) {
  return typeof target === 'function'
}

export function isPromise (target) {
  return target instanceof Promise
}