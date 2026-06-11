function toPlainObject(value) {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value.toObject === 'function') {
    return value.toObject({ virtuals: true })
  }

  return value
}

function toAreaId(area) {
  if (area.id !== undefined) {
    return area.id
  }

  if (typeof area._id?.toString === 'function') {
    return area._id.toString()
  }

  return area._id
}

/**
 * Converts an area document or plain object into a public area output object.
 *
 * @param {object|null|undefined} area
 * @returns {object|null|undefined}
 */
export function toAreaOutput(area) {
  const plainArea = toPlainObject(area)

  if (plainArea === null || plainArea === undefined) {
    return plainArea
  }

  return {
    id: toAreaId(plainArea),
    name: plainArea.name,
    size: plainArea.size,
    createdAt: plainArea.createdAt,
    updatedAt: plainArea.updatedAt
  }
}

/**
 * Converts area documents or plain objects into a list of public area output objects.
 *
 * @param {Array<object>} areas
 * @returns {Array<object>}
 */
export function toAreaOutputList(areas) {
  return areas.map(toAreaOutput)
}
