import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { RuntimeOptions } from 'firebase-functions';
import { Request, Response } from 'express';

admin.initializeApp();

// needs to be imported after initalizing App
// eslint-disable-next-line
import {
  queryAlphaVantageIntraday,
  queryAlphaVantageCsvToJson,
  getCachedOrAlphaVantage,
} from './alpha-vantage';

const app = express();
app.use(cors({ origin: '*' }));

app.get('/vantage/pricing', (req, res) => {
  const symbol = req.query.symbol?.toString();
  const interval = req.query.interval?.toString();

  if (!symbol || !interval) {
    return res.status(400).send('symbol and interval are required');
  }

  return genericErrorHandler(queryAlphaVantageIntraday(symbol, interval), res);
});

app.get('/vantage/fundamentals/earningsCalendar', (req, res) => {
  const symbol = req.query.symbol?.toString();
  if (!symbol) {
    return res.status(400).send('symbol is required');
  }
  return genericErrorHandler(
    queryAlphaVantageCsvToJson(symbol, 'EARNINGS_CALENDAR'),
    res
  );
});

app.get('/vantage/fundamentals/incomeStatement', (req, res) => {
  handleGenericAlphaVantageReq(req, res, 'INCOME_STATEMENT');
});

app.get('/vantage/fundamentals/balanceSheet', (req, res) => {
  handleGenericAlphaVantageReq(req, res, 'BALANCE_SHEET');
});

app.get('/vantage/fundamentals/cashflows', (req, res) => {
  handleGenericAlphaVantageReq(req, res, 'CASH_FLOW');
});

app.get('/vantage/fundamentals/earnings', (req, res) => {
  handleGenericAlphaVantageReq(req, res, 'EARNINGS');
});

app.get('/vantage/fundamentals/overview', (req, res) => {
  handleGenericAlphaVantageReq(req, res, 'OVERVIEW');
});

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
  .runWith({ secrets: ['ALPHA_VANTAGE_KEY'] } as RuntimeOptions)
  .https.onRequest(app);
