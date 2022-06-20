import * as functions from 'firebase/firestore';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import {
  queryAlphaVantageIntraday,
  queryAlphaVantageCsvToJson,
  getCachedOrAlphaVantage,
} from './alpha-vantage';

admin.initializeApp();

const app = express();
app.use(cors({ origin: '*' }));

interface AlphaVantageReq {
  symbol: string;
  interval?: string;
}
type AlphaVantageRes = any;

app.get(
  '/vantage/pricing',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    const symbol = req.query.symbol?.toString();
    const interval = req.query.interval?.toString();

    if (!symbol || !interval) {
      return res.status(400).send('symbol and interval are required');
    }

    return genericErrorHandler(
      queryAlphaVantageIntraday(symbol, interval),
      res
    );
  }
);

app.get(
  '/vantage/fundamentals/earningsCalendar',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    const symbol = req.query.symbol?.toString();
    if (!symbol) {
      return res.status(400).send('symbol is required');
    }
    return genericErrorHandler(
      queryAlphaVantageCsvToJson(symbol, 'EARNINGS_CALENDAR'),
      res
    );
  }
);

app.get(
  '/vantage/fundamentals/incomeStatement',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    handleGenericAlphaVantageReq(req, res, 'INCOME_STATEMENT');
  }
);

app.get(
  '/vantage/fundamentals/balanceSheet',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    handleGenericAlphaVantageReq(req, res, 'BALANCE_SHEET');
  }
);

app.get(
  '/vantage/fundamentals/cashflows',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    handleGenericAlphaVantageReq(req, res, 'CASH_FLOW');
  }
);

app.get(
  '/vantage/fundamentals/earnings',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    handleGenericAlphaVantageReq(req, res, 'EARNINGS');
  }
);

app.get(
  '/vantage/fundamentals/overview',
  (req: Request<AlphaVantageReq>, res: Response<AlphaVantageRes>) => {
    handleGenericAlphaVantageReq(req, res, 'OVERVIEW');
  }
);

function handleGenericAlphaVantageReq(
  req: Request<any>,
  res: Response<any>,
  avFunction: string
) {
  const symbol = req.query.symbol?.toString();
  if (!symbol) {
    return res.status(400).send('symbol is required');
  }
  return genericErrorHandler(getCachedOrAlphaVantage(symbol, avFunction), res);
}

function genericErrorHandler(promise: Promise<any>, res: Response<any>) {
  return promise
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      console.error(e);
      res.status(e.code || 500).send(e.message);
    });
}

exports.base = functions
  .runWith({ secrets: ['ALPHA_VANTAGE_KEY'] })
  .https.onRequest(app);
