export interface MachineDto {
  id: string
  serial: string
  name: string

  location: {
    areaId: string
  }

  machineState: {
    currentState: string
    anomalyDetails: string[]
  }

  specifications: {
    powerConsumption: {
      measurementUnit: string
      normalRange: {
        min: number
        max: number
      }
    }

    emissions: {
      measurementUnit: string
      normalRange: {
        min: number
        max: number
      }
    }

    operatingTemperature: {
      measurementUnit: string
      normalRange: {
        min: number
        max: number
      }
    }

    vibration: {
      measurementUnit: string
      normalRange: {
        min: number
        max: number
      }
    }

    pressure: {
      measurementUnit: string
      normalRange: {
        min: number
        max: number
      }
    }
  }

  createdAt: string
  updatedAt: string
}
