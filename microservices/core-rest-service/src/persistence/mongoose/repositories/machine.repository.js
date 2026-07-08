import { MachineModel as MongooseMachineModel } from '../models/machine.model.js'

const MACHINE_UPDATE_OPTIONS = Object.freeze({
  new: true,
  runValidators: true,
  context: 'query'
})

const defaultMachineModel = MongooseMachineModel

export function createMachineRepository({
  machineModel = defaultMachineModel
} = {}) {
  async function createMachine(machineData) {
    return machineModel.create(machineData)
  }

  async function findMachineById(id) {
    return machineModel.findById(id).exec()
  }

  async function updateMachineById(id, updateData) {
    return machineModel
      .findByIdAndUpdate(id, updateData, MACHINE_UPDATE_OPTIONS)
      .exec()
  }

  async function deleteMachineById(id) {
    return machineModel.findByIdAndDelete(id).exec()
  }

  async function findMachines({ limit, offset, areaId } = {}) {
    const filter = areaId ? { 'location.areaId': areaId } : {}
    return machineModel
      .find(filter)
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit)
      .exec()
  }

  return Object.freeze({
    createMachine,
    findMachineById,
    updateMachineById,
    deleteMachineById,
    findMachines
  })
}
