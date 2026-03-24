import { useState, useEffect } from 'react';

export type CoinData = {
  symbol: string;
  price: string;
  isUp: boolean;
  lastUpdate: number;
  history: number[];
  // 24h stats from Binance ticker
  change24h?: string;   // P field: 24h price change percent
  high24h?: string;     // h field: 24h high price
  low24h?: string;      // l field: 24h low price
  volume24h?: string;   // q field: 24h quote asset volume (in USDT)
};

type CryptoState = {
  [key: string]: CoinData;
};

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'error';

export const SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt", "fetusdt", "dogeusdt"];
const STREAM_URL = `wss://stream.binance.com:9443/stream?streams=${SYMBOLS.map(s => `${s}@ticker`).join('/')}`;

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }
}

function formatVolume(raw: number): string {
  if (raw >= 1_000_000_000) return `$${(raw / 1_000_000_000).toFixed(2)}B`;
  if (raw >= 1_000_000) return `$${(raw / 1_000_000).toFixed(2)}M`;
  if (raw >= 1_000) return `$${(raw / 1_000).toFixed(2)}K`;
  return `$${raw.toFixed(2)}`;
}

export const useBinance = () => {
  const [cryptos, setCryptos] = useState<CryptoState>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;

      setStatus(prev => prev === 'connecting' ? 'connecting' : 'reconnecting');
      ws = new WebSocket(STREAM_URL);

      ws.onopen = () => {
        if (!isMounted) return;
        setStatus('connected');
        setLoading(false);
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;

        setStatus('connected');

        const parsed = JSON.parse(event.data);

        if (parsed.data) {
          const data = parsed.data;
          const symbol: string = data.s;
          const currentPrice = parseFloat(data.c);

          // 24h extra fields from 24hr ticker stream
          const change24h: string = parseFloat(data.P).toFixed(2);
          const high24h: string = formatPrice(parseFloat(data.h));
          const low24h: string = formatPrice(parseFloat(data.l));
          const volume24h: string = formatVolume(parseFloat(data.q));

          setCryptos(prev => {
            const prevRawPrice = prev[symbol]
              ? parseFloat(prev[symbol].price.replace(/,/g, ''))
              : currentPrice;

            let isUp = prev[symbol]?.isUp ?? true;
            if (currentPrice > prevRawPrice) isUp = true;
            else if (currentPrice < prevRawPrice) isUp = false;

            const currentHistory = prev[symbol]?.history || [];
            const newHistory = [...currentHistory, currentPrice].slice(-30);

            return {
              ...prev,
              [symbol]: {
                symbol: symbol.replace('USDT', ''),
                price: formatPrice(currentPrice),
                isUp,
                lastUpdate: Date.now(),
                history: newHistory,
                change24h,
                high24h,
                low24h,
                volume24h,
              }
            };
          });
        }
      };

      ws.onerror = (error) => {
        if (!isMounted) return;
        console.error("Error en WebSocket de Binance:", error);
        setStatus('error');
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setStatus('reconnecting');
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, []);

  return { cryptos, loading, status };
};
