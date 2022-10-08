import { isFunction, isUef } from './type';
import { formatDate } from './date';

/**
 * 安全调用引用内部方法
 * @param {Ref} targetRef 引用对象
 * @param {Function} cb 要调用的方法
 * @param {*} defaultValue 方法未成功调用时返回的默认值
 * @param {*} params 传入引用对象方法的参数
 * @returns
 */
export function safeCallRef(targetRef, cb, defaultValue, ...params) {
  if (isUef(targetRef)) return defaultValue;

  const handler = targetRef[cb];

  if (!isFunction(handler)) {
    if (process.env.NODE_ENV === 'development')
      console.error(`${targetRef}.${cb} is not a function`);
    return defaultValue;
  }

  return handler(...params);
}

export function getJSON(target, defaultValue) {
  try {
    return JSON.parse(target);
  } catch {
    return defaultValue || null;
  }
}

/**
 * 获取JSON序列化字符串
 * @param {Object | Array} target
 * @param {*} defaultValue 序列化失败时返回的值，默认返回null
 * @returns
 */
export function getJSONString(target, defaultValue) {
  if (typeof target === 'string') return target;

  try {
    return JSON.stringify(target);
  } catch {
    return defaultValue || null;
  }
}

export function capitalizeFstLetter(str) {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFstLetter(str) {
  if (!str) return;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getRandomUid(len = 8) {
  return Math.random()
    .toString(36)
    .slice(-1 * len);
}

/**
 * 将目标值转化为int类型数字，否则返回默认值
 * @param {*} target
 * @param {*} defaultValue
 * @returns
 */
export function getInt(target, defaultValue) {
  const result = parseInt(target);
  return isNaN(result) ? defaultValue : result;
}

export function getString(target, defaultValue) {
  return target.toString() || defaultValue;
}

/**
 * 生成表单提交随机字符串：YYYYMMDDhhmmss+8位随机值（总长度22位）
 * @returns String
 */
export function getNonceStr() {
  return `${formatDate(new Date(), 'YYYYMMDDHHmmss')}${getRandomUid()}`;
}
