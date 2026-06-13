const { getAllMachines, generateDataForMachine } = require('./machineService')
const MachineSensor = require('../models/machineSensor')

module.exports = (io) =>
  async function generateSensorData() {
    const machines = await getAllMachines()
    const sensorNamespace = io.of('/sensors')

    for (const machine of machines) {
      const sensorData = await generateDataForMachine(machine)

      sensorNamespace.emit('sensorData', sensorData)

      let machineSensor = await MachineSensor.findOne({ serial: machine.serial })
      if (!machineSensor) {
        machineSensor = new MachineSensor({ serial: machine.serial, sensorData: [sensorData] })
      } else {
        machineSensor.sensorData.push(sensorData)
      }
      await machineSensor.save()
    }

    setTimeout(() => generateSensorData(), 5000)
  }
