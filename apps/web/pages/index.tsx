import { connect, TindeqClient } from '@tindeq-ts/browser'
import { useState, useEffect } from 'react'
import Chart from '../src/Chart'

const loadDevices = async () => {
  const tindeq = await connect()
  return tindeq
}

export default function Web() {
  const [device, setDevice] = useState<TindeqClient>()
  const [data, setData] = useState<{ x: number; y: number }>({
    x: 1,
    y: 1,
  })
  const [chart, setChart] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    if (device) {
      return () => {
        device?.cleanup()
      }
    }
  }, [device])

  useEffect(() => {
    setChart([...chart, data])
  }, [data])

  return (
    <>
      {!device && (
        <button
          onClick={() => loadDevices().then((device) => setDevice(device))}
        >
          Pair
        </button>
      )}

      {device && (
        <>
          <button
            onClick={() => {
              device.startMeasuring((weight, seconds) => {
                setData({ x: seconds, y: weight })
              })
            }}
          >
            Start Measurements
          </button>

          <button
            onClick={() => {
              device.stopMeasuring()
            }}
          >
            Stop Measurements
          </button>

          {/* <button
            onClick={async () => {
              const level = await device.getBatteryLevel()

              console.log(level)
            }}
          >
            Get Battery
          </button> */}
        </>
      )}

      <Chart data={chart} />
    </>
  )
}
