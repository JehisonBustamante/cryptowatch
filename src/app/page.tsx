"use client";

import { useState, useEffect } from "react";
import { useBinance } from "@/hooks/useBinance";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";

const ORDER = ["BTC", "ETH", "SOL", "BNB", "FET", "DOGE"];

const StarIcon = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <svg 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={filled ? "#eab308" : "none"}
    stroke={filled ? "#eab308" : "#71717a"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform active:scale-95"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CryptoCardSkeleton = () => (
  <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-zinc-800 shadow-lg flex flex-col justify-between h-[160px] animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-zinc-800"></div>
        <div>
          <div className="w-16 h-6 bg-zinc-800 rounded mb-2"></div>
          <div className="w-10 h-4 bg-zinc-800 rounded"></div>
        </div>
      </div>
      <div className="w-6 h-6 bg-zinc-800 rounded-full"></div>
    </div>
    <div className="mt-4 flex justify-end">
      <div className="w-24 h-8 bg-zinc-800 rounded"></div>
    </div>
    <div className="h-[30px] w-full mt-2 bg-zinc-900 rounded"></div>
  </div>
);

export default function Home() {
  const { cryptos, loading, status } = useBinance();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('crypto_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Error leyendo favoritos", e);
      }
    }
  }, []);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const next = prev.includes(symbol) 
        ? prev.filter(s => s !== symbol) 
        : [...prev, symbol];
      
      localStorage.setItem('crypto_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isDisconnected = status === 'reconnecting' || status === 'error';

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 md:mb-3 tracking-tight">
            Crypto<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Watch</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg">Mercado en tiempo real • Binance Stream</p>
        </div>
        
        {/* Indicador de Estado de Conexión */}
        <div className="mt-6 md:mt-0 flex items-center justify-center md:justify-end gap-3">
          <div className="flex items-center gap-2 bg-[#0a0a0c] px-4 py-2 rounded-full border border-zinc-800 shadow-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${
              status === 'connected' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
              status === 'reconnecting' ? 'bg-yellow-500 animate-bounce' : 
              'bg-zinc-500'
            }`}></div>
            <span className="text-sm text-zinc-300 font-medium">
              {status === 'connected' ? 'Señal en Vivo' : 
               status === 'reconnecting' ? 'Reconectando...' : 
               'Conectando...'}
            </span>
          </div>
        </div>
      </header>

      <section id="dashboard">
        {loading || Object.keys(cryptos).length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {ORDER.map((sym) => <CryptoCardSkeleton key={sym} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {ORDER.map((sym) => {
              const coin = cryptos[`${sym}USDT`];
              
              if (!coin) return <CryptoCardSkeleton key={sym} />;

              const isFav = favorites.includes(coin.symbol);
              const chartData = coin.history.map((val, i) => ({ index: i, value: val }));

              const minPrice = Math.min(...coin.history);
              const maxPrice = Math.max(...coin.history);
              const padding = (maxPrice - minPrice) * 0.01;

              return (
                <div 
                  key={coin.symbol} 
                  className={`bg-[#0a0a0c] pt-5 px-5 pb-3 rounded-2xl border transition-all duration-300 shadow-lg flex flex-col justify-between h-[160px]
                    ${isDisconnected ? 'border-zinc-800 grayscale-[0.6] opacity-70' : 
                      coin.isUp ? 'border-purple-500/30' : 'border-rose-500/30'}
                    ${isFav && mounted ? 'ring-2 ring-yellow-500/20' : ''}
                    hover:scale-[1.02] hover:bg-[#121214] overflow-hidden group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-800/80 p-2 flex items-center justify-center overflow-hidden shrink-0">
                         <img 
                            src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
                            alt={coin.symbol} 
                            className={`w-full h-full object-contain drop-shadow-md ${isDisconnected ? 'opacity-50' : ''}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent && parent.children.length === 1) {
                                const span = document.createElement('span');
                                span.className = 'text-xs font-bold text-zinc-300';
                                span.innerText = coin.symbol;
                                parent.appendChild(span);
                              }
                            }}
                         />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
                          {coin.symbol}
                        </h2>
                        <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider">USDT</p>
                      </div>
                    </div>
                    {mounted && <StarIcon filled={isFav} onClick={() => toggleFavorite(coin.symbol)} />}
                  </div>
                  
                  <div className="text-right mt-2 flex-grow flex flex-col justify-end z-10">
                    <p 
                      key={coin.lastUpdate} 
                      className={`text-xl md:text-2xl font-mono font-semibold tracking-tight 
                        ${isDisconnected ? 'text-zinc-500' :
                          coin.isUp ? 'text-purple-400 animate-blink-up' : 'text-rose-400 animate-blink-down'}`}
                    >
                      ${coin.price}
                    </p>
                  </div>

                  <div className={`h-[30px] w-full mt-1 -mx-2 transition-opacity duration-300 z-0
                    ${isDisconnected ? 'opacity-20' : 'opacity-50 group-hover:opacity-100'}`}>
                    {chartData.length > 1 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <YAxis 
                            domain={[minPrice - padding, maxPrice + padding]} 
                            hide 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={isDisconnected ? "#52525b" : (coin.isUp ? "#a855f7" : "#fb7185")} 
                            strokeWidth={isDisconnected ? 1 : 2} 
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
