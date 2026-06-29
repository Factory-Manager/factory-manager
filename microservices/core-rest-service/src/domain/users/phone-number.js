/** +39, +1, +44 — 1 to 4 digits after the plus sign */
export const PHONE_PREFIX_REGEX = /^[+][0-9]{1,4}$/

/** Local number — digits, spaces, dashes, 6 to 12 characters */
export const PHONE_NUMBER_REGEX = /^[0-9 -]{6,12}$/
