import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getAuth } from 'firebase-admin/auth';
import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import {
  queryAlphaVantageIntraday,
  queryAlphaVantageCsvToJson,
  getCachedOrAlphaVantage,
} from './alpha-vantage';
import FirebaseFunctionsRateLimiter from 'firebase-functions-rate-limiter';

admin.initializeApp();

const shortTermLimiter = FirebaseFunctionsRateLimiter.withRealtimeDbBackend(
  {
    name: 'user_limiter_short_term',
    maxCalls: 100,
    periodSeconds: 10,
  },
  admin.database()
);

const longTermLimiter = FirebaseFunctionsRateLimiter.withRealtimeDbBackend(
  {
    name: 'user_limiter_long_term',
    maxCalls: 100000,
    periodSeconds: 2592000,
  },
  admin.database()
);

const app = express();
app.use(cors({ origin: '*' }));

app.use(function authInterceptor(req, res, next) {
  const jwt = req.header('Authorization')?.split('Bearer ')[1];
  if (!jwt) {
    res.status(401).send();
    return;
  }

  getAuth()
    .verifyIdToken(jwt, true)
    .then((decoded) => {
      req.query['uid'] = decoded.uid;
      next();
    })
    .catch((e) => {
      console.warn('unauthorized user attempted to call firebase functions', e);
      res.status(403).send(e?.message || 'Not Authorized');
    });
});

app.use(function rateLimter(req, res, next) {
  const uid = (req.query['uid'] as string) || 'unathorized-user';
  (async () => {
    try {
      await shortTermLimiter.rejectOnQuotaExceededOrRecordUsage(uid);
    } catch (e) {
      res
        .status(403)
        .send(
          'Rate Limit Reached for current user, please try again in 10 seconds'
        );
    }

    try {
      await longTermLimiter.rejectOnQuotaExceededOrRecordUsage(uid);
    } catch (e) {
      res
        .status(403)
        .send(
          'Over usage detected, you may not use the site for the next 30 days ' +
            'if you suspect this was in error, please contact the site administrators'
        );
    }
    next();
  })();
});

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
    .then((data) =>
      res.status(200).header('Cache-Control', 'max-age=3600').send(data)
    )
    .catch((e) => {
      console.error(e);
      res.status(e.code || 500).send(e.message);
    });
}

exports.base = functions
  .runWith({ secrets: ['ALPHA_VANTAGE_KEY'] })
  .https.onRequest(app);
