import { AreaModel as MongooseAreaModel } from '../models/area.model.js'

const AREA_UPDATE_OPTIONS = Object.freeze({
  new: true,
  runValidators: true,
  context: 'query'
})

const defaultAreaModel = MongooseAreaModel

export function createAreaRepository({ areaModel = defaultAreaModel } = {}) {
  async function createArea(areaData) {
    return areaModel.create(areaData)
  }

  async function findAreaById(id) {
    return areaModel.findById(id).exec()
  }

  async function updateAreaById(id, updateData) {
    return areaModel
      .findByIdAndUpdate(id, updateData, AREA_UPDATE_OPTIONS)
      .exec()
  }

  async function deleteAreaById(id) {
    return areaModel.findByIdAndDelete(id).exec()
  }

  async function findAreas({ limit, offset }) {
    return areaModel.find().skip(offset).limit(limit).exec()
  }

  return Object.freeze({
    createArea,
    findAreaById,
    updateAreaById,
    deleteAreaById,
    findAreas
  })
}
