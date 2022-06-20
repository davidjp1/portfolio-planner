import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';
import { HttpException } from './http-exception';
import { parse as parseCsv } from 'papaparse';

const TIME_FUNCTION_MAP: { [duration: string]: string } = {
  '1min': 'TIME_SERIES_INTRADAY',
  '5min': 'TIME_SERIES_INTRADAY',
  '15min': 'TIME_SERIES_INTRADAY',
  '30min': 'TIME_SERIES_INTRADAY',
  '60min': 'TIME_SERIES_INTRADAY',
  '1day': 'TIME_SERIES_DAILY',
  '7day': 'TIME_SERIES_WEEKLY_ADJUSTED',
  '1month': 'TIME_SERIES_MONTHLY_ADJUSTED',
};
const isInterday = (interval: string) => interval.includes('min');
const db = getFirestore();

export async function queryAlphaVantageIntraday(
  symbol: string,
  interval: string,
  skipCache = false
): Promise<any> {
  if (!Object.keys(TIME_FUNCTION_MAP).includes(interval)) {
    throw new HttpException(
      `Invalid interval: ${interval} Valid options: ${Object.keys(
        TIME_FUNCTION_MAP
      )}`,
      400
    );
  }
  return getCachedOrAlphaVantage(
    symbol,
    TIME_FUNCTION_MAP[interval],
    isInterday(interval) ? `&interval=${interval}` : undefined,
    skipCache
  );
}

export async function queryAlphaVantageCsvToJson(
  symbol: string,
  avFunction: string,
  skipCache = false
) {
  const cachedValue =
    !skipCache && (await checkCache(symbol, avFunction, '&horizon=12month'));
  if (cachedValue) {
    return cachedValue;
  }
  const { data: csvData, errors } = parseCsv(
    await callAlphaVantage(avFunction, symbol, '&horizon=12month')
  );
  if (errors && errors.length > 0) {
    throw new Error(`Errors occurred parsing CSV to JSON: ${errors.join(',')}`);
  }
  const keys = csvData[0] as any[];

  const parsedData = (csvData.slice(1) as string[][])
    .filter((row) => !(row[0] === '' && row.length === 1))
    .map((row) => {
      const result: { [header: string]: string } = {};
      for (let i = 0; i < row.length; i++) {
        result[keys[i]] = row[i];
      }
      return result;
    });

  await updateCache(symbol, avFunction, parsedData, '&horizon=12month');
  return parsedData;
}

export async function getCachedOrAlphaVantage(
  symbol: string,
  avFunction: string,
  additionalParams?: string,
  skipCache = false
): Promise<any> {
  const cachedValue =
    !skipCache && (await checkCache(symbol, avFunction, additionalParams));
  if (cachedValue) {
    return cachedValue;
  }
  const data = await callAlphaVantage(avFunction, symbol, additionalParams);
  await updateCache(symbol, avFunction, data, additionalParams);
  return data;
}

async function callAlphaVantage(
  avFunction: string,
  symbol: string,
  additionalParams?: string
) {
  console.log(
    `calling alpha vantage for function=${avFunction} symbol=${symbol} additionalParams=${additionalParams}`
  );
  const url = `https://www.alphavantage.co/query?function=${avFunction}&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}${additionalParams}`;

  console.log(`calling alpha vantage for ${symbol} ${additionalParams}`);
  const { data } = await axios.get(url);
  if ((data.Note || '').includes('Our standard API call')) {
    throw new HttpException(
      `Alpha Vantage returned rate limit message=${data?.Note}`,
      429
    );
  }
  if (data['Error Message']) {
    throw new HttpException(
      `Alpha Vantage Returned Error Message=${data['Error Message']}`,
      500
    );
  }
  if (!data) {
    throw new HttpException('Alpha Vantage Returned Empty Data', 500);
  }
  return data;
}

async function checkCache(
  symbol: string,
  avFunction: string,
  additionalParams?: string
): Promise<any> {
  const document = await db
    .collection('cache')
    .doc(symbol)
    .collection(avFunction)
    .doc(additionalParams || 'result')
    .get();
  if (!document.exists) {
    return null;
  }
  const data = document.data();
  if (!data?.rawData) {
    console.warn('Found bad cache record with missing data');
    await document.ref.delete();
    return null;
  }
  // Delete the cache if it is older than 1 hour
  if (data?.dateAdded.toDate().getTime() < new Date().getTime() - 3600000) {
    console.log('cleaning old cache for', symbol, additionalParams);
    await document.ref.delete();
    return null;
  }

  console.log('retrieved from cache');
  return JSON.parse(data.rawData);
}

async function updateCache(
  symbol: string,
  avFunction: string,
  result: any,
  additionalParams?: string
): Promise<void> {
  db.collection('cache')
    .doc(symbol)
    .collection(avFunction)
    .doc(additionalParams || 'result')
    .set({ rawData: JSON.stringify(result), dateAdded: new Date() });
}
