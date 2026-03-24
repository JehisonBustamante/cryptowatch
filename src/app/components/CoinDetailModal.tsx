"use client";

import { useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { CoinData } from "@/hooks/useBinance";

// ─── Static coin metadata ────────────────────────────────────────────────────

const COIN_META: Record<
  string,
  { name: string; description: string; milestones: { year: string; event: string }[] }
> = {
  BTC: {
    name: "Bitcoin",
    description:
      "La primera criptomoneda descentralizada del mundo, creada por Satoshi Nakamoto en 2009. Opera sobre una blockchain Proof-of-Work y tiene un suministro máximo de 21 millones de monedas.",
    milestones: [
      { year: "2009", event: "Genesis Block minado el 3 de enero." },
      { year: "2010", event: "Primera transacción comercial: 10,000 BTC por dos pizzas." },
      { year: "2017", event: "Primer bull run: BTC supera los $20,000." },
      { year: "2020", event: "Tercer halving — recompensa cae a 6.25 BTC/bloque." },
      { year: "2021", event: "Nuevo ATH: $69,000. El Salvador adopta BTC como moneda legal." },
      { year: "2024", event: "Cuarto halving — recompensa cae a 3.125 BTC/bloque." },
    ],
  },
  ETH: {
    name: "Ethereum",
    description:
      "Plataforma de contratos inteligentes fundada por Vitalik Buterin. Impulsa DeFi, NFTs y miles de dApps. Migró a Proof-of-Stake en 'The Merge' de 2022.",
    milestones: [
      { year: "2015", event: "Lanzamiento de Frontier, primera red pública." },
      { year: "2016", event: "El hack de The DAO provoca el fork Ethereum Classic." },
      { year: "2020", event: "Lanzamiento de la Beacon Chain (PoS)." },
      { year: "2022", event: "The Merge: transición completa a Proof-of-Stake." },
      { year: "2024", event: "EIP-4844 (Proto-Danksharding) reduce costos en L2." },
    ],
  },
  SOL: {
    name: "Solana",
    description:
      "Blockchain de alto rendimiento con Proof-of-History. Capaz de procesar más de 65,000 TPS. Popular en NFTs, DeFi y aplicaciones de gaming.",
    milestones: [
      { year: "2020", event: "Mainnet Beta lanzada en marzo." },
      { year: "2021", event: "ATH ~$260. Ecosystem explota con NFTs y DeFi." },
      { year: "2022", event: "Caída por el colapso de FTX; red sufrió outages." },
      { year: "2024", event: "Resurgimiento: SOL supera $200. Firedancer en testnet." },
    ],
  },
  BNB: {
    name: "BNB",
    description:
      "Token nativo de Binance y BNB Chain. Usado para fees con descuento, gas en BNB Chain y governance. Binance realiza quemas trimestrales para reducir el suministro.",
    milestones: [
      { year: "2017", event: "ICO de Binance; BNB lanzado como token ERC-20." },
      { year: "2019", event: "Lanzamiento de Binance Chain (mainnet)." },
      { year: "2020", event: "Lanzamiento de Binance Smart Chain (EVM-compatible)." },
      { year: "2022", event: "Rebrand a 'BNB Chain'. Hack de cross-chain bridge." },
      { year: "2023", event: "Multa de $4.3B a Binance; CZ renuncia como CEO." },
    ],
  },
  FET: {
    name: "Fetch.ai",
    description:
      "Red descentralizada de agentes autónomos impulsada por IA. Permite crear agentes inteligentes que automatizan tareas en DeFi, supply chain y más.",
    milestones: [
      { year: "2019", event: "IEO en Binance Launchpad." },
      { year: "2023", event: "Lanzamiento de agentes autónomos v2." },
      { year: "2024", event: "Fusión con SingularityNET y Ocean Protocol en ASI Alliance." },
    ],
  },
  DOGE: {
    name: "Dogecoin",
    description:
      "Criptomoneda meme creada en 2013 por Billy Markus y Jackson Palmer. Tiene supply ilimitado e inflación controlada. Adoptada por comunidades y celebridades.",
    milestones: [
      { year: "2013", event: "Creada como broma basada en el meme Shiba Inu." },
      { year: "2021", event: "ATH ~$0.74 impulsado por Elon Musk y Reddit." },
      { year: "2022", event: "Elon Musk adquiere Twitter; DOGE sube 100%+." },
      { year: "2024", event: "Musk menciona 'DOGE' como posible nombre de su agencia gubernamental." },
    ],
  },
};

// ─── Custom tooltip ──────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const formatted =
    v >= 1000
      ? v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : v >= 1
      ? v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })
      : v.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });

  return (
    <div className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg shadow-xl text-sm text-white font-mono">
      ${formatted}
    </div>
  );
};

// ─── Stat box ────────────────────────────────────────────────────────────────

const Stat = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{label}</span>
    <span className={`text-sm font-semibold font-mono ${valueClass ?? "text-white"}`}>
      {value}
    </span>
  </div>
);

// ─── Main modal ──────────────────────────────────────────────────────────────

interface CoinDetailModalProps {
  coin: CoinData | null;
  onClose: () => void;
}

export function CoinDetailModal({ coin, onClose }: CoinDetailModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  if (!coin) return null;

  const meta = COIN_META[coin.symbol] ?? {
    name: coin.symbol,
    description: "Datos de mercado en tiempo real vía Binance WebSocket.",
    milestones: [],
  };

  const change24h = parseFloat(coin.change24h ?? "0");
  const changeColor = change24h >= 0 ? "#34d399" : "#fb7185";
  const changeSign = change24h >= 0 ? "+" : "";
  const isUp = change24h >= 0;

  const chartData = coin.history.map((val, i) => ({ index: i, value: val }));
  const minPrice = Math.min(...coin.history);
  const maxPrice = Math.max(...coin.history);
  const yPad = (maxPrice - minPrice) * 0.05 || 0.001;

  const gradientId = `gradient-${coin.symbol}`;
  const accentColor = isUp ? "#a855f7" : "#fb7185";
  const accentLight = isUp ? "#c084fc" : "#fda4af";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 modal-backdrop"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full sm:max-w-2xl bg-[#0d0d10] rounded-t-3xl sm:rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentLight})` }}
        />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-800 p-2 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                  alt={coin.symbol}
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {meta.name}
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    ({coin.symbol}/USDT)
                  </span>
                </h2>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-mono font-bold text-white">
                    ${coin.price}
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ color: changeColor }}
                  >
                    {changeSign}
                    {change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center text-zinc-400 hover:text-white shrink-0"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 24h stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-900/50 rounded-2xl p-4 mb-6 border border-zinc-800">
            <Stat label="24h Máximo" value={coin.high24h ? `$${coin.high24h}` : "—"} valueClass="text-emerald-400" />
            <Stat label="24h Mínimo" value={coin.low24h ? `$${coin.low24h}` : "—"} valueClass="text-rose-400" />
            <Stat label="Volumen 24h" value={coin.volume24h ?? "—"} />
            <Stat label="Cambio 24h" value={`${changeSign}${change24h.toFixed(2)}%`} valueClass={isUp ? "text-emerald-400" : "text-rose-400"} />
          </div>

          {/* Session area chart */}
          <div className="mb-6">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
              Historial de Sesión (últimas {coin.history.length} actualizaciones)
            </p>
            <div className="h-[160px] w-full">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="index" hide />
                    <YAxis
                      domain={[minPrice - yPad, maxPrice + yPad]}
                      hide
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={accentColor}
                      strokeWidth={2}
                      fill={`url(#${gradientId})`}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                  Acumulando datos de precio…
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">{meta.description}</p>

          {/* Milestones */}
          {meta.milestones.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                Hitos Históricos
              </p>
              <div className="relative pl-4 space-y-3">
                {/* Vertical line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-800" />
                {meta.milestones.map((m) => (
                  <div key={m.year} className="flex gap-3 items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-1 shrink-0 -ml-[5px]"
                      style={{ background: accentColor }}
                    />
                    <div>
                      <span
                        className="text-xs font-bold mr-2"
                        style={{ color: accentColor }}
                      >
                        {m.year}
                      </span>
                      <span className="text-sm text-zinc-300">{m.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
