import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, TrendingDown, Plus, Play, CheckCircle2, 
  ArrowUpRight, Trash2, Edit3, Check, X, Sparkles,
  DollarSign, User,
  FileSpreadsheet, Copy, Settings, CheckCheck,
  AlertCircle
} from 'lucide-react';
import { UserProfile, StockData, PortfolioHolding, RiskProfileType } from '../types';
import { searchLiveSymbols } from '../services/api';

interface PortfolioWatchlistProps {
  userProfile: UserProfile;
  allStocks: StockData[];
  onSelectStock: (ticker: string) => void;
  onAuditPortfolio: () => void;
  isAuditingPortfolio: boolean;
  onUpdateHoldings: (holdings: PortfolioHolding[], cashBalance?: number) => void;
  onUpdateProfile?: (updatedProfile: Partial<UserProfile>) => void;
  riskProfile?: RiskProfileType;
  onChangeRiskProfile?: (profile: RiskProfileType) => void;
}

const PRESET_PORTFOLIOS: { name: string; description: string; holdings: PortfolioHolding[]; cash: number }[] = [
  {
    name: 'Balanced Bluechip',
    description: 'Auto, Banking & IT Titans',
    cash: 85000,
    holdings: [
      { ticker: 'TATAMOTORS', companyName: 'Tata Motors Limited', shares: 150, averageBuyPrice: 940.00, currentPrice: 986.40, sector: 'Automotive & EV', unrealizedPnl: 6960, unrealizedPnlPct: 4.94 },
      { ticker: 'HDFCBANK', companyName: 'HDFC Bank Ltd', shares: 70, averageBuyPrice: 1520.00, currentPrice: 1612.80, sector: 'Banking & Financials', unrealizedPnl: 6496, unrealizedPnlPct: 6.11 },
      { ticker: 'INFY', companyName: 'Infosys Limited', shares: 100, averageBuyPrice: 1640.00, currentPrice: 1598.20, sector: 'Information Technology', unrealizedPnl: -4180, unrealizedPnlPct: -2.55 }
    ]
  },
  {
    name: 'Growth & EV Tech',
    description: 'High-momentum automotive & electronics',
    cash: 50000,
    holdings: [
      { ticker: 'TATAMOTORS', companyName: 'Tata Motors Limited', shares: 200, averageBuyPrice: 920.00, currentPrice: 986.40, sector: 'Automotive & EV', unrealizedPnl: 13280, unrealizedPnlPct: 7.22 },
      { ticker: 'TMPV', companyName: 'Tata Motors PV Ltd', shares: 120, averageBuyPrice: 410.00, currentPrice: 432.50, sector: 'Automotive & EV', unrealizedPnl: 2700, unrealizedPnlPct: 5.49 },
      { ticker: 'TCS', companyName: 'Tata Consultancy Services', shares: 40, averageBuyPrice: 3800.00, currentPrice: 3950.00, sector: 'Information Technology', unrealizedPnl: 6000, unrealizedPnlPct: 3.95 }
    ]
  },
  {
    name: 'Defensive Value & Banking',
    description: 'High dividend, clean balance sheets',
    cash: 120000,
    holdings: [
      { ticker: 'HDFCBANK', companyName: 'HDFC Bank Ltd', shares: 120, averageBuyPrice: 1550.00, currentPrice: 1612.80, sector: 'Banking & Financials', unrealizedPnl: 7536, unrealizedPnlPct: 4.05 },
      { ticker: 'ITC', companyName: 'ITC Limited', shares: 300, averageBuyPrice: 420.00, currentPrice: 450.00, sector: 'FMCG & Consumer', unrealizedPnl: 9000, unrealizedPnlPct: 7.14 },
      { ticker: 'SBIN', companyName: 'State Bank of India', shares: 150, averageBuyPrice: 780.00, currentPrice: 820.00, sector: 'Banking & Financials', unrealizedPnl: 6000, unrealizedPnlPct: 5.13 }
    ]
  }
];

export const PortfolioWatchlist: React.FC<PortfolioWatchlistProps> = ({
  userProfile,
  allStocks,
  onSelectStock,
  onAuditPortfolio,
  isAuditingPortfolio,
  onUpdateHoldings,
  onUpdateProfile,
  riskProfile = 'conservative',
  onChangeRiskProfile,
}) => {
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingTitleInline, setIsEditingTitleInline] = useState(false);
  const [inlineTitleValue, setInlineTitleValue] = useState(userProfile.name);

  // Editing individual holding
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editShares, setEditShares] = useState<number>(0);
  const [editAvgPrice, setEditAvgPrice] = useState<number>(0);

  // New stock form state
  const [newTicker, setNewTicker] = useState('');
  const [newShares, setNewShares] = useState<number>(50);
  const [newBuyPrice, setNewBuyPrice] = useState<number>(0);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newSector, setNewSector] = useState('Diversified');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Cash editing
  const [isEditingCash, setIsEditingCash] = useState(false);
  const [customCash, setCustomCash] = useState(userProfile.cashBalance);

  // Custom Profile Form state
  const [profileFormName, setProfileFormName] = useState(userProfile.name);
  const [profileFormExperience, setProfileFormExperience] = useState(userProfile.experienceLevel);
  const [profileFormRisk, setProfileFormRisk] = useState<RiskProfileType>(riskProfile || userProfile.riskProfile);

  // Calculations
  const totalInvested = userProfile.holdings.reduce((acc, h) => acc + (h.averageBuyPrice * h.shares), 0);
  const currentTotalValue = userProfile.holdings.reduce((acc, h) => acc + (h.currentPrice * h.shares), 0);
  const totalUnrealizedPnl = currentTotalValue - totalInvested;
  const totalUnrealizedPnlPct = totalInvested > 0 ? (totalUnrealizedPnl / totalInvested) * 100 : 0;

  // Concentration score
  const maxHoldingWeight = currentTotalValue > 0 
    ? Math.max(...userProfile.holdings.map(h => (h.currentPrice * h.shares) / currentTotalValue))
    : 0;
  
  const calculatedRiskScore = userProfile.holdings.length === 0 
    ? 10 
    : Math.min(95, Math.max(15, Math.round((maxHoldingWeight * 50) + (userProfile.holdings.length < 3 ? 25 : 10))));

  const handleTickerSearch = async (query: string) => {
    setNewTicker(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    const localMatches = allStocks.filter(s => 
      s.ticker.toLowerCase().includes(query.toLowerCase()) || 
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    if (localMatches.length > 0) {
      setSearchResults(localMatches.map(s => ({
        symbol: s.ticker,
        cleanTicker: s.ticker,
        name: s.name,
        exchange: s.exchange,
        currentPrice: s.currentPrice,
        sector: s.sector
      })));
      return;
    }

    try {
      const liveResults = await searchLiveSymbols(query);
      setSearchResults(liveResults);
    } catch {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    const ticker = item.cleanTicker || item.symbol;
    setNewTicker(ticker);
    setNewCompanyName(item.name || ticker);
    setNewSector(item.sector || 'Equities');
    
    const matched = allStocks.find(s => s.ticker.toUpperCase() === ticker.toUpperCase());
    const price = matched ? matched.currentPrice : (item.currentPrice || 1000);
    setNewBuyPrice(price);
    setSearchResults([]);
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim() || newShares <= 0 || newBuyPrice <= 0) return;

    const cleanTicker = newTicker.trim().toUpperCase();
    const matched = allStocks.find(s => s.ticker.toUpperCase() === cleanTicker);
    const livePrice = matched ? matched.currentPrice : newBuyPrice;
    const company = newCompanyName || matched?.name || cleanTicker;
    const sector = newSector || matched?.sector || 'Diversified';

    const existingIndex = userProfile.holdings.findIndex(h => h.ticker.toUpperCase() === cleanTicker);
    let updatedHoldings: PortfolioHolding[];

    if (existingIndex >= 0) {
      const existing = userProfile.holdings[existingIndex];
      const combinedShares = existing.shares + newShares;
      const combinedAvg = ((existing.shares * existing.averageBuyPrice) + (newShares * newBuyPrice)) / combinedShares;
      const unrealizedPnl = (livePrice - combinedAvg) * combinedShares;
      const unrealizedPnlPct = (unrealizedPnl / (combinedAvg * combinedShares)) * 100;

      updatedHoldings = [...userProfile.holdings];
      updatedHoldings[existingIndex] = {
        ...existing,
        shares: combinedShares,
        averageBuyPrice: Number(combinedAvg.toFixed(2)),
        currentPrice: livePrice,
        unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
        unrealizedPnlPct: Number(unrealizedPnlPct.toFixed(2))
      };
    } else {
      const unrealizedPnl = (livePrice - newBuyPrice) * newShares;
      const unrealizedPnlPct = newBuyPrice > 0 ? (unrealizedPnl / (newBuyPrice * newShares)) * 100 : 0;

      const newHolding: PortfolioHolding = {
        ticker: cleanTicker,
        companyName: company,
        shares: newShares,
        averageBuyPrice: newBuyPrice,
        currentPrice: livePrice,
        sector: sector,
        unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
        unrealizedPnlPct: Number(unrealizedPnlPct.toFixed(2))
      };
      updatedHoldings = [newHolding, ...userProfile.holdings];
    }

    onUpdateHoldings(updatedHoldings);
    setNewTicker('');
    setNewCompanyName('');
    setNewShares(50);
    setNewBuyPrice(0);
    setIsAddingStock(false);
  };

  const handleStartEdit = (holding: PortfolioHolding) => {
    setEditingTicker(holding.ticker);
    setEditShares(holding.shares);
    setEditAvgPrice(holding.averageBuyPrice);
  };

  const handleSaveEdit = (ticker: string) => {
    if (editShares <= 0 || editAvgPrice <= 0) return;
    
    const updated = userProfile.holdings.map(h => {
      if (h.ticker === ticker) {
        const unrealizedPnl = (h.currentPrice - editAvgPrice) * editShares;
        const unrealizedPnlPct = (unrealizedPnl / (editAvgPrice * editShares)) * 100;
        return {
          ...h,
          shares: editShares,
          averageBuyPrice: editAvgPrice,
          unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
          unrealizedPnlPct: Number(unrealizedPnlPct.toFixed(2))
        };
      }
      return h;
    });

    onUpdateHoldings(updated);
    setEditingTicker(null);
  };

  const handleDeleteHolding = (ticker: string) => {
    const updated = userProfile.holdings.filter(h => h.ticker !== ticker);
    onUpdateHoldings(updated);
  };

  const handleApplyPreset = (preset: typeof PRESET_PORTFOLIOS[0]) => {
    onUpdateHoldings(preset.holdings, preset.cash);
  };

  const handleSaveCash = () => {
    onUpdateHoldings(userProfile.holdings, customCash);
    setIsEditingCash(false);
  };

  const handleSaveInlineTitle = () => {
    if (inlineTitleValue.trim()) {
      if (onUpdateProfile) {
        onUpdateProfile({ name: inlineTitleValue.trim() });
      }
    }
    setIsEditingTitleInline(false);
  };

  const handleSaveProfileModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profileFormName.trim() || 'My Investment Portfolio',
        experienceLevel: profileFormExperience,
        riskProfile: profileFormRisk
      });
    }
    if (onChangeRiskProfile && profileFormRisk !== riskProfile) {
      onChangeRiskProfile(profileFormRisk);
    }
    setIsProfileModalOpen(false);
  };

  const handleProcessBulkImport = () => {
    setBulkError(null);
    if (!bulkText.trim()) {
      setBulkError('Please enter at least one stock holding line.');
      return;
    }

    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedHoldings: PortfolioHolding[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const cleaned = line.replace(/[:@,]/g, ' ').replace(/\s+/g, ' ').trim();
      const parts = cleaned.split(' ');
      
      if (parts.length < 2) {
        setBulkError(`Line ${i + 1} ("${line}") is missing quantity or price.`);
        return;
      }

      const ticker = parts[0].toUpperCase();
      const shares = parseInt(parts[1], 10);
      const buyPrice = parts.length >= 3 ? parseFloat(parts[2]) : 0;

      if (!ticker || isNaN(shares) || shares <= 0) {
        setBulkError(`Invalid ticker or shares on line ${i + 1}: "${line}"`);
        return;
      }

      const matched = allStocks.find(s => s.ticker.toUpperCase() === ticker);
      const livePrice = matched ? matched.currentPrice : (buyPrice > 0 ? buyPrice : 1000);
      const finalBuyPrice = buyPrice > 0 ? buyPrice : livePrice;
      const company = matched ? matched.name : ticker;
      const sector = matched ? matched.sector : 'Diversified';

      const unrealizedPnl = (livePrice - finalBuyPrice) * shares;
      const unrealizedPnlPct = finalBuyPrice > 0 ? (unrealizedPnl / (finalBuyPrice * shares)) * 100 : 0;

      parsedHoldings.push({
        ticker,
        companyName: company,
        shares,
        averageBuyPrice: Number(finalBuyPrice.toFixed(2)),
        currentPrice: livePrice,
        sector,
        unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
        unrealizedPnlPct: Number(unrealizedPnlPct.toFixed(2))
      });
    }

    onUpdateHoldings(parsedHoldings);
    setIsBulkImportOpen(false);
    setBulkText('');
  };

  const handleCopyToClipboard = () => {
    const textData = userProfile.holdings.map(h => `${h.ticker}, ${h.shares}, ${h.averageBuyPrice}`).join('\n');
    navigator.clipboard.writeText(textData);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="bg-[#0A0A0E] rounded-2xl p-6 sm:p-7 border border-white/10 relative overflow-hidden transition-all duration-200">
      
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Retail Investor Portfolio & Guardrails
            </span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded bg-white/5 text-neutral-300 border border-white/10">
              {userProfile.holdings.length} Monitored
            </span>
          </div>

          {/* Editable Title */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {isEditingTitleInline ? (
              <div className="flex items-center gap-2 py-1">
                <input
                  type="text"
                  value={inlineTitleValue}
                  onChange={(e) => setInlineTitleValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveInlineTitle();
                    if (e.key === 'Escape') setIsEditingTitleInline(false);
                  }}
                  autoFocus
                  placeholder="Enter portfolio title..."
                  className="px-3 py-1 bg-[#121218] border border-white/20 rounded-lg text-lg font-bold text-white focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSaveInlineTitle}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInlineTitleValue(userProfile.name);
                    setIsEditingTitleInline(false);
                  }}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h3 
                  onClick={() => {
                    setInlineTitleValue(userProfile.name);
                    setIsEditingTitleInline(true);
                  }}
                  className="text-xl sm:text-2xl font-bold text-white cursor-pointer hover:text-neutral-300 transition-colors flex items-center gap-2"
                >
                  <span>{userProfile.name}</span>
                  <Edit3 className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                </h3>
              </div>
            )}

            <button
              onClick={() => {
                setProfileFormName(userProfile.name);
                setProfileFormExperience(userProfile.experienceLevel);
                setProfileFormRisk(riskProfile);
                setIsProfileModalOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-[#121218] hover:bg-[#1A1A24] rounded-md border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-neutral-400" />
              <span>Investor Profile</span>
            </button>
          </div>

          <p className="text-xs text-neutral-400 mt-1">
            Input holdings or select presets. The 3 AI Detectives evaluate risk allocations in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => setIsBulkImportOpen(!isBulkImportOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1A1A24] text-neutral-200 font-medium text-xs border border-white/10 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-400" />
            <span>Paste / CSV</span>
          </button>

          <button
            onClick={() => setIsAddingStock(!isAddingStock)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#121218] hover:bg-[#1A1A24] text-neutral-200 font-medium text-xs border border-white/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingStock ? 'Close Form' : 'Add Holding'}</span>
          </button>

          <button
            id="audit-portfolio-btn"
            onClick={onAuditPortfolio}
            disabled={isAuditingPortfolio || userProfile.holdings.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-40 text-black font-semibold text-xs transition-all"
          >
            <Play className={`w-3 h-3 fill-current ${isAuditingPortfolio ? 'animate-spin' : ''}`} />
            <span>{isAuditingPortfolio ? '3 Detectives Auditing...' : 'Audit Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Preset Portfolios Quick-Bar */}
      <div className="flex items-center flex-wrap gap-2 py-3.5 border-b border-white/10 text-xs">
        <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Starter Portfolios:
        </span>
        {PRESET_PORTFOLIOS.map(preset => (
          <button
            key={preset.name}
            onClick={() => handleApplyPreset(preset)}
            className="px-2.5 py-1 rounded-md bg-[#121218] hover:bg-[#1A1A24] text-neutral-300 hover:text-white border border-white/5 font-mono text-[11px] transition-all"
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}

        <div className="flex items-center gap-2 ml-auto">
          {userProfile.holdings.length > 0 && (
            <>
              <button
                onClick={handleCopyToClipboard}
                className="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white bg-[#121218] hover:bg-[#1A1A24] border border-white/5 font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                {copiedNotification ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Clear all stocks to start with a blank portfolio?')) {
                    onUpdateHoldings([]);
                  }
                }}
                className="px-2.5 py-1 rounded-md text-rose-400 hover:bg-rose-950/30 font-mono text-[11px] transition-colors"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bulk CSV / Text Importer Drawer */}
      {isBulkImportOpen && (
        <div className="mt-5 p-5 bg-[#0E0E14] rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Quick Import / Paste Stock Holdings
            </h4>
            <button
              onClick={() => setIsBulkImportOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            Format: <span className="text-cyan-300 font-mono">TICKER, SHARES, BUY_PRICE</span> (e.g. <span className="text-neutral-300 font-mono">TATAMOTORS, 150, 940</span>).
          </p>

          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`TATAMOTORS, 150, 940.00\nHDFCBANK, 70, 1520.00\nINFY, 100, 1640.00`}
            rows={4}
            className="w-full p-3 font-mono text-xs bg-[#08080C] rounded-lg border border-white/10 text-white focus:outline-hidden focus:border-white/30"
          />

          {bulkError && (
            <div className="mt-2 text-xs text-rose-400 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => setIsBulkImportOpen(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProcessBulkImport}
              className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs"
            >
              Import Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Add Stock Holding Inline Card */}
      {isAddingStock && (
        <form onSubmit={handleAddHolding} className="mt-5 p-5 bg-[#0E0E14] rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Add Stock to Monitored Portfolio
            </h4>
            <span className="text-[11px] font-mono text-neutral-400">
              Live NSE/BSE Market Feed Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
            <div className="relative sm:col-span-2">
              <label className="block text-[10px] font-medium text-neutral-400 uppercase mb-1">
                Stock Ticker / Company
              </label>
              <input
                type="text"
                value={newTicker}
                onChange={(e) => handleTickerSearch(e.target.value)}
                placeholder="e.g. TCS, RELIANCE, INFY, TATAMOTORS..."
                required
                className="w-full px-3 py-2 bg-[#08080C] rounded-lg border border-white/10 text-xs font-mono font-semibold text-white focus:outline-hidden focus:border-white/30 uppercase"
              />

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#121218] rounded-lg border border-white/10 py-1.5 z-40 max-h-48 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full px-3 py-1.5 text-left hover:bg-white/5 flex items-center justify-between text-xs font-mono transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-white">{item.cleanTicker || item.symbol}</span>
                        <span className="text-[10px] text-neutral-400 ml-2 truncate max-w-[160px] inline-block">{item.name}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">
                        {item.exchange || 'NSE'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-medium text-neutral-400 uppercase mb-1">
                Quantity (Shares)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={newShares || ''}
                onChange={(e) => setNewShares(parseInt(e.target.value) || 0)}
                placeholder="e.g. 50"
                required
                className="w-full px-3 py-2 bg-[#08080C] rounded-lg border border-white/10 text-xs font-mono text-white focus:outline-hidden focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-neutral-400 uppercase mb-1">
                Avg Buy Price (₹)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.05"
                value={newBuyPrice || ''}
                onChange={(e) => setNewBuyPrice(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 950.00"
                required
                className="w-full px-3 py-2 bg-[#08080C] rounded-lg border border-white/10 text-xs font-mono text-white focus:outline-hidden focus:border-white/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => setIsAddingStock(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold text-xs"
            >
              Add Holding
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
        
        {/* Total Value */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Value</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ₹{currentTotalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          
          <div className="text-xs font-mono text-neutral-400 mt-2 flex items-center gap-2">
            {isEditingCash ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span>Cash: ₹</span>
                <input
                  type="number"
                  value={customCash}
                  onChange={(e) => setCustomCash(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-0.5 bg-[#08080C] border border-white/20 rounded text-xs font-mono text-white"
                />
                <button
                  type="button"
                  onClick={handleSaveCash}
                  className="p-0.5 text-emerald-400 hover:bg-white/5 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCash(false)}
                  className="p-0.5 text-neutral-400 hover:bg-white/5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Free Cash: ₹{userProfile.cashBalance.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => {
                    setCustomCash(userProfile.cashBalance);
                    setIsEditingCash(true);
                  }}
                  className="text-cyan-400 hover:underline font-medium"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Unrealized P&L</span>
            {totalUnrealizedPnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div
            className={`text-2xl font-bold font-mono mt-1 flex items-baseline gap-2 flex-wrap ${
              totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}</span>
            <span className={`text-xs px-2 py-0.2 rounded font-semibold ${
              totalUnrealizedPnl >= 0 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {totalUnrealizedPnlPct >= 0 ? '+' : ''}{totalUnrealizedPnlPct.toFixed(2)}%
            </span>
          </div>
          <div className="text-xs font-mono text-neutral-500 mt-2">
            Invested Base: ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Portfolio Risk Score */}
        <div className="bg-[#0E0E14] rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase">
            <span>Risk Index</span>
            <span className="font-mono text-sm font-bold text-white">{calculatedRiskScore}/100</span>
          </div>
          <div className="w-full bg-[#181822] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                calculatedRiskScore < 45 ? 'bg-emerald-400' : calculatedRiskScore < 70 ? 'bg-amber-400' : 'bg-rose-400'
              }`} 
              style={{ width: `${calculatedRiskScore}%` }} 
            />
          </div>
          <div className="text-xs text-neutral-300 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              {calculatedRiskScore < 40 ? 'Well-diversified structure' :
               calculatedRiskScore < 65 ? 'Moderate concentration exposure' :
               'High concentration: Rebalancing advised'}
            </span>
          </div>
        </div>

      </div>

      {/* Holdings Table */}
      {userProfile.holdings.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl p-6">
          <Briefcase className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <h4 className="font-semibold text-sm text-neutral-300">No Holdings Input Yet</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Click "Add Holding" or select a Starter Portfolio above to begin.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 pl-2">Asset</th>
                <th className="pb-2.5">Shares</th>
                <th className="pb-2.5">Avg Buy</th>
                <th className="pb-2.5">Live LTP</th>
                <th className="pb-2.5">Total Value</th>
                <th className="pb-2.5">Gain / Loss</th>
                <th className="pb-2.5 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {userProfile.holdings.map((h) => {
                const isEditing = editingTicker === h.ticker;
                const isProfit = h.unrealizedPnl >= 0;
                const totalVal = h.shares * h.currentPrice;

                return (
                  <tr key={h.ticker} className="hover:bg-white/5 transition-colors">
                    
                    <td className="py-3 pl-2">
                      <div className="font-semibold text-white flex items-center gap-1.5 font-sans">
                        <span>{h.companyName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/5 text-neutral-400 rounded border border-white/10">
                          {h.ticker}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 font-sans">{h.sector}</div>
                    </td>

                    <td className="py-3 font-medium text-neutral-200">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          value={editShares}
                          onChange={(e) => setEditShares(parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-0.5 bg-[#08080C] border border-white/20 rounded font-medium text-xs text-white"
                        />
                      ) : (
                        h.shares
                      )}
                    </td>

                    <td className="py-3 text-neutral-400">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={editAvgPrice}
                          onChange={(e) => setEditAvgPrice(parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-0.5 bg-[#08080C] border border-white/20 rounded font-medium text-xs text-white"
                        />
                      ) : (
                        `₹${h.averageBuyPrice.toFixed(2)}`
                      )}
                    </td>

                    <td className="py-3 font-medium text-white">
                      ₹{h.currentPrice.toFixed(2)}
                    </td>

                    <td className="py-3 font-medium text-white">
                      ₹{totalVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3">
                      <span className={`font-medium ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfit ? '+' : ''}₹{h.unrealizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{h.unrealizedPnlPct.toFixed(2)}%)
                      </span>
                    </td>

                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(h.ticker)}
                              className="p-1 text-emerald-400 hover:bg-white/5 rounded"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTicker(null)}
                              className="p-1 text-neutral-400 hover:bg-white/5 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(h)}
                              className="p-1 text-neutral-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHolding(h.ticker)}
                              className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-white/5 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectStock(h.ticker)}
                              className="px-2.5 py-0.5 bg-[#14141C] hover:bg-[#1C1C26] text-neutral-200 font-medium rounded transition-colors inline-flex items-center gap-1 text-[11px] border border-white/10"
                            >
                              Audit
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Investor Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#0E0E14] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Customize Profile</h3>
                  <p className="text-xs text-neutral-400">Personalize risk engine model</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-400 uppercase mb-1">
                  Portfolio / Investor Name
                </label>
                <input
                  type="text"
                  value={profileFormName}
                  onChange={(e) => setProfileFormName(e.target.value)}
                  placeholder="e.g. My Portfolio, Alpha Wealth..."
                  className="w-full px-3 py-2 rounded-lg bg-[#08080C] border border-white/10 text-white font-medium focus:outline-hidden focus:border-white/30"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-400 uppercase mb-1">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'expert'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setProfileFormExperience(lvl)}
                      className={`py-1.5 px-2 text-center rounded-lg font-medium capitalize transition-all ${
                        profileFormExperience === lvl
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#14141C] text-neutral-300 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-400 uppercase mb-1">
                  Risk Profile (Boss AI Model)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['conservative', 'moderate', 'aggressive'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setProfileFormRisk(r)}
                      className={`py-1.5 px-2 text-center rounded-lg font-medium capitalize transition-all ${
                        profileFormRisk === r
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#14141C] text-neutral-300 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-white text-black rounded-lg font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
