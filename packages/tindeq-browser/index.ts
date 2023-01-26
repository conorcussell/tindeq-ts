import { NOTIFY_ID, SERVICE_ID, WRITE_ID } from "@tindeq-ts/core";
import { createTindeqClient, TindeqClient } from "./TindeqClient";

const pair = async () => {
  const device = await navigator.bluetooth.requestDevice({
    optionalServices: [WRITE_ID, NOTIFY_ID, SERVICE_ID],
    acceptAllDevices: true,
  })

  return device
}

const getTindeqCharacteristics = async (device: BluetoothDevice) : Promise<{ write: BluetoothRemoteGATTCharacteristic, notify: BluetoothRemoteGATTCharacteristic }> => {
  if (!device.gatt) {
    throw new Error('Failed to connect to device');
  }

  const server = await device.gatt.connect()
  const service = await server.getPrimaryService(SERVICE_ID)

  const notify = await service.getCharacteristic(NOTIFY_ID)
  const write = await service.getCharacteristic(WRITE_ID)

  return {
    write,
    notify
  }
}

const connect = async (): Promise<TindeqClient> => {
  const device = await pair();
  const characteristics = await getTindeqCharacteristics(device);

  return createTindeqClient(characteristics)
}

export type { TindeqClient }
export { connect };

