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
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Sliders, 
  Eye, 
  RefreshCw, 
  BarChart2, 
  Crosshair, 
  ShieldAlert,
  Target
} from 'lucide-react';
import { StockData } from '../types';

interface PriceChartProps {
  stock: StockData;
  targetPrice?: number;
  stopLossPrice?: number;
}

type ChartViewMode = 'area' | 'indicators' | 'volume_split';
type TimeframeMode = '1D' | '1W' | '1M' | '3M' | '1Y';

export const PriceChart: React.FC<PriceChartProps> = ({ stock, targetPrice, stopLossPrice }) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('area');
  const [timeframe, setTimeframe] = useState<TimeframeMode>('1D');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(false);
  const [showEMA200, setShowEMA200] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5 = 150%, 2 = 200%
  const [sliceWindow, setSliceWindow] = useState<{ start: number; end: number }>({ start: 0, end: 100 });

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
  }, [stock.ticker]);

  const [chartData, setChartData] = useState(baseData);

  // Sync dataset only when the active ticker changes
  useEffect(() => {
    if (baseData.length > 0) {
      setChartData(baseData);
      setSliceWindow({ start: 0, end: baseData.length - 1 });
    }
  }, [stock.ticker]);

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
  }, [isLiveStreaming, stock.ticker]);

  // Handle Zoom In / Zoom Out
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setSliceWindow({ start: 0, end: chartData.length - 1 });
  };

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

  // Custom Rich Tooltip for Crosshair Hover
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-md min-w-[210px] text-xs font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
            <span className="font-mono text-[11px] text-indigo-300 font-bold flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-indigo-400" />
              {label || data.time}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${data.color === '#10b981' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
              ₹{Number(data.price).toFixed(2)}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            {data.open && data.close && (
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300 pb-1.5 border-b border-slate-800">
                <div>Open: <strong className="text-white font-mono">₹{data.open}</strong></div>
                <div>High: <strong className="text-white font-mono">₹{data.high}</strong></div>
                <div>Low: <strong className="text-white font-mono">₹{data.low}</strong></div>
                <div>Close: <strong className="text-white font-mono">₹{data.close}</strong></div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Volume:</span>
              <span className="font-mono font-bold text-slate-200">
                {data.volume ? `${(data.volume / 100000).toFixed(2)} Lakh` : 'N/A'}
              </span>
            </div>

            {showEMA20 && data.ema20 && (
              <div className="flex items-center justify-between">
                <span className="text-indigo-400">EMA 20:</span>
                <span className="font-mono font-bold text-indigo-200">₹{data.ema20}</span>
              </div>
            )}

            {showEMA50 && data.ema50 && (
              <div className="flex items-center justify-between">
                <span className="text-purple-400">EMA 50:</span>
                <span className="font-mono font-bold text-purple-200">₹{data.ema50}</span>
              </div>
            )}

            {showEMA200 && data.ema200 && (
              <div className="flex items-center justify-between">
                <span className="text-rose-400">EMA 200:</span>
                <span className="font-mono font-bold text-rose-200">₹{data.ema200}</span>
              </div>
            )}

            {data.rsi && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-amber-400">RSI(14):</span>
                <span className="font-mono font-bold text-amber-200">{data.rsi}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs mb-6">
      
      {/* Top Header & Chart Control Center */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        
        {/* Title and Key Technical Indicators Badges */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              Interactive Price Chart
            </span>
            
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              EMA 20: ₹{stock.ema20}
            </span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              EMA 50: ₹{stock.ema50}
            </span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              EMA 200: ₹{stock.ema200}
            </span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              RSI: {stock.rsi14.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
            <span>Current: <strong className="text-slate-900 font-mono">₹{stock.currentPrice.toFixed(2)}</strong></span>
            <span>•</span>
            <span className={stock.change >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%)
            </span>
            <span>•</span>
            <span>Vol: <strong className="text-slate-800 font-mono">{(stock.volume / 100000).toFixed(1)}L</strong></span>
          </div>
        </div>

        {/* Action Controls: Zoom, View Type, Timeframe, Overlays */}
        <div className="flex items-center gap-2 flex-wrap self-stretch lg:self-auto justify-between lg:justify-end">
          
          {/* Zoom & Pan Controls */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-full text-slate-600 hover:text-indigo-700 hover:bg-white transition-all"
              title="Zoom In (+50%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold px-1 text-slate-600">
              {zoomLevel}x
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-full text-slate-600 hover:text-indigo-700 hover:bg-white transition-all"
              title="Zoom Out (-50%)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-full text-slate-600 hover:text-rose-700 hover:bg-white transition-all"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            {(['1D', '1W', '1M', '3M', '1Y'] as TimeframeMode[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  timeframe === tf ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setViewMode('area')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'area' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setViewMode('indicators')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'indicators' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Multi-EMA
            </button>
            <button
              onClick={() => setViewMode('volume_split')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'volume_split' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Vol & MACD
            </button>
          </div>

          {/* Live Tick Stream Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`p-1.5 rounded-full border transition-all ${
              isLiveStreaming ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title={isLiveStreaming ? 'Live tick streaming active' : 'Live stream paused'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>

        </div>
      </div>

      {/* Indicator Pill Bar Toggles */}
      <div className="flex items-center gap-2 pt-3 pb-1 overflow-x-auto text-xs">
        <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Sliders className="w-3 h-3" />
          Overlays:
        </span>

        <button
          onClick={() => setShowEMA20(!showEMA20)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showEMA20 ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          EMA 20
        </button>

        <button
          onClick={() => setShowEMA50(!showEMA50)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showEMA50 ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          EMA 50
        </button>

        <button
          onClick={() => setShowEMA200(!showEMA200)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showEMA200 ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          EMA 200
        </button>

        <button
          onClick={() => setShowBollinger(!showBollinger)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showBollinger ? 'bg-cyan-50 text-cyan-700 border-cyan-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          Bollinger (20,2)
        </button>

        <button
          onClick={() => setShowVolume(!showVolume)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showVolume ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          Volume Bars
        </button>

        <button
          onClick={() => setShowRSI(!showRSI)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showRSI ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          RSI Oscillator
        </button>

        <button
          onClick={() => setShowMACD(!showMACD)}
          className={`px-2.5 py-0.5 rounded-full border font-bold text-[11px] transition-all ${
            showMACD ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
        >
          MACD
        </button>
      </div>

      {/* Main Interactive Multi-layer Chart Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUpTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isUpTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              tickLine={false} 
              axisLine={{ stroke: '#e2e8f0' }} 
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* AI Stop-loss Guardrail Reference Line */}
            {stopLossPrice && (
              <ReferenceLine 
                y={stopLossPrice} 
                stroke="#f43f5e" 
                strokeDasharray="4 4" 
                label={{ value: `Stop-Loss ₹${stopLossPrice}`, fill: '#e11d48', fontSize: 10, position: 'insideBottomRight' }} 
              />
            )}

            {/* AI Upside Target Reference Line */}
            {targetPrice && (
              <ReferenceLine 
                y={targetPrice} 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                label={{ value: `Target ₹${targetPrice}`, fill: '#059669', fontSize: 10, position: 'insideTopRight' }} 
              />
            )}

            {/* Bollinger Bands Overlay */}
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
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartGradient)"
                name="Stock Price"
              />
            )}

            {/* Multi-line price action */}
            {viewMode === 'indicators' && (
              <Line
                type="monotone"
                dataKey="price"
                stroke={isUpTrend ? '#0f172a' : '#0f172a'}
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0f172a' }}
                name="Price"
              />
            )}

            {/* EMA Overlays */}
            {showEMA20 && (
              <Line type="monotone" dataKey="ema20" stroke="#4f46e5" strokeWidth={1.75} dot={false} name="EMA 20" />
            )}
            {showEMA50 && (
              <Line type="monotone" dataKey="ema50" stroke="#9333ea" strokeWidth={1.75} dot={false} name="EMA 50" />
            )}
            {showEMA200 && (
              <Line type="monotone" dataKey="ema200" stroke="#f43f5e" strokeWidth={1.75} dot={false} name="EMA 200" />
            )}

            {/* Volume overlay bars */}
            {showVolume && viewMode !== 'volume_split' && (
              <Bar dataKey="volume" yAxisId={0} fill="#cbd5e1" opacity={0.35} radius={[2, 2, 0, 0]} name="Volume" />
            )}

            {/* Interactive Brush Pan bar */}
            <Brush 
              dataKey="time" 
              height={22} 
              stroke="#4f46e5" 
              fill="#f8fafc"
              travellerWidth={10}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-panels for Volume, MACD, and RSI Momentum */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* RSI Momentum Gauge & Exhaustion Scout */}
        {showRSI && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                RSI (14-Day Momentum Tracker)
              </span>
              <span className={`font-mono font-extrabold ${stock.rsi14 > 70 ? 'text-rose-600' : stock.rsi14 < 35 ? 'text-emerald-600' : 'text-slate-800'}`}>
                {stock.rsi14.toFixed(1)} / 100 {stock.rsi14 > 70 ? '(Exhaustion Warning)' : stock.rsi14 < 35 ? '(Oversold Value Zone)' : '(Healthy Pace)'}
              </span>
            </div>
            
            {/* Visual Continuous Gradient Bar */}
            <div className="relative w-full h-3 bg-gradient-to-r from-emerald-300 via-slate-200 to-rose-300 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 w-3 bg-slate-900 rounded-full shadow-md -ml-1.5 transition-all duration-300 ring-2 ring-white"
                style={{ left: `${Math.min(96, Math.max(4, stock.rsi14))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>0 (Oversold)</span>
              <span>30 (Buy Level)</span>
              <span>70 (Overbought Level)</span>
              <span>100</span>
            </div>
          </div>
        )}

        {/* Volume & Golden Alignment Diagnosis */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
              Technical Scout Alignment
            </div>
            <div className="text-[11px] text-slate-600 mt-1 font-medium leading-tight">
              {stock.currentPrice > stock.ema20 && stock.currentPrice > stock.ema200
                ? '🟢 Bullish Golden Trend: Price trades firmly above EMA20 and long-term EMA200.'
                : stock.currentPrice < stock.ema200
                ? '🔴 Death Cross Zone: Price is constrained beneath major 200 EMA resistance.'
                : '🟡 Consolidation: Price is oscillating inside the 20/200 EMA corridor.'}
            </div>
          </div>
          <div className="text-right pl-3 shrink-0">
            <div className="text-xs font-extrabold text-slate-900 font-mono">
              {(stock.volume / stock.avgVolume).toFixed(2)}x
            </div>
            <div className="text-[10px] font-bold text-indigo-600">Vol Multiplier</div>
          </div>
        </div>

      </div>

    </div>
  );
};
