import { useState, useEffect } from 'react';

const is2xx = (status) => status >= 200 && status <= 299;

const MINUTE_INTERVALS = ['1min', '5min', '15min', '30min', '60min'];
const INTERVALS = [...MINUTE_INTERVALS, '1day', '7day', '1month'];

const isInterday = (interval) => MINUTE_INTERVALS.includes(interval);

// TODO migrate this nasty conversion to backend
const INTERVAL_KEYS = {
  '1min': 'Time Series (1min)',
  '5min': 'Time Series (5min)',
  '15min': 'Time Series (15min)',
  '30min': 'Time Series (30min)',
  '60min': 'Time Series (60min)',
  '1day': 'Time Series (Daily)',
  '7day': 'Weekly Time Series',
  '1month': 'Monthly Time Series'
};

const useAlphaVantage = (endpoint, symbol, interval, options) => {

  const [response, setResponse] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setError(undefined);
    if(!symbol || !interval) {
      return;
    }
        
    const url = `https://us-central1-stock-portfolio-planner.cloudfunctions.net/base/vantage/${endpoint}?symbol=${symbol}${interval ? `&interval=${interval}` : ''}`;
        
    (async () => {
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        if (!is2xx(res.status)) {
          setError(`${url} responded with status code=${res.status}`);
        }
        
        const result = Object.entries(json[INTERVAL_KEYS[interval]] || {})
          ?.map(([a, b]) => [new Date(a).getTime(), Object.values(b).slice(0, 4)]);
        setResponse(result);
      }catch(e){
        console.error(e);
        setError('failed to get data from alpha vantage');
      }
    })();
  }, [symbol, interval, options]);
    
  return { data: response, error };
};

export { useAlphaVantage, INTERVALS, isInterday };