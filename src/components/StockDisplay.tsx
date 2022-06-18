import {PricingChart} from './charts/PricingChart';
import { Box } from 'grommet';
import { HistoricValueWidget } from './charts/HistoricValueChart';

const epsExtractor = (data: any) => {
  return (data?.quarterlyEarnings || [])
    .map((a: any) => ({date: a.reportedDate, value: a.reportedEPS}))
    .sort((a: any,b: any) => a.date.localeCompare(b.date));
};
const sharesOutstandingExtractor = (data: any) => {
  return (data?.annualReports || [])
    .map((a: any) => ({date: a.fiscalDateEnding, value: a.commonStockSharesOutstanding}))
    .sort((a: any,b: any) => a.date.localeCompare(b.date));
};

const debtExtractor = (data: any) => {
  return (data?.annualReports || [])
    .map((a: any) => ({date: a.fiscalDateEnding, value: a.shortLongTermDebtTotal}))
    .sort((a: any,b: any) => a.date.localeCompare(b.date));
};

const ebitaExtractor = (data: any) => {
  return (data?.annualReports || [])
    .map((a: any) => ({date: a.fiscalDateEnding, value: a.ebitda}))
    .sort((a: any,b: any) => a.date.localeCompare(b.date));
};

function StockDisplay({symbol}: {symbol: string}) {

  return <Box pad="large" fill="horizontal">
    <div style={{display: 'grid', gridTemplateColumns: '45% 45%', gap: '100px'}}>
      
      <PricingChart ticker={symbol}/>
  
      <HistoricValueWidget
        ticker={symbol}
        displayName="Historic EPS"
        endpoint="fundamentals/earnings"
        attributeExtractor={epsExtractor}
      />
    
      <HistoricValueWidget
        ticker={symbol}
        displayName="Shares outstanding"
        endpoint="fundamentals/balanceSheet"
        attributeExtractor={sharesOutstandingExtractor}
      />
      
      <HistoricValueWidget
        ticker={symbol}
        displayName="Debt"
        endpoint="fundamentals/balanceSheet"
        attributeExtractor={debtExtractor}
      />
      
      <HistoricValueWidget
        ticker={symbol}
        displayName="EBITDA (Earnings before interest, taxes, debt and appreciation)"
        endpoint="fundamentals/incomeStatement"
        attributeExtractor={ebitaExtractor}
      />
    </div>
  </Box>;
}

export {StockDisplay};
