import struct from '@aksel/structjs'

const parseEventType = (data: DataView): 0 | 1 | 2 => {
  const [kind] = struct('<bb').unpack(data.buffer.slice(0, 2))
  return kind
}

const parseWeightEvent = (data: DataView): Iterable<[weight: number, seconds: number]> => {
  return struct('<fi').iter_unpack(data.buffer.slice(2))
}

const COMMAND_TO_DATA_PARSER = {
  'GET_BATTERY_LEVEL': (data: ArrayBuffer) => {
    const [voltage] = struct("<I").unpack(data.slice(2))
    return voltage;
  },
  'GET_APP_VERSION': (data: ArrayBuffer) => {

  }
}

export { parseEventType, parseWeightEvent, COMMAND_TO_DATA_PARSER }
