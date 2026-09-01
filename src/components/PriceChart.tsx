import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Area, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Brush, 
  ReferenceLine 
} from 'recharts';
import { 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sliders, 
  RefreshCw, 
  BarChart2, 
  Crosshair
} from 'lucide-react';
import { StockData } from '../types';

interface PriceChartProps {
  stock: StockData;
  targetPrice?: number;
  stopLossPrice?: number;
}

type ChartViewMode = 'area' | 'indicators';
type TimeframeMode = '1D' | '1W' | '1M' | '3M' | '1Y';

export const PriceChart: React.FC<PriceChartProps> = ({ stock, targetPrice, stopLossPrice }) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('area');
  const [timeframe, setTimeframe] = useState<TimeframeMode>('1D');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showEMA200, setShowEMA200] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Generate or sync dataset
  const baseData = useMemo(() => {
    if (stock.historicalPrices && stock.historicalPrices.length > 0) {
      return stock.historicalPrices.map((p, idx) => {
        const isUp = (p.close || p.price) >= (p.open || p.price);
        return {
          ...p,
          index: idx,
          color: isUp ? '#10b981' : '#f43f5e',
          volumeColor: isUp ? '#10b981' : '#f43f5e'
        };
      });
    }
    return [];
  }, [stock.historicalPrices]);

  const [chartData, setChartData] = useState(baseData);

  // Sync dataset when active ticker changes
  useEffect(() => {
    if (baseData.length > 0) {
      setChartData(baseData);
    }
  }, [baseData]);

  // Live real-time price tick simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setChartData((prev) => {
        if (!prev || prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const randomDelta = (Math.random() - 0.48) * (stock.currentPrice * 0.002);
        const newPrice = Number((last.price + randomDelta).toFixed(2));
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const isUp = newPrice >= last.price;
        const newEntry = {
          time: timeStr,
          price: newPrice,
          open: last.price,
          close: newPrice,
          high: Math.max(last.price, newPrice) + 0.5,
          low: Math.min(last.price, newPrice) - 0.5,
          volume: Math.floor(120000 + Math.random() * 350000),
          ema20: Number((stock.ema20 + (newPrice - stock.ema20) * 0.05).toFixed(1)),
          ema50: stock.ema50,
          ema200: stock.ema200,
          rsi: Number((stock.rsi14 + (isUp ? 0.3 : -0.3)).toFixed(1)),
          macd: stock.macd?.histogram || 0,
          bollingerUpper: Number((stock.currentPrice * 1.015).toFixed(1)),
          bollingerLower: Number((stock.currentPrice * 0.985).toFixed(1)),
          index: prev.length,
          color: isUp ? '#10b981' : '#f43f5e',
          volumeColor: isUp ? '#10b981' : '#f43f5e'
        };

        return [...prev.slice(-15), newEntry];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, stock.currentPrice, stock.ema20, stock.ema50, stock.ema200, stock.rsi14, stock.macd]);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  // Zoomed subset for display
  const displayData = useMemo(() => {
    if (zoomLevel === 1) return chartData;
    const count = Math.max(4, Math.floor(chartData.length / zoomLevel));
    return chartData.slice(-count);
  }, [chartData, zoomLevel]);

  const prices = displayData.map((d) => d.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.992 : stock.currentPrice * 0.98;
  const maxPrice = prices.length ? Math.max(...prices) * 1.008 : stock.currentPrice * 1.02;
  const isUpTrend = stock.change >= 0;

  // Solid, high-performance Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#101016] text-white rounded-xl p-3.5 border border-white/15 min-w-[200px] text-xs shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <span className="text-[11px] text-neutral-300 font-medium flex items-center gap-1.5 font-mono">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              {label || data.time}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              data.color === '#10b981' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              ₹{Number(data.price).toFixed(2)}
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono">
            {data.open && data.close && (
              <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-400 pb-1.5 border-b border-white/5">
                <div>O: <strong className="text-white">₹{data.open}</strong></div>
                <div>H: <strong className="text-white">₹{data.high}</strong></div>
                <div>L: <strong className="text-white">₹{data.low}</strong></div>
                <div>C: <strong className="text-white">₹{data.close}</strong></div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-neutral-400">
              <span>Volume:</span>
              <span className="text-white font-medium">
                {data.volume ? `${(data.volume / 100000).toFixed(2)}L` : 'N/A'}
              </span>
            </div>

            {showEMA20 && data.ema20 && (
              <div className="flex items-center justify-between text-cyan-400">
                <span>EMA 20:</span>
                <span className="font-semibold">₹{data.ema20}</span>
              </div>
            )}

            {showEMA50 && data.ema50 && (
              <div className="flex items-center justify-between text-violet-400">
                <span>EMA 50:</span>
                <span className="font-semibold">₹{data.ema50}</span>
              </div>
            )}

            {showEMA200 && data.ema200 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>EMA 200:</span>
                <span className="font-semibold">₹{data.ema200}</span>
              </div>
            )}

            {data.rsi && (
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-amber-400">
                <span>RSI(14):</span>
                <span className="font-semibold">{data.rsi}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden transition-all duration-200">
      
      {/* Top Header & Chart Control Center */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        
        {/* Title and Key Technical Indicators Badges */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Technical Price Action & Indicators
            </span>
            
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              EMA 20: ₹{stock.ema20}
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
              EMA 50: ₹{stock.ema50}
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              EMA 200: ₹{stock.ema200}
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              RSI: {stock.rsi14.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
            <span>LTP: <strong className="text-white font-mono font-medium">₹{stock.currentPrice.toFixed(2)}</strong></span>
            <span>•</span>
            <span className={`font-mono font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%)
            </span>
            <span>•</span>
            <span>Vol: <strong className="text-neutral-200 font-mono">{(stock.volume / 100000).toFixed(1)}L</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-stretch lg:self-auto justify-between lg:justify-end">
          
          {/* Zoom & Pan Controls */}
          <div className="flex items-center bg-[#121218] p-1 rounded-lg border border-white/10">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-medium px-1.5 text-neutral-300">
              {zoomLevel}x
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1 rounded text-rose-400 hover:bg-white/5 transition-all"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-[#121218] p-0.5 rounded-lg border border-white/10">
            {(['1D', '1W', '1M', '3M', '1Y'] as TimeframeMode[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                  timeframe === tf ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#121218] p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('area')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'area' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setViewMode('indicators')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'indicators' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EMA Lines
            </button>
          </div>

          {/* Live Tick Stream Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`p-1.5 rounded-lg border transition-all ${
              isLiveStreaming ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-white/5 text-neutral-500 border-white/10'
            }`}
            title={isLiveStreaming ? 'Live tick streaming active' : 'Live stream paused'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

        </div>
      </div>

      {/* Volumetric Layer Switchers */}
      <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto text-xs">
        <span className="text-neutral-400 font-medium text-[11px] flex items-center gap-1.5 shrink-0">
          <Sliders className="w-3 h-3 text-neutral-400" />
          Overlays:
        </span>

        <button
          onClick={() => setShowEMA20(!showEMA20)}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all shrink-0 ${
            showEMA20 ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 font-semibold' : 'bg-white/5 text-neutral-400 border-white/5'
          }`}
        >
          EMA 20
        </button>

        <button
          onClick={() => setShowEMA50(!showEMA50)}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all shrink-0 ${
            showEMA50 ? 'bg-violet-500/15 text-violet-300 border-violet-500/30 font-semibold' : 'bg-white/5 text-neutral-400 border-white/5'
          }`}
        >
          EMA 50
        </button>

        <button
          onClick={() => setShowEMA200(!showEMA200)}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all shrink-0 ${
            showEMA200 ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold' : 'bg-white/5 text-neutral-400 border-white/5'
          }`}
        >
          EMA 200
        </button>

        <button
          onClick={() => setShowBollinger(!showBollinger)}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all shrink-0 ${
            showBollinger ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 font-semibold' : 'bg-white/5 text-neutral-400 border-white/5'
          }`}
        >
          Bollinger
        </button>

        <button
          onClick={() => setShowVolume(!showVolume)}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all shrink-0 ${
            showVolume ? 'bg-white/10 text-white border-white/20 font-semibold' : 'bg-white/5 text-neutral-400 border-white/5'
          }`}
        >
          Volume
        </button>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-80 sm:h-96 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradientObsidian" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUpTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isUpTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A22" opacity={0.6} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }} 
              tickLine={false} 
              axisLine={{ stroke: '#1A1A22' }} 
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: '#737373', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* AI Stop-loss Guardrail */}
            {stopLossPrice && (
              <ReferenceLine 
                y={stopLossPrice} 
                stroke="#f43f5e" 
                strokeDasharray="4 4" 
                label={{ value: `Stop-Loss ₹${stopLossPrice}`, fill: '#f43f5e', fontSize: 10, position: 'insideBottomRight' }} 
              />
            )}

            {/* AI Upside Target */}
            {targetPrice && (
              <ReferenceLine 
                y={targetPrice} 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                label={{ value: `Target ₹${targetPrice}`, fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} 
              />
            )}

            {/* Bollinger Bands */}
            {showBollinger && (
              <>
                <Line type="monotone" dataKey="bollingerUpper" stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Upper" />
                <Line type="monotone" dataKey="bollingerLower" stroke="#06b6d4" strokeWidth={1} strokeDasharray="3 3" dot={false} name="BB Lower" />
              </>
            )}

            {/* Primary Price Area */}
            {viewMode === 'area' && (
              <Area
                type="monotone"
                dataKey="price"
                stroke={isUpTrend ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chartGradientObsidian)"
                name="Stock Price"
              />
            )}

            {/* Indicator view */}
            {viewMode === 'indicators' && (
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#8b5cf6' }}
                name="Price"
              />
            )}

            {/* EMA Overlays */}
            {showEMA20 && (
              <Line type="monotone" dataKey="ema20" stroke="#06b6d4" strokeWidth={1.8} dot={false} name="EMA 20" />
            )}
            {showEMA50 && (
              <Line type="monotone" dataKey="ema50" stroke="#8b5cf6" strokeWidth={1.8} dot={false} name="EMA 50" />
            )}
            {showEMA200 && (
              <Line type="monotone" dataKey="ema200" stroke="#10b981" strokeWidth={1.8} dot={false} name="EMA 200" />
            )}

            {/* Volume overlay */}
            {showVolume && (
              <Bar dataKey="volume" yAxisId={0} fill="#3b4261" opacity={0.25} radius={[2, 2, 0, 0]} name="Volume" />
            )}

            <Brush 
              dataKey="time" 
              height={18} 
              stroke="#8b5cf6" 
              fill="#0E0E14"
              travellerWidth={6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-panels for RSI Momentum & Technical Scout Alignment */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* RSI Momentum Tracker */}
        {showRSI && (
          <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                RSI (14-Day Momentum)
              </span>
              <span className={`font-mono font-medium ${stock.rsi14 > 70 ? 'text-rose-400' : stock.rsi14 < 35 ? 'text-emerald-400' : 'text-neutral-300'}`}>
                {stock.rsi14.toFixed(1)} / 100 {stock.rsi14 > 70 ? '(Exhaustion Warning)' : stock.rsi14 < 35 ? '(Oversold Value)' : '(Healthy Velocity)'}
              </span>
            </div>
            
            <div className="relative w-full h-2.5 bg-[#181822] rounded-full overflow-hidden border border-white/5">
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full -ml-1 transition-all duration-300"
                style={{ left: `${Math.min(96, Math.max(4, stock.rsi14))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 font-medium mt-1.5">
              <span>0 (Oversold)</span>
              <span>30 (Buy Entry)</span>
              <span>70 (Overbought)</span>
              <span>100</span>
            </div>
          </div>
        )}

        {/* Volume & Golden Alignment Diagnosis */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-violet-400" />
              Technical Scout Alignment
            </div>
            <div className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
              {stock.currentPrice > stock.ema20 && stock.currentPrice > stock.ema200
                ? '🟢 Golden Trend: Price trades firmly above EMA20 and long-term EMA200.'
                : stock.currentPrice < stock.ema200
                ? '🔴 Resistance Zone: Price is constrained beneath major 200 EMA resistance.'
                : '🟡 Consolidation: Price oscillating inside the 20/200 EMA corridor.'}
            </div>
          </div>
          <div className="text-right pl-4 shrink-0 font-mono">
            <div className="text-sm font-bold text-cyan-400">
              {(stock.volume / stock.avgVolume).toFixed(2)}x
            </div>
            <div className="text-[10px] text-neutral-400 font-sans">Vol Multiplier</div>
          </div>
        </div>

      </div>

    </div>
  );
};
