import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Shield, Zap, TrendingUp, Bell, Bot, Sparkles, AlertCircle, FileText, CheckCircle2, ChevronDown, Check, Cpu, Globe, ArrowUpRight, Loader2 } from 'lucide-react';
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
      subtitle: 'Safe & Steady',
      icon: Shield,
      badge: 'Zero Risk Tolerance',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'moderate' as RiskProfileType,
      title: 'Moderate',
      subtitle: 'Balanced Builder',
      icon: TrendingUp,
      badge: 'Balanced Growth',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'aggressive' as RiskProfileType,
      title: 'Aggressive',
      subtitle: 'High Momentum',
      icon: Zap,
      badge: 'High Reward',
      color: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  ];

  const currentRisk = riskProfiles.find(r => r.id === riskProfile) || riskProfiles[0];
  const CurrentIcon = currentRisk.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Geometric Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">Nifty<span className="text-indigo-600 font-bold">Mind</span></span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Live NSE/BSE Feed
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 hidden sm:block tracking-wide uppercase">
                Autonomous Multi-Agent Financial Intelligence
              </p>
            </div>
          </div>

          {/* Rounded-full Geometric Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="stock-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search any stock, ticker (e.g. TCS, ITC, SBIN, RELIANCE, AAPL)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 placeholder-slate-400 rounded-full border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all shadow-2xs"
              />
              {isSearchingLive && (
                <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500 animate-spin" />
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 max-h-96 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100">
                {/* Watchlist & Popular Stocks */}
                {filteredStocks.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Watchlist & Top Stocks
                    </div>
                    {filteredStocks.map((stock) => (
                      <button
                        key={stock.ticker}
                        onClick={() => {
                          onSelectStock(stock.ticker);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${
                          stock.ticker === currentStock.ticker ? 'bg-indigo-50/70' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                            {stock.ticker.slice(0, 3)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-slate-900">{stock.ticker}</span>
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{stock.name}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-sm text-slate-900 font-mono">₹{stock.currentPrice.toFixed(2)}</div>
                          <div className={`text-xs font-bold font-mono ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
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
                    <div className="px-3.5 py-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Live Exchange Search Results
                    </div>
                    {liveSearchResults.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() => {
                          onSelectStock(item.cleanTicker || item.symbol);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-indigo-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-200">
                            {item.cleanTicker.slice(0, 3)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-slate-900">{item.cleanTicker}</span>
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-100/70 text-indigo-700 font-mono">
                                {item.exchange}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate max-w-[220px]">{item.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                          <span>Audit Live</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Ticker Loader */}
                {searchQuery.trim().length > 0 && filteredStocks.length === 0 && liveSearchResults.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-sm text-slate-600 mb-2">
                      Load real-time live market feed for <span className="font-bold text-indigo-600">"{searchQuery.toUpperCase()}"</span>?
                    </p>
                    <button
                      onClick={() => {
                        onSelectStock(searchQuery.trim().toUpperCase());
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="px-4 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
                    >
                      Fetch & Audit {searchQuery.trim().toUpperCase()}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions: Risk Profile, Notifications, Chat, Judges Architecture */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Risk Profile Switcher Button */}
            <div ref={profileRef} className="relative">
              <button
                id="risk-profile-selector"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-800 transition-all shadow-2xs"
                title="Change Investor Risk Profile to see custom Boss AI advice"
              >
                <CurrentIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline font-medium text-slate-500">Profile:</span>
                <span className="font-extrabold text-slate-900">{currentRisk.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900">Select Investor Persona</div>
                    <p className="text-[11px] text-slate-500">
                      The Boss AI dynamically adapts its advice & stop-loss rules to your profile.
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
                        className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors ${
                          isSelected ? 'bg-indigo-50/70 border border-indigo-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${p.color} shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{p.title}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{p.subtitle}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-1" />}
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
              className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="System Alerts & Filings Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Multi-Agent Chat Launcher */}
            <button
              id="agent-chat-launcher"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold transition-all shadow-2xs"
              title="Interrogate specific AI detectives"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Ask Detectives</span>
            </button>

            {/* Architecture Modal Button for Judges */}
            <button
              id="architecture-guide-btn"
              onClick={onOpenArchitectureModal}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
              title="View Multi-Agent Architecture & Rubric Breakdown"
            >
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

