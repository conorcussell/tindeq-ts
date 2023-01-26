

import { COMMANDS, COMMAND_TO_DATA_PARSER, NOTIFICATION_TYPES, parseEventType, parseWeightEvent } from "../tindeq-core"
import { bytesArray } from './utils'

type TindeqClient = {
  /**
   * Start weight measurements
   */
  startMeasuring: (callback: (weight: number, seconds: number) => void) => Promise<void>,
  /**
   * Stop weight measurements
   */
  stopMeasuring: () => Promise<void>,
  getBatteryLevel: () => Promise<void>,
  /**
   * Stop listening to events from Tindeq
   */
  cleanup: () => Promise<void>
}

const createMeasurementHandler = (callback: (weight: number, seconds: number) => void) => (event: Event) => {
  // TODO: should remove this
  // @ts-expect-error
  const data = event.target.value as DataView

  const eventType = parseEventType(data)

  if (eventType === NOTIFICATION_TYPES.WEIGHT_MEASURE) {
    const iterable = parseWeightEvent(data)
    for (const [weight, seconds] of iterable) {
      callback(Math.abs(weight), seconds);
    }
  }
}

const handleSystemResponse = (command: keyof typeof COMMAND_TO_DATA_PARSER) => (event: Event) => {
  // TODO: should remove this
  // @ts-expect-error
  const data = event.target.value as DataView
  const eventType = parseEventType(data)

  if (eventType === NOTIFICATION_TYPES.COMMAND_RESPONSE) {
    const parser = COMMAND_TO_DATA_PARSER[command];

    return parser(data.buffer)
  }
}


type TindeqCharacteristics = {
  write: BluetoothRemoteGATTCharacteristic,
  notify: BluetoothRemoteGATTCharacteristic
}

const createTindeqClient = ({ write, notify }: TindeqCharacteristics): TindeqClient => {
  let handler: ((event: Event) => void) | null = null

  return {
    startMeasuring: async (callback: (weight: number, seconds: number) => void) => {
      // handler = createMeasurementHandler(callback)
      notify.addEventListener('characteristicvaluechanged', (event: Event) => {
        // TODO: should remove this

        console.log('different')
        // @ts-expect-error
        const data = event.target.value as DataView

        const eventType = parseEventType(data)

        if (eventType === NOTIFICATION_TYPES.WEIGHT_MEASURE) {
          const iterable = parseWeightEvent(data)
          for (const [weight, seconds] of iterable) {
            callback(Math.abs(weight), seconds);
          }
        }
      })
      await notify.startNotifications()
      await write.writeValueWithResponse(bytesArray(COMMANDS.START_MEASURING))
    },
    stopMeasuring: async () => {
      await write.writeValueWithResponse(bytesArray(COMMANDS.STOP_MEASURING))
    },
    getBatteryLevel: () => {
			return new Promise(async (resolve) => {

				notify.addEventListener('characteristicvaluechanged', (event: Event) => {

					const level = handleSystemResponse('GET_BATTERY_LEVEL')(event)

					resolve(level)
				})

				await notify.startNotifications()
        await write.writeValueWithResponse(bytesArray(COMMANDS.GET_BATTERY_LEVEL))
			})
    },
    cleanup: async () => {
      notify.removeEventListener('characteristicvaluechanged', handler)
      await notify.stopNotifications()
    }
  }
}

export type { TindeqClient }
export { createTindeqClient }
