import moment from 'moment';

/**
 * 格式化时间
 * @param {Date} target
 * @param {String} format
 * @returns
 */
export function formatDate(target, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(target).format(format);
}

/**
 * 格式化时间，格式化为当年时隐藏年份
 *
 * @param {Date} target
 * @returns String
 */
export function formatDateLabel(target, placeholder = '-') {
  if (target < 1) return placeholder;

  if (!moment(target)._isValid) return placeholder;

  if (moment(target).year() === moment().year()) {
    return moment(target).format('MM-DD HH:mm:ss');
  }
  return moment(target).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 格式化unix时间戳为时间字符串
 *
 * @param {String | Number} target
 * @param {String} placeholder
 * @returns String
 */
export function formatUnixDate(target, placeholder = '-') {
  const time = parseInt(target);

  if (isNaN(time) || time <= 0) return placeholder;

  return formatDateLabel(time * 1000);
}

/**
 * 将时间加码为时间戳
 *
 * @param {String} target
 * @returns Number
 */
export function encodeTimestamp(target, defaultValue) {
  if (!target) return defaultValue;
  const result = new Date(target).getTime();
  return isNaN(result) ? defaultValue : result;
}

/**
 * 将时间加码为unix时间戳
 *
 * @param {String} target
 * @returns Number
 */
export function encodeUnixTimestamp(target, defaultValue) {
  if (!target) return defaultValue;
  const result = Math.round(new Date(target).getTime() / 1000);
  return isNaN(result) ? defaultValue : result;
}

/**
 * 将unix时间戳解码为日期对象
 *
 * @param {String | Number} target
 * @returns
 */
export function decodeUnixTimestamp(target) {
  const time = parseInt(target);

  if (isNaN(time)) return;

  return new Date(target * 1000);
}

/**
 * 格式化时间为 ‘xx天xx时xx分xx秒’
 * @param {Number} time
 * @returns
 */
export function formatTime(time) {
  let result = '';

  time = parseInt(time);

  if (isNaN(time) || time <= 0) return result;

  const handlerMap = new Map([
    [86400, '天'],
    [3600, '时'],
    [60, '分'],
    [1, '秒'],
  ]);

  for (const [key, value] of handlerMap) {
    const temp = Math.floor(time / key);
    if (temp > 0 || (temp === 0 && result)) {
      result += `${temp}${value}`;
    }
    time = time % key;
  }

  return result;
}

/**
 * 加密时间字符串为毫秒数
 * @param {String} time
 * @return {Number} 秒数
 */
export function decodeMilliTime(time) {
  if (!time) return;

  const timeMatch = time.match(/(\d+)/g);
  return (
    parseInt(
      parseInt(timeMatch[0] || 0) * 3600 +
        parseInt(timeMatch[1] || 0) * 60 +
        parseInt(timeMatch[2] || 0)
    ) * 1000
  );
}

/**
 * 加密时间字符串为秒数
 * @param {String} time
 * @return {Number} 秒数
 */
export function decodeTime(time) {
  if (!time) return;
  const timeMatch = time.match(/(\d+)/g);
  return parseInt(
    parseInt(timeMatch[0] || 0) * 3600 +
      parseInt(timeMatch[1] || 0) * 60 +
      parseInt(timeMatch[2] || 0)
  );
}

/**
 * 解密描述为时间字符串
 * @param {Number} time
 */
export function encodeTime(time) {
  const h = Math.floor(time / 3600);
  const hLeft = time % 3600;
  const m = Math.floor(hLeft / 60);
  const s = hLeft % 60;
  return `${h}:${m}:${s}`;
}
