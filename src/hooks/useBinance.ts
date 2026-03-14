import { useState, useEffect } from 'react';

export type CoinData = {
  symbol: string;
  price: string;
  isUp: boolean; // true si subió de precio o se mantuvo, false si bajó
};

type CryptoState = {
  [key: string]: CoinData;
};

// Top 6 monedas: La Selección de Oro
export const SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt", "fetusdt", "dogeusdt"];

// Túnel combinado de Binance (stream?streams=...)
const STREAM_URL = `wss://stream.binance.com:9443/stream?streams=${SYMBOLS.map(s => `${s}@ticker`).join('/')}`;

export const useBinance = () => {
  const [cryptos, setCryptos] = useState<CryptoState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Abrimos el túnel
    const ws = new WebSocket(STREAM_URL);

    // 2. Escuchamos cuando llega un mensaje
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      
      // Binance manda los datos dentro del objeto "data" en streams combinados
      if (parsed.data) {
        const data = parsed.data;
        const symbol = data.s; // Ej: 'BTCUSDT'
        const currentPrice = parseFloat(data.c); // Precio de cierre actual ('c' = current close price)

        setCryptos(prev => {
          const prevPriceStr = prev[symbol]?.price;
          const prevPrice = prevPriceStr ? parseFloat(prevPriceStr) : currentPrice;
          
          let isUp = prev[symbol]?.isUp ?? true;
          // Si el precio actual es mayor, brilla púrpura. Si es menor, rojizo.
          if (currentPrice > prevPrice) isUp = true;
          else if (currentPrice < prevPrice) isUp = false;

          return {
            ...prev,
            [symbol]: {
              symbol: symbol.replace('USDT', ''), // Limpiamos para dejar 'BTC', 'ETH', etc.
              // Formateamos para que monedas como Doge tengan 4 decimales, y BTC 2
              price: currentPrice >= 10 ? currentPrice.toFixed(2) : currentPrice.toFixed(4),
              isUp: isUp
            }
          };
        });
        
        setLoading(false);
      }
    };

    // 3. Manejamos errores
    ws.onerror = (error) => {
      console.error("Mano, se cayó el túnel:", error);
    };

    // 4. Limpiamos la conexión cuando te vas de la página (¡Evitamos el ban de IP y memory leaks!)
    return () => {
      ws.close();
    };
  }, []);

  return { cryptos, loading };
};
