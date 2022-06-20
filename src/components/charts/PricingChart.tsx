import { CSSProperties, FunctionComponent, useState } from 'react';
import { Select, FormField, Text, Spinner } from 'grommet';
import Chart from 'react-apexcharts';

import { isInterday } from '../../hooks/useAlphaVantage';
import { useAlphaVantage, INTERVALS } from '../../hooks/useAlphaVantage';

interface Props {
  ticker: string;
  style?: CSSProperties;
}

const PricingChart: FunctionComponent<Props> = ({ ticker, style }) => {
  const [interval, setInterval] = useState(INTERVALS[5]);
  const { data, error } = useAlphaVantage('pricing', ticker, interval);

  if (error) {
    return <h4 style={{ color: 'red' }}>{error}</h4>;
  }
  if (!data) {
    return <Spinner />;
  }

  return (
    <div style={style}>
      <FormField label="Interval">
        <Select
          options={INTERVALS}
          value={interval}
          onChange={(event) => setInterval(event.target.value)}
        />
      </FormField>
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
