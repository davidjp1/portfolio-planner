import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from 'axios';

const TIME_FUNCTION_MAP: {[duration: string]: string} = {
  '1min': 'TIME_SERIES_INTRADAY',
  '5min': 'TIME_SERIES_INTRADAY',
  '15min': 'TIME_SERIES_INTRADAY',
  '30min': 'TIME_SERIES_INTRADAY',
  '60min': 'TIME_SERIES_INTRADAY',
  '1day': 'TIME_SERIES_DAILY',
  '7day': 'TIME_SERIES_WEEKLY',
  '1month': 'TIME_SERIES_MONTHLY',
};
const isInterday = (interval: string) => interval.includes('min');
const db = admin.firestore();

async function queryAlphaVantage(symbol: string, interval: string, options?: AxiosRequestConfig, skipCache = false): Promise<any> {
  if(!Object.keys(TIME_FUNCTION_MAP).includes(interval)){
    throw new HttpException(`Invalid interval: ${interval} Valid options: ${Object.keys(TIME_FUNCTION_MAP)}`, 404);
  }

  const cachedValue = !skipCache && await checkCache(symbol, interval);
  if(cachedValue){
    return cachedValue;
  }
		
  let params = `query?function=${TIME_FUNCTION_MAP[interval]}&symbol=${symbol}&interval=${interval}`;
  const url = `https://www.alphavantage.co/${params}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
  if (isInterday(interval)) {
    params += `&interval=${interval}`;
  }
  console.log(`calling alpha vantage for ${symbol} ${interval}`);
  const {data} = await axios.get(url, options);
  if ((data.Note || '').includes('Our standard API call')) {
    throw new HttpException(`Alpha Vantage returned rate limit message=${data?.Note}`, 429);
  }
  if (data['Error Message']) {
    throw new HttpException(`Alpha Vantage Returned Error Message=${data['Error Message']}`, 500);
  }
  if(!data) {
    throw new HttpException('Alpha Vantage Returned Empty Data', 500);
  }
  await updateCache(symbol, interval, data);
  return data;
}

async function checkCache(symbol: string, interval: string): Promise<any> {
  const document = await db.collection('cache').doc(symbol).collection(interval).doc('data').get();
  if(!document.exists){
    return null;
  }
  // Delete the cache if it is older than 1 hour
  if(document.data()?.dateAdded.toDate().getTime() < new Date().getTime() - 3600000){
    console.log('cleaning old cache for', symbol, interval);
    await document.ref.delete();
  }
  console.log('retrieved from cache');
  return document.data();
}

async function updateCache(symbol: string, interval: string, result: any): Promise<void> {
  const dateAdded = new Date();
  db.collection('cache').doc(symbol).collection(interval).doc('data').set({dateAdded, ...result});
}

class HttpException extends Error {
  code: number;

  constructor(message: string, code:number) {
    super(message);
    this.name = 'HttpException';
    this.code = code;
  }
}

export {queryAlphaVantage};