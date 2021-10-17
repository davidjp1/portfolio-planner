import React, { useState } from "react";
import { useAlphaVantage, INTERVALS, isInterday } from './useAlphaVantage';
import Chart from 'react-apexcharts';
import { TextField, Select, MenuItem, Button } from '@mui/material';


function ChartDisplay() {
  const [intervalInput, setIntervalInput] = useState('5min');
  const [symbolInput, setSymbolInput] = useState('IBM');
  const [interval, setInterval] = useState(intervalInput);
  const [symbol, setSymbol] = useState(symbolInput);

  
  const {data, error} = useAlphaVantage(symbol, interval);
  if (!data) {
    return 'Loading';
  }
  if(error){
    return error;
  }

  const onSubmit = () => {
    setInterval(intervalInput);
    setSymbol(symbolInput);
  }

  return <div>
    <br/>
    <TextField label="Symbol" variant="outlined" value={symbolInput} onChange={(event) => setSymbolInput(event.target.value)} />
    <Select
      value={intervalInput}
      label="Age"
      onChange={(event) => setIntervalInput(event.target.value)}
    >
      {INTERVALS.map((i) => <MenuItem value={i} key={`interval-picker-${i}`}>{i}</MenuItem>)}
    </Select>
    <Button variant="outlined" onClick={onSubmit}>Submit</Button>
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
