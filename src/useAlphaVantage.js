import { useState, useEffect } from "react";

const is2xx = (status) => status >= 200 && status <= 299;

const MINUTE_INTERVALS = ['1min', '5min', '15min', '30min', '60min'];
const INTERVALS = [...MINUTE_INTERVALS, 'Daily', 'Weekly', 'Monthly'];

const isInterday = (interval) => MINUTE_INTERVALS.includes(interval);


const useAlphaVantage = (symbol, interval, options) => {

    const [response, setResponse] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        setError(undefined);
        if(!symbol || !interval) {
            return;
        }
        
        const url = `https://us-central1-powell-portfolio-tracker.cloudfunctions.net/base/vantage?&symbol=${symbol}&interval=${interval}`;
        
        (async () => {
            const res = await fetch(url, options);
            const json = await res.json();
            if (!is2xx(res.status)) {
                setError(`${url} responded with status code=${res.status}`);
            }
            const result = Object.entries(json[`Time Series (${interval})`] || {})
                ?.map(([a, b]) => [new Date(a).getTime(), Object.values(b).slice(0, 4)]);
            setResponse(result);
        })();
    }, [symbol, interval, options]);
    
    return { data: response, error };
};

export { useAlphaVantage, INTERVALS, isInterday };