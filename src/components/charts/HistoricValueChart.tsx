import { Spinner, Text } from 'grommet';
import { useAlphaVantage } from '../../hooks/useAlphaVantage';
import Chart from 'react-apexcharts';

interface HistoricDataPoint {
  date: string;
  value: number;
}
interface HistoricValueChartProps {ticker: string, displayName: string, endpoint: string, attributeExtractor: (data: any) => HistoricDataPoint[]}

const HistoricValueWidget = ({ticker, displayName, endpoint, attributeExtractor} : HistoricValueChartProps) => {
  const {data, error} = useAlphaVantage(endpoint, ticker);

  const historicalValues = attributeExtractor(data);

  if(error) {
    return <><h4 style={{color: 'red'}}>{error}</h4></>;
  }
  if(!data){
    return <Spinner/>;
  }

  return <div>
    <Text size='large'>{displayName}</Text>
    <Chart
      options={{
        xaxis: {
          categories: historicalValues.map(a => a.date),
        }
      }}
      series={[{ name: displayName, data: historicalValues.map(a => a.value) }]}
      type="line"
    />
  </div>;

};

export {HistoricValueWidget};