import { useState, useEffect } from 'react';

export type CoinData = {
  symbol: string;
  price: string;
  isUp: boolean; 
  lastUpdate: number; 
  history: number[]; 
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
        
        // Si por alguna razón recibimos mensajes pero el estado era error/reconnecting, lo forzamos a connected
        setStatus('connected'); 
        
        const parsed = JSON.parse(event.data);
        
        if (parsed.data) {
          const data = parsed.data;
          const symbol = data.s; 
          const currentPrice = parseFloat(data.c); 

          setCryptos(prev => {
            const prevRawPrice = prev[symbol] ? parseFloat(prev[symbol].price.replace(/,/g, '')) : currentPrice;
            
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
                isUp: isUp,
                lastUpdate: Date.now(),
                history: newHistory
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
        
        // Intentar reconectar cada 3 segundos si se cae
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (ws) {
        // Removemos los event listeners antes de cerrar para evitar llamadas extra
        ws.onclose = null; 
        ws.close();
      }
    };
  }, []);

  return { cryptos, loading, status };
};
