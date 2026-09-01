import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Shield, Zap, TrendingUp, Bell, Bot, ChevronDown, Check, Cpu, Globe, ArrowUpRight, Loader2 } from 'lucide-react';
import { RiskProfileType, StockData, NotificationItem } from '../types';
import { searchLiveSymbols } from '../services/api';

interface NavbarProps {
  currentStock: StockData;
  allStocks: StockData[];
  onSelectStock: (ticker: string) => void;
  riskProfile: RiskProfileType;
  onChangeRiskProfile: (profile: RiskProfileType) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenArchitectureModal: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStock,
  allStocks,
  onSelectStock,
  riskProfile,
  onChangeRiskProfile,
  notifications,
  onOpenNotifications,
  onOpenArchitectureModal,
  onOpenChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState<Array<{ symbol: string; cleanTicker: string; name: string; exchange: string; type: string }>>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return allStocks;
    const q = searchQuery.toLowerCase().trim();
    return allStocks.filter(
      s =>
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q)
    );
  }, [allStocks, searchQuery]);

  // Debounced live exchange search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setLiveSearchResults((prev) => (prev.length === 0 ? prev : []));
      setIsSearchingLive((prev) => (prev ? false : prev));
      return;
    }

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsSearchingLive(true);
      try {
        const results = await searchLiveSymbols(trimmed);
        if (!isCancelled) {
          const existingTickers = new Set(allStocks.map(s => s.ticker.toUpperCase()));
          const uniqueLive = results.filter(r => !existingTickers.has(r.cleanTicker.toUpperCase()));
          setLiveSearchResults(uniqueLive);
        }
      } catch (e) {
        if (!isCancelled) setLiveSearchResults([]);
      } finally {
        if (!isCancelled) setIsSearchingLive(false);
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, allStocks]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const riskProfiles = [
    {
      id: 'conservative' as RiskProfileType,
      title: 'Conservative',
      subtitle: 'Zero Risk Tolerance & Capital Protection',
      icon: Shield,
      badge: 'Defensive',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'moderate' as RiskProfileType,
      title: 'Moderate',
      subtitle: 'Balanced Multi-Agent Growth',
      icon: TrendingUp,
      badge: 'Balanced',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'aggressive' as RiskProfileType,
      title: 'Aggressive',
      subtitle: 'High Momentum & Breakout Hunter',
      icon: Zap,
      badge: 'Aggressive',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    }
  ];

  const currentRisk = riskProfiles.find(r => r.id === riskProfile) || riskProfiles[0];
  const CurrentIcon = currentRisk.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#08080C] border-b border-white/10 transition-colors">
      {/* Micro ticker top strip */}
      <div className="border-b border-white/5 py-1 px-4 overflow-hidden bg-[#050505] text-[11px] text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-neutral-300 font-medium uppercase tracking-wider text-[10px]">
            Autonomous Swarm Active
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] text-neutral-400 font-mono">
          <span>LATENCY: <strong className="text-cyan-400 font-medium">32ms</strong></span>
          <span>ENGINE: <strong className="text-neutral-200 font-medium">GEMINI 2.5</strong></span>
          <span>MARKET: <strong className="text-emerald-400 font-medium">NSE/BSE</strong></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3 sm:gap-6">
          
          {/* Logo & Geometric Branding */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-[#161620] rounded-lg flex items-center justify-center text-white border border-white/10">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white tracking-tight">
                  Nifty<span className="text-neutral-400 font-normal">Mind</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-300 border border-white/10">
                  3-Agent Swarm
                </span>
              </div>
            </div>
          </div>

          {/* Obsidian Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                id="stock-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search ticker (e.g. TATAMOTORS, RELIANCE, TCS)..."
                className="w-full pl-9 pr-8 py-1.5 bg-[#0F0F14] hover:bg-[#14141C] focus:bg-[#12121A] text-xs text-white placeholder-neutral-500 rounded-lg border border-white/10 focus:border-white/25 outline-hidden transition-all"
              />
              {isSearchingLive && (
                <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 animate-spin" />
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-[#0E0E14] rounded-xl border border-white/10 py-2 max-h-96 overflow-y-auto z-50 divide-y divide-white/5 shadow-2xl">
                {/* Watchlist & Popular Stocks */}
                {filteredStocks.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                      Preset Equities & Watchlist
                    </div>
                    {filteredStocks.map((stock) => (
                      <button
                        key={stock.ticker}
                        onClick={() => {
                          onSelectStock(stock.ticker);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-white/5 transition-colors ${
                          stock.ticker === currentStock.ticker ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center font-bold text-xs text-neutral-300 border border-white/5 font-mono">
                            {stock.ticker.slice(0, 3)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-white font-mono">{stock.ticker}</span>
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/5 text-neutral-400">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">{stock.name}</p>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <div className="font-semibold text-xs text-white">₹{stock.currentPrice.toFixed(2)}</div>
                          <div className={`text-[11px] font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Real-time Exchange Live Results */}
                {liveSearchResults.length > 0 && (
                  <div className="pt-2">
                    <div className="px-3.5 py-1 text-[10px] font-medium text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Live Exchange Search
                    </div>
                    {liveSearchResults.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() => {
                          onSelectStock(item.cleanTicker || item.symbol);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-cyan-950/40 flex items-center justify-center font-bold text-xs text-cyan-300 border border-cyan-500/30 font-mono">
                            {item.cleanTicker.slice(0, 3)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-white font-mono">{item.cleanTicker}</span>
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/5 text-neutral-400">
                                {item.exchange}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 truncate max-w-[220px]">{item.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
                          <span>Audit</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Risk Profile Switcher */}
            <div ref={profileRef} className="relative">
              <button
                id="risk-profile-selector"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F0F14] hover:bg-[#14141C] border border-white/10 rounded-lg text-xs font-medium text-neutral-200 transition-all"
              >
                <CurrentIcon className="w-3.5 h-3.5 text-neutral-300" />
                <span className="hidden sm:inline text-neutral-400">Risk:</span>
                <span className="font-medium text-white">{currentRisk.title}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0E0E14] rounded-xl border border-white/10 p-2 z-50 shadow-2xl">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <div className="text-xs font-semibold text-white">Investor Risk Persona</div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      The Boss AI adjusts arbitration weights & stop-loss rules to your profile.
                    </p>
                  </div>

                  {riskProfiles.map((p) => {
                    const Icon = p.icon;
                    const isSelected = p.id === riskProfile;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onChangeRiskProfile(p.id);
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-lg text-left flex items-start gap-2.5 transition-colors ${
                          isSelected ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-300'
                        }`}
                      >
                        <div className="p-1.5 rounded bg-white/5 text-white shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-xs text-white">{p.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-400">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{p.subtitle}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              id="notification-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Multi-Agent Chat Launcher */}
            <button
              id="agent-chat-launcher"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121218] hover:bg-[#181822] text-neutral-200 border border-white/10 rounded-lg text-xs font-medium transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Ask Swarm</span>
            </button>

            {/* Architecture Guide */}
            <button
              id="architecture-guide-btn"
              onClick={onOpenArchitectureModal}
              className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
              title="System Architecture Diagram"
            >
              Docs
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
