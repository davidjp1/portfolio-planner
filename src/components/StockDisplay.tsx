import { FunctionComponent } from 'react';
import { Box, Card, CardBody, CardHeader, Heading } from 'grommet';

import { PricingChart } from './charts/PricingChart';
import { HistoricValueWidget } from './charts/HistoricValueChart';

const epsExtractor = (data?: {
  quarterlyEarnings: { date: any; reportedDate: any; reportedEPS: any }[];
}) => {
  return (data?.quarterlyEarnings || [])
    .map((a) => ({ date: a.reportedDate, value: a.reportedEPS }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
const sharesOutstandingExtractor = (data?: {
  annualReports: {
    date: any;
    fiscalDateEnding: any;
    commonStockSharesOutstanding: any;
  }[];
}) => {
  return (data?.annualReports || [])
    .map((a) => ({
      date: a.fiscalDateEnding,
      value: a.commonStockSharesOutstanding,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const debtExtractor = (data?: {
  annualReports: {
    date: any;
    fiscalDateEnding: any;
    shortLongTermDebtTotal: any;
  }[];
}) => {
  return (data?.annualReports || [])
    .map((a) => ({ date: a.fiscalDateEnding, value: a.shortLongTermDebtTotal }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const ebitaExtractor = (data?: {
  annualReports: { date: any; fiscalDateEnding: any; ebitda: any }[];
}) => {
  return (data?.annualReports || [])
    .map((a) => ({ date: a.fiscalDateEnding, value: a.ebitda }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

interface Props {
  symbol: string;
}

const LabelledCard: FunctionComponent<{ title: string }> = ({
  title,
  children,
}) => (
  <Card background="light-1">
    <CardHeader pad="xsmall">
      <Heading level="4">{title}</Heading>
    </CardHeader>
    <CardBody pad="xsmall">{children}</CardBody>
  </Card>
);

const WIDGETS = [
  {
    displayName: 'Historic EPS',
    endpoint: 'fundamentals/earnings',
    attributeExtractor: epsExtractor,
  },
  {
    displayName: 'Shares outstanding',
    endpoint: 'fundamentals/balanceSheet',
    attributeExtractor: sharesOutstandingExtractor,
  },
  {
    displayName: 'Debt',
    endpoint: 'fundamentals/balanceSheet',
    attributeExtractor: debtExtractor,
  },
  {
    displayName:
      'EBITDA (Earnings before interest, taxes, debt and appreciation)',
    endpoint: 'fundamentals/incomeStatement',
    attributeExtractor: ebitaExtractor,
  },
];

const StockDisplay: FunctionComponent<Props> = ({ symbol }) => {
  return (
    <Box pad="xsmall" fill="horizontal">
      <div
        style={{
          display: 'grid',
          gridGap: '30px',
          gridTemplateColumns: 'repeat(auto-fill, max(300px, 32%))',
          justifyContent: 'center',
        }}
      >
        <LabelledCard title={'Stock Price'}>
          <PricingChart ticker={symbol} />
        </LabelledCard>

        {WIDGETS.map((widget) => (
          <LabelledCard key={widget.displayName} title={widget.displayName}>
            <HistoricValueWidget ticker={symbol} {...widget} />
          </LabelledCard>
        ))}
      </div>
    </Box>
  );
};

export { StockDisplay };
