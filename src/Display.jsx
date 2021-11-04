import { useState } from "react";
import { useAlphaVantage, INTERVALS, isInterday } from './useAlphaVantage';
import Chart from 'react-apexcharts';
import { Select, MenuItem } from '@mui/material';


function ChartDisplay({symbol}) {
  const [interval, setInterval] = useState(INTERVALS[0]);

  const {data, error} = useAlphaVantage(symbol, interval);

  if (!data) {
    return 'Loading';
  }
  if(error){
    return <h4 style={{color: 'red'}}>{error}</h4>;
  }

  return <div>
    <br/>
    <Select
      value={interval}
      label="Age"
      onChange={(event) => setInterval(event.target.value)}
    >
      {INTERVALS.map((i) => <MenuItem value={i} key={`interval-picker-${i}`}>{i}</MenuItem>)}
    </Select>
    <Chart
      options={{
        candlestick: {
          wick: {
            useFillColor: true,
          }
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
        xaxis: {
          type: "category",
          labels: {
            show: true,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: true,
          trim: false,
          minHeight: undefined,
          maxHeight: 120,
            formatter: (value) => isInterday(interval) ?
              new Date(value).toLocaleTimeString("en-US") :
              new Date(value).toLocaleDateString("en-US")
          }
        }
      }}
      series={[{ data }]}
      type="candlestick"
      width="500"
    />
  </div>;
}

export {ChartDisplay as Display};
