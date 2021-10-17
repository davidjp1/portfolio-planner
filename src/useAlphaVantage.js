import { useState, useEffect } from "react";
const is2xx = (status) => status >= 200 && status <= 299;

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/';
const MINUTE_INTERVALS = ['1min', '5min', '15min', '30min', '60min'];
const INTERVALS = [...MINUTE_INTERVALS, 'Daily', 'Weekly', 'Monthly'];
const TIME_FUNCTION_MAP = {
    '5min': 'TIME_SERIES_INTRADAY',
    '15min': 'TIME_SERIES_INTRADAY',
    '30min': 'TIME_SERIES_INTRADAY',
    '60min': 'TIME_SERIES_INTRADAY',
    'Daily': 'TIME_SERIES_DAILY',
    'Weekly': 'TIME_SERIES_WEEKLY',
    'Monthly': 'TIME_SERIES_MONTHLY',
}
const isInterday = (interval) => MINUTE_INTERVALS.includes(interval);

const useAlphaVantage = (symbol, interval, options) => {
    const [response, setResponse] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        let params = `query?function=${TIME_FUNCTION_MAP[interval]}&symbol=${symbol}`;
        if (isInterday(interval)) {
            params = `${params}&interval=${interval}`;
        }
        const url = `${ALPHA_VANTAGE_BASE_URL}${params}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_KEY}`;

        (async () => {
            const res = await fetch(url, options);
            const json = await res.json();
            if (!is2xx(res.status)) {
                setError(`${url} responded with status code=${res.status}`);
            }
            if ((json.Note || '').includes('Our standard API call')) {
                setError(`API returned rate limit message=${json?.Note}`);
            }
            if (json['Error Message']) {
                setError(json['Error Message']);
            }
            setResponse(Object.entries(json[`Time Series (${interval})`])
                ?.map(([a, b]) => [new Date(a).getTime(), Object.values(b).slice(0, 4)]));
        })();
    }, [symbol, interval, options]);

    return { data: response, error };
};

export { useAlphaVantage, INTERVALS, isInterday };