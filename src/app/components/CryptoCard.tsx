"use client";

import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import type { CoinData } from "@/hooks/useBinance";

interface CryptoCardProps {
  coin: CoinData;
  isFav: boolean;
  isDisconnected: boolean;
  onToggleFav: (symbol: string) => void;
  onSelect: (coin: CoinData) => void;
}

const StarIcon = ({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) => (
  <svg
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#eab308" : "none"}
    stroke={filled ? "#eab308" : "#71717a"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform active:scale-95 z-10 relative"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export function CryptoCard({
  coin,
  isFav,
  isDisconnected,
  onToggleFav,
  onSelect,
}: CryptoCardProps) {
  const chartData = coin.history.map((val, i) => ({ index: i, value: val }));
  const minPrice = Math.min(...coin.history);
  const maxPrice = Math.max(...coin.history);
  const padding = (maxPrice - minPrice) * 0.01 || 0.001;

  const flashClass = isDisconnected
    ? "text-zinc-500"
    : coin.isUp
    ? "price-flash-up"
    : "price-flash-down";

  const change24h = parseFloat(coin.change24h ?? "0");
  const changeColor =
    change24h >= 0 ? "text-emerald-400" : "text-rose-400";
  const changeSign = change24h >= 0 ? "+" : "";

  return (
    <div
      className={`relative bg-[#0a0a0c] pt-5 px-5 pb-3 rounded-2xl border transition-all duration-300 shadow-lg flex flex-col justify-between h-[180px] cursor-pointer select-none
        ${
          isDisconnected
            ? "border-zinc-800 grayscale-[0.6] opacity-70"
            : coin.isUp
            ? "border-purple-500/30 hover:border-purple-500/60"
            : "border-rose-500/30 hover:border-rose-500/60"
        }
        ${isFav ? "ring-2 ring-yellow-500/20" : ""}
        hover:scale-[1.02] hover:bg-[#121214] overflow-hidden group`}
      onClick={() => onSelect(coin)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-800/80 p-2 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
              alt={coin.symbol}
              className={`w-full h-full object-contain drop-shadow-md ${
                isDisconnected ? "opacity-50" : ""
              }`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent && parent.children.length === 1) {
                  const span = document.createElement("span");
                  span.className = "text-xs font-bold text-zinc-300";
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
            <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider">
              USDT
            </p>
          </div>
        </div>
        <StarIcon filled={isFav} onClick={() => onToggleFav(coin.symbol)} />
      </div>

      {/* Price + 24h change */}
      <div className="text-right mt-2 flex-grow flex flex-col justify-end z-10">
        <p
          key={coin.lastUpdate}
          className={`text-xl md:text-2xl font-mono font-semibold tracking-tight ${flashClass}`}
        >
          ${coin.price}
        </p>
        {coin.change24h !== undefined && (
          <p className={`text-xs font-medium mt-0.5 ${changeColor}`}>
            {changeSign}
            {change24h.toFixed(2)}% (24h)
          </p>
        )}
      </div>

      {/* Sparkline */}
      <div
        className={`h-[32px] w-full mt-1 -mx-2 transition-opacity duration-300 z-0
          ${isDisconnected ? "opacity-20" : "opacity-50 group-hover:opacity-100"}`}
      >
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
                stroke={
                  isDisconnected
                    ? "#52525b"
                    : coin.isUp
                    ? "#a855f7"
                    : "#fb7185"
                }
                strokeWidth={isDisconnected ? 1 : 2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* "Click for details" hint */}
      <div className="absolute bottom-2 left-5 text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
        Click para detalles →
      </div>
    </div>
  );
}
