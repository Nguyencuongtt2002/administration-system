export const EMPTY_VALUE = '--'
export const CONTENT_TYPE_FORM_DATA = 'multipart/form-data'
export const DEFAULT_UPLOAD_ACCEPT_IMAGE = 'image/*'
export const ASTERISK = '*'
export const EMPTY_STRING = ''
export const SPACE = ' '
export const BACKSPACE = 'Backspace'
export const DELETE = 'Delete'
export const NOT_SET = 'Not Set'
export const DEFAULT_VALUE_EMPTY_RICH_EDITOR = '<p><br></p>'
export const HASHTAG = '#'
export const DEFAULT_TIME_FRAME = 'TODAY'
export const VALUE_START_TIME_ZERO = '0:00:00'
export const VALUE_MILLISECONDS = 'milliseconds'
export const DEFAULT_STATUS_OK = 'OK'
export const DEFAULT_TRIGGER_MENTION = '@'

export const MIN_PERCENT = 0
export const MAX_PERCENT = 100
export const STEP_RANGE = 1
export const PERCENT_STR = '%'

// Common Pagination
export const DEFAULT_CURRENT_PAGE = 1
export const DEFAULT_LIMIT_PAGE = 10
export const DEFAULT_LIMIT_MESSAGE = 20

// Default value
export const NUMBER_ZERO = 0
export const NUMBER_ONE = 1
export const NUMBER_TWO = 2
export const NUMBER_FIVE = 5
export const RESEND_INTERVAL = 300

export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  number: /[^\d]/g,
  numeric: /[0-9]/,
  removeFirstUnit: /^[^\d]+/,
  removeCommas: /,/g,
  verifyCode: /^\d?$/,
  removeHTMLExceptImage: /<(?!img\b)[^>]*>/gi,
  removeSpace: /\s+/g,
  fileImage: /\.(jpg|jpeg)$/i
}

export const FORMAT_NUMBER = {
  numberThree: 3,
  numberFour: 4,
  numberSix: 6,
  numberSeven: 7,
  numberTen: 10
}
