import { useState, useEffect } from 'react';

const is2xx = (status: number) => status >= 200 && status <= 299;

const MINUTE_INTERVALS = ['1min', '5min', '15min', '30min', '60min'];
const INTERVALS = [...MINUTE_INTERVALS, '1day', '7day', '1month'];

const isInterday = (interval: string) => MINUTE_INTERVALS.includes(interval);

const INTERVAL_KEYS: { [displayName: string]: string } = {
  '1min': 'Time Series (1min)',
  '5min': 'Time Series (5min)',
  '15min': 'Time Series (15min)',
  '30min': 'Time Series (30min)',
  '60min': 'Time Series (60min)',
  '1day': 'Time Series (Daily)',
  '7day': 'Weekly Adjusted Time Series',
  '1month': 'Monthly Adjusted Time Series',
};

const useAlphaVantage = (
  endpoint: string,
  symbol: string,
  interval?: string,
  options?: any
) => {
  const [response, setResponse] = useState<any>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setError(undefined);
    setResponse(undefined);
    if (!symbol) {
      return;
    }

    const url = `${
      process.env.REACT_APP_FUNCTIONS_URL
    }/base/vantage/${endpoint}?symbol=${symbol}${
      interval ? `&interval=${interval}` : ''
    }`;

    (async () => {
      try {
        const res = await fetch(url, options);
        const json = await res.json();

        if (!is2xx(res.status)) {
          setError(`${url} responded with status code=${res.status}`);
          return;
        }

        let result = json;
        if (interval) {
          console.log(json);
          if (interval === '7day' || interval === '1month') {
            result = Object.entries(json[INTERVAL_KEYS[interval]] || {})
              // getting the prices for open, high, low, close, volume
              .map(([dateTime, prices]) => [
                new Date(dateTime).getTime(),
                Object.values(prices as Record<string, string>).slice(4, 8),
              ]);
          } else {
            result = Object.entries(json[INTERVAL_KEYS[interval]] || {})
              // getting the prices for open, high, low, close, volume
              .map(([dateTime, prices]) => [
                new Date(dateTime).getTime(),
                Object.values(prices as Record<string, string>).slice(0, 4),
              ]);
          }
        }
        setResponse(result);
      } catch (e) {
        console.error(e);
        setError('failed to get data from alpha vantage');
      }
    })();
  }, [symbol, interval, options]);

  return { data: response, error };
};

export { useAlphaVantage, INTERVALS, isInterday };
