"use client";

import { useBinance } from "@/hooks/useBinance";

const LOGOS: Record<string, string> = {
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=035",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=035",
  BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=035",
  FET: "https://cryptologos.cc/logos/fetch-ai-fet-logo.svg?v=035",
  DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=035",
};

// Para mantener el orden visual (3x2 grid)
const ORDER = ["BTC", "ETH", "SOL", "BNB", "FET", "DOGE"];

export default function Home() {
  const { cryptos, loading } = useBinance();

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
          Crypto<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Watch</span>
        </h1>
        <p className="text-gray-400 text-lg">Mercado en tiempo real • Binance Stream</p>
      </header>

      <section id="dashboard">
        {loading || Object.keys(cryptos).length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl flex items-center justify-center shadow-max">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
              <p className="text-zinc-500 italic">Conectando con el mercado maestro...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ORDER.map((sym) => {
              const coin = cryptos[`${sym}USDT`];
              // Si la moneda aún no ha llegado en el stream, renderizamos un skeleton ligero o no renderizamos
              if (!coin) return null;

              return (
                <div 
                  key={coin.symbol} 
                  className={`bg-[#0a0a0c] p-6 rounded-2xl border transition-all duration-300 shadow-lg flex items-center justify-between
                    ${coin.isUp ? 'border-purple-500/50 shadow-purple-900/20' : 'border-rose-500/50 shadow-rose-900/10'}
                    hover:scale-[1.02] hover:bg-[#121214]`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 p-2 flex items-center justify-center">
                       <img src={LOGOS[coin.symbol]} alt={coin.symbol} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{coin.symbol}</h2>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-mono font-semibold tracking-tight transition-colors duration-300 ${coin.isUp ? 'text-purple-400' : 'text-rose-500'}`}>
                      ${coin.price}
                    </p>
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
