import { CSSProperties, FunctionComponent } from 'react';
import { Spinner, Text } from 'grommet';
import Chart from 'react-apexcharts';

import { useAlphaVantage } from '../../hooks/useAlphaVantage';

interface HistoricDataPoint {
  date: string;
  value: number;
}

interface Props {
  ticker: string;
  displayName: string;
  endpoint: string;
  style?: CSSProperties;
  attributeExtractor: (data: any) => HistoricDataPoint[];
}

const HistoricValueWidget: FunctionComponent<Props> = ({
  ticker,
  displayName,
  endpoint,
  attributeExtractor,
  style,
}) => {
  const { data, error } = useAlphaVantage(endpoint, ticker);
  const historicalValues = attributeExtractor(data);

  if (error) {
    return <h4 style={{ color: 'red' }}>{error}</h4>;
  }

  if (!data) {
    return <Spinner />;
  }

  return (
    <div style={style}>
      <Chart
        options={{
          xaxis: {
            categories: historicalValues.map((a) => a.date),
            labels: {
              rotate: -30,
            },
          },
        }}
        series={[
          { name: displayName, data: historicalValues.map((a) => a.value) },
        ]}
        type="line"
      />
    </div>
  );
};

export { HistoricValueWidget };
