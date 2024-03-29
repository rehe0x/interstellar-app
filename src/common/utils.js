import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(duration)

export const deepFreeze = (obj) => {
  for (const key in obj) {
    const v = obj[key]
    if (v && typeof v === 'object') {
      deepFreeze(v)
    }
  }
  return Object.freeze(obj)
}

export const remainingTime = (seconds) => {
  const mo = dayjs.duration(seconds, 'seconds')
  if (mo.days() === 0) {
    return `${mo.hours()}h ${mo.minutes()}m ${mo.seconds()}s`
  } else {
    return `${mo.days()}d ${mo.hours()}h ${mo.minutes()}m ${mo.seconds()}s`
  }
}

export const wait = (seconds) => new Promise((resolve, reject) => { setTimeout(() => { resolve('ok') }, seconds) })

/* 数字金额逢三加， 比如 123,464.23 */
export const numberToCurrency = (value) => {
  if (!value) return '0'
  // 整数部分处理，增加,
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return intPartFormat
}
