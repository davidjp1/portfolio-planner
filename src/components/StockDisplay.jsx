import { useState } from 'react';
import { useAlphaVantage, INTERVALS, isInterday } from '../hooks/useAlphaVantage';
import Chart from 'react-apexcharts';
import { Select, Box } from 'grommet';

function StockDisplay({symbol}) {
  const [interval, setInterval] = useState(INTERVALS[0]);

  const {data, error} = useAlphaVantage(symbol, interval);

  if(error){
    return <h4 style={{color: 'red'}}>{error}</h4>;
  }
  if (!data) {
    return 'Loading';
  }


  return <Box pad="large">
    <Select 
      options={INTERVALS}
      value={interval}
      label="Age"
      onChange={(event) => setInterval(event.target.value)}
    />
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
          type: 'category',
          labels: {
            show: true,
            rotate: -30,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: true,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            formatter: (value) => isInterday(interval) ?
              new Date(value).toLocaleTimeString('en-US') :
              new Date(value).toLocaleTimeString('en-US')
          }
        }
      }}
      series={[{ data }]}
      type="candlestick"
      width="500"
    />
  </Box>;
}

export {StockDisplay};
