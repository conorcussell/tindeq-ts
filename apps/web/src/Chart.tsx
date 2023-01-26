import React, { FunctionComponent } from 'react'
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
} from '@visx/xychart'

type Data = {
  x: number
  y: number
}

const accessors = {
  xAccessor: (d: Data) => d.x,
  yAccessor: (d: Data) => d.y,
}

const Chart: FunctionComponent<{ data: Data[] }> = ({ data }) => {
  return (
    <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
      <AnimatedAxis orientation="bottom" />
      <AnimatedGrid columns={false} numTicks={4} />
      <AnimatedLineSeries dataKey="Line 1" data={data} {...accessors} />
    </XYChart>
  )
}

export default Chart
