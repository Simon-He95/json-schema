import { isArray, isPlainObject } from './common';

export function deepMerge(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) return target;
  Object.keys(target).forEach((key) => {
    const value = target[key];
    const source_value = source[key];
    if (!source_value) return;
    if (isPlainObject(value)) target[key] = deepMerge(value, source_value);
    else if (isArray(value) && isArray(source_value)) {
      target[key] = value.map((child, i) => deepMerge(child, source_value[i]));
    } else if (Reflect.has(target, key)) {
      target[key] = source_value;
    }
  });
  return target;
}
