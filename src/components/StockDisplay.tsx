import { FunctionComponent } from 'react';
import { Box } from 'grommet';

import { PricingChart } from './charts/PricingChart';
import { HistoricValueWidget } from './charts/HistoricValueChart';

const epsExtractor = (data?: { quarterlyEarnings: { date: any, reportedDate: any, reportedEPS: any }[] }) => {
  return (data?.quarterlyEarnings || [])
    .map(a => ({ date: a.reportedDate, value: a.reportedEPS }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
const sharesOutstandingExtractor = (data?: { annualReports: { date: any, fiscalDateEnding: any, commonStockSharesOutstanding: any }[] }) => {
  return (data?.annualReports || [])
    .map(a => ({ date: a.fiscalDateEnding, value: a.commonStockSharesOutstanding }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const debtExtractor = (data?: { annualReports: { date: any, fiscalDateEnding: any, shortLongTermDebtTotal: any }[] }) => {
  return (data?.annualReports || [])
    .map(a => ({ date: a.fiscalDateEnding, value: a.shortLongTermDebtTotal }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const ebitaExtractor = (data?: { annualReports: { date: any, fiscalDateEnding: any, ebitda: any }[] }) => {
  return (data?.annualReports || [])
    .map(a => ({ date: a.fiscalDateEnding, value: a.ebitda }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

interface Props {
  symbol: string
}

const StockDisplay: FunctionComponent<Props> = ({ symbol }) => {
  return (
    <Box pad="large" fill="horizontal">
      <div style={{ display: 'grid', gridTemplateColumns: '45% 45%', gap: '100px' }}>

        <PricingChart ticker={symbol} />

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
    </Box>
  );
};

export { StockDisplay };
