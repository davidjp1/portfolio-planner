import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { RuntimeOptions } from 'firebase-functions';

admin.initializeApp();

// needs to be imported after initalizing App
// eslint-disable-next-line
import { queryAlphaVantage } from './alpha-vantage/alpha-vantage';

const app = express();
app.use(cors({ origin: '*' }));

app.get('/vantage', (req, res) => {
  const symbol = req.query.symbol?.toString();
  const interval = req.query.interval?.toString();
  const {options} = req.body;

  if (!symbol || !interval) {
    return res.status(400).send('symbol and interval are required');
  }

  return queryAlphaVantage(symbol, interval, options)
    .then(data => res.status(200).send(data))
    .catch(e => {
      console.error(e);
      res.status(e.code || 500).send(e.message);
    });
});


exports.base = functions.runWith({ secrets: ['ALPHA_VANTAGE_KEY'] } as RuntimeOptions).https.onRequest(app);