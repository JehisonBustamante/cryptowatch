"use client";

import { useState, useEffect } from "react";
import { useBinance } from "@/hooks/useBinance";
import { CryptoCard } from "@/app/components/CryptoCard";
import { CoinDetailModal } from "@/app/components/CoinDetailModal";
import type { CoinData } from "@/hooks/useBinance";

const ORDER = ["BTC", "ETH", "SOL", "BNB", "FET", "DOGE"];

const CryptoCardSkeleton = () => (
  <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-zinc-800 shadow-lg flex flex-col justify-between h-[180px] animate-pulse">
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
    <div className="mt-4 flex flex-col items-end gap-1">
      <div className="w-24 h-7 bg-zinc-800 rounded"></div>
      <div className="w-16 h-4 bg-zinc-800 rounded"></div>
    </div>
    <div className="h-[32px] w-full mt-2 bg-zinc-900 rounded"></div>
  </div>
);

export default function Home() {
  const { cryptos, loading, status } = useBinance();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("crypto_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Error leyendo favoritos", e);
      }
    }
  }, []);

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem("crypto_favorites", JSON.stringify(next));
      return next;
    });
  };

  // Keep the modal data fresh as prices update
  useEffect(() => {
    if (selectedCoin) {
      const key = `${selectedCoin.symbol}USDT`;
      const updated = cryptos[key];
      if (updated) setSelectedCoin(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptos]);

  const isDisconnected = status === "reconnecting" || status === "error";

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 md:mb-3 tracking-tight">
            Crypto
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
              Watch
            </span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg">
            Mercado en tiempo real • Binance Stream
          </p>
        </div>

        {/* Connection status badge */}
        <div className="mt-6 md:mt-0 flex items-center justify-center md:justify-end gap-3">
          <div className="flex items-center gap-2 bg-[#0a0a0c] px-4 py-2 rounded-full border border-zinc-800 shadow-sm">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                status === "connected"
                  ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : status === "reconnecting"
                  ? "bg-yellow-500 animate-bounce"
                  : "bg-zinc-500"
              }`}
            ></div>
            <span className="text-sm text-zinc-300 font-medium">
              {status === "connected"
                ? "Señal en Vivo"
                : status === "reconnecting"
                ? "Reconectando..."
                : "Conectando..."}
            </span>
          </div>
        </div>
      </header>

      <section id="dashboard">
        {loading || Object.keys(cryptos).length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {ORDER.map((sym) => (
              <CryptoCardSkeleton key={sym} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {ORDER.map((sym) => {
              const coin = cryptos[`${sym}USDT`];
              if (!coin) return <CryptoCardSkeleton key={sym} />;

              return (
                <CryptoCard
                  key={coin.symbol}
                  coin={coin}
                  isFav={mounted && favorites.includes(coin.symbol)}
                  isDisconnected={isDisconnected}
                  onToggleFav={toggleFavorite}
                  onSelect={setSelectedCoin}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Coin Detail Modal */}
      <CoinDetailModal
        coin={selectedCoin}
        onClose={() => setSelectedCoin(null)}
      />

      <footer className="mt-16 text-center text-sm text-zinc-600">
        Created by{" "}
        <span className="text-zinc-400 font-medium hover:text-purple-400 transition-colors">
          Jehison bustamante
        </span>
      </footer>
    </main>
  );
}
