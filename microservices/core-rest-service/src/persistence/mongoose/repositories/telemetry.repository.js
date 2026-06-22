import { TelemetryModel as MongooseTelemetryModel } from '../models/telemetry.model.js'

const defaultTelemetryModel = MongooseTelemetryModel

export function createTelemetryRepository({
  telemetryModel = defaultTelemetryModel
} = {}) {
  async function createTelemetry(telemetryData) {
    return telemetryModel.create(telemetryData)
  }

  async function findTelemetry({ machineId, from, to, limit, offset, sort }) {
    const filter = {}

    if (machineId) {
      filter.machineId = machineId
    }

    if (from || to) {
      filter.capturedAt = {}
      if (from) filter.capturedAt.$gte = from
      if (to) filter.capturedAt.$lte = to
    }

    const sortDir = sort === 'asc' ? 1 : -1

    return telemetryModel
      .find(filter)
      .sort({ capturedAt: sortDir, _id: sortDir })
      .skip(offset)
      .limit(limit)
      .exec()
  }

  return Object.freeze({ createTelemetry, findTelemetry })
}
