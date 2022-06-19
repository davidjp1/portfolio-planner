import { FunctionComponent, useState } from 'react';
import { Select, FormField, Text } from 'grommet';
import Chart from 'react-apexcharts';

import { isInterday } from '../../hooks/useAlphaVantage';
import { useAlphaVantage, INTERVALS } from '../../hooks/useAlphaVantage';

interface Props {
  ticker: string;
}

const PricingChart: FunctionComponent<Props> = ({ ticker }) => {
  const [interval, setInterval] = useState(INTERVALS[0]);
  const { data, error } = useAlphaVantage('pricing', ticker, interval);

  if (error) {
    return <h4 style={{ color: 'red' }}>{error}</h4>;
  }

  return (
    <div>
      <div style={{ display: 'inline-flex', columnGap: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'center',
          }}
        >
          <Text size="large">Stock Price</Text>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FormField label="Interval">
            <Select
              options={INTERVALS}
              value={interval}
              onChange={(event) => setInterval(event.target.value)}
            />
          </FormField>
        </div>
      </div>
      <Chart
        options={{
          // @ts-ignore incomplete types in react-apexcharts
          candlestick: {
            wick: {
              useFillColor: true,
            },
          },
          yaxis: {
            tooltip: {
              enabled: true,
            },
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
              formatter: (value) =>
                isInterday(interval)
                  ? new Date(value).toLocaleTimeString('en-US')
                  : new Date(value).toLocaleDateString('en-US'),
            },
          },
        }}
        series={[{ data }]}
        type="candlestick"
      />
    </div>
  );
};

export { PricingChart };
