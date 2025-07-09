import { jwtDecode } from 'jwt-decode'
import { EMPTY_STRING, FORMAT_NUMBER, NUMBER_ZERO, REGEX } from '@/utils/constants/common'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { TimeFormatEnum } from '../enum/common'
dayjs.extend(duration)

/**
 * Compares two objects and returns a partial object containing the updated values.
 * @param originalData - The original data object.
 * @param editedData - The edited data object.
 * @returns An object containing keys from editedData with values that differ from originalData.
 */
export const compareDataUpdate = (
  originalData: { [key: string]: any },
  editedData: { [key: string]: any }
): { [key: string]: any } => {
  const result: { [key: string]: any } = {}

  Object.entries(originalData).forEach(([key, value]) => {
    if (Array.isArray(value) && Array.isArray(editedData[key])) {
      const changedArray = editedData[key].reduce((acc, editedItem, index) => {
        const originalItem = value[index]

        if (!originalItem || JSON.stringify(originalItem) !== JSON.stringify(editedItem)) {
          acc.push(editedItem)
        }
        return acc
      }, [] as any[])

      if (changedArray.length > NUMBER_ZERO) {
        result[key] = changedArray
      }
    } else if (JSON.stringify(value) !== JSON.stringify(editedData[key])) {
      result[key] = editedData[key]
    }
  })

  Object.keys(editedData).forEach((key) => {
    if (!(key in originalData)) {
      result[key] = editedData[key]
    }
  })
  return result
}

export function formatLastActive(isoString?: string | null, _tick?: number): string {
  if (!isoString) return ''

  const lastTime = dayjs(isoString)
  if (!lastTime.isValid()) return 'Không rõ thời gian hoạt động'

  const now = dayjs()
  const diffMin = now.diff(lastTime, 'minute')
  const diffHr = now.diff(lastTime, 'hour')
  const diffDay = now.diff(lastTime, 'day')

  if (diffMin < 1) return 'Vừa mới hoạt động'
  if (diffMin < 60) return `Hoạt động ${diffMin} phút trước`
  if (diffHr < 24) return `Hoạt động ${diffHr} giờ trước`
  if (diffDay < 7) return `Hoạt động ${diffDay} ngày trước`

  return `Hoạt động vào ${lastTime.format('DD/MM/YYYY')}`
}

export const getDecodedToken = <T = any>(): T | null => {
  const token = localStorage.getItem('access_token')
  if (!token) return null

  try {
    return jwtDecode<T>(token)
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

/**
 * Function to format phone numbers in the form (xxx) xxx-xxx.
 * @param value is the value used for formatting.
 * @returns phone number in format.
 */
export const formatPhoneNumber = (value: string): string => {
  if (!value) return ''

  const phoneNumber = value.replace(REGEX.number, '')
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < FORMAT_NUMBER.numberFour) return phoneNumber

  if (phoneNumberLength < FORMAT_NUMBER.numberSeven) {
    return `(${phoneNumber.slice(NUMBER_ZERO, FORMAT_NUMBER.numberThree)}) ${phoneNumber.slice(
      FORMAT_NUMBER.numberThree
    )}`
  }

  return `(${phoneNumber.slice(NUMBER_ZERO, FORMAT_NUMBER.numberThree)}) ${phoneNumber.slice(
    FORMAT_NUMBER.numberThree,
    FORMAT_NUMBER.numberSix
  )}-${phoneNumber.slice(FORMAT_NUMBER.numberSix, FORMAT_NUMBER.numberTen)}`
}

export const formatSecondsToMMSS = (seconds: number): string => {
  return dayjs.duration(seconds, 'seconds').format(TimeFormatEnum.MM_SS)
}

export const formatToHourMinute = (time?: string | number | Date): string => {
  if (!time) return EMPTY_STRING
  const parsed = dayjs(time)
  return parsed.isValid() ? parsed.format(TimeFormatEnum.DEFAULT) : EMPTY_STRING
}
