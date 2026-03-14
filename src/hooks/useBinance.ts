import { useState, useEffect } from 'react';

export type CoinData = {
  symbol: string;
  price: string;
  isUp: boolean; // true si subió de precio o se mantuvo, false si bajó
  lastUpdate: number; // Para activar animaciones cuando llegue un nuevo tick
  history: number[]; // Histórico de los últimos 30 precios para el Sparkline
};

type CryptoState = {
  [key: string]: CoinData;
};

// Top 6 monedas: La Selección de Oro
export const SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt", "fetusdt", "dogeusdt"];

const STREAM_URL = `wss://stream.binance.com:9443/stream?streams=${SYMBOLS.map(s => `${s}@ticker`).join('/')}`;

// Función para formatear el precio estéticamente
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

  useEffect(() => {
    const ws = new WebSocket(STREAM_URL);

    ws.onmessage = (event) => {
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

          // Mantenemos los últimos 30 precios. Si es el primer precio, inicializamos un array.
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
        
        setLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error("Error en WebSocket de Binance:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { cryptos, loading };
};
