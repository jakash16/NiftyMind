import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, TrendingDown, Plus, Play, CheckCircle2, 
  ArrowUpRight, Trash2, Edit3, Check, X, Search, Sparkles, RefreshCw,
  Layers, PieChart, ShieldAlert, DollarSign, ChevronDown, User,
  FileSpreadsheet, Upload, Download, Copy, Settings, CheckCheck,
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
  const [isSearching, setIsSearching] = useState(false);

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

  // Dynamic portfolio concentration score (0-100)
  const maxHoldingWeight = currentTotalValue > 0 
    ? Math.max(...userProfile.holdings.map(h => (h.currentPrice * h.shares) / currentTotalValue))
    : 0;
  
  const calculatedRiskScore = userProfile.holdings.length === 0 
    ? 10 
    : Math.min(95, Math.max(15, Math.round((maxHoldingWeight * 50) + (userProfile.holdings.length < 3 ? 25 : 10))));

  // Handle ticker search for addition
  const handleTickerSearch = async (query: string) => {
    setNewTicker(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Check locally in allStocks first
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

    setIsSearching(true);
    try {
      const liveResults = await searchLiveSymbols(query);
      setSearchResults(liveResults);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
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
      // Update existing
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
      // Add new
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

  // Inline Title Save
  const handleSaveInlineTitle = () => {
    if (inlineTitleValue.trim()) {
      if (onUpdateProfile) {
        onUpdateProfile({ name: inlineTitleValue.trim() });
      }
    }
    setIsEditingTitleInline(false);
  };

  // Profile modal save
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

  // Bulk CSV / Text Importer
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
      // Format examples: "TATAMOTORS, 100, 940" or "TATAMOTORS 100 940" or "TATAMOTORS: 100 @ 940"
      const cleaned = line.replace(/[:@,]/g, ' ').replace(/\s+/g, ' ').trim();
      const parts = cleaned.split(' ');
      
      if (parts.length < 2) {
        setBulkError(`Line ${i + 1} ("${line}") is missing quantity or price. Format: TICKER, SHARES, BUY_PRICE`);
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

  // Export / Copy to Clipboard
  const handleCopyToClipboard = () => {
    const textData = userProfile.holdings.map(h => `${h.ticker}, ${h.shares}, ${h.averageBuyPrice}`).join('\n');
    navigator.clipboard.writeText(textData);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs mb-8 transition-all relative">
      
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Retail Investor Portfolio & Guardrails
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {userProfile.holdings.length} Holdings Monitored
            </span>
          </div>

          {/* Editable Portfolio / Investor Name */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {isEditingTitleInline ? (
              <div className="flex items-center gap-1.5 py-1">
                <input
                  type="text"
                  value={inlineTitleValue}
                  onChange={(e) => setInlineTitleValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveInlineTitle();
                    if (e.key === 'Escape') setIsEditingTitleInline(false);
                  }}
                  autoFocus
                  placeholder="Enter your name or portfolio title..."
                  className="px-3 py-1 bg-white border-2 border-indigo-500 rounded-xl text-lg sm:text-xl font-black text-slate-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleSaveInlineTitle}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  title="Save Name"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInlineTitleValue(userProfile.name);
                    setIsEditingTitleInline(false);
                  }}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  title="Cancel"
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
                  className="text-xl sm:text-2xl font-black text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2"
                  title="Click to rename portfolio"
                >
                  <span>{userProfile.name}</span>
                  <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 opacity-60 group-hover:opacity-100 transition-all" />
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
              className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-full border border-slate-200 transition-colors flex items-center gap-1"
              title="Edit investor name, risk level and experience settings"
            >
              <Settings className="w-3 h-3" />
              <span>Edit Investor Profile</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Input your own stocks or customize holdings below. The 3 AI Detectives will audit your allocations in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5 self-start lg:self-auto">
          {/* Quick Bulk Import */}
          <button
            onClick={() => setIsBulkImportOpen(!isBulkImportOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all shadow-2xs"
            title="Import stocks via text / CSV paste"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>Paste / Import CSV</span>
          </button>

          {/* Add Stock Button */}
          <button
            onClick={() => setIsAddingStock(!isAddingStock)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingStock ? 'Close Form' : 'Add Stock / Holding'}</span>
          </button>

          {/* Run Portfolio Multi-Agent Audit Button */}
          <button
            id="audit-portfolio-btn"
            onClick={onAuditPortfolio}
            disabled={isAuditingPortfolio || userProfile.holdings.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-slate-200 transition-all"
            title="Launch 3-agent deep portfolio audit"
          >
            <Play className={`w-3.5 h-3.5 fill-current text-indigo-400 ${isAuditingPortfolio ? 'animate-spin' : ''}`} />
            <span>{isAuditingPortfolio ? '3 Detectives Auditing...' : 'Run Portfolio Multi-Agent Audit'}</span>
          </button>
        </div>
      </div>

      {/* Preset Portfolios Quick-Bar & Actions */}
      <div className="flex items-center flex-wrap gap-2 py-3 border-b border-slate-100 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Starter Portfolios:
        </span>
        {PRESET_PORTFOLIOS.map(preset => (
          <button
            key={preset.name}
            onClick={() => handleApplyPreset(preset)}
            className="px-3 py-1 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 font-semibold text-[11px] transition-colors"
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
                className="px-2.5 py-1 rounded-full text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-medium text-[11px] transition-colors flex items-center gap-1"
                title="Copy holdings as text"
              >
                {copiedNotification ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Clear all stocks to start with a blank portfolio?')) {
                    onUpdateHoldings([]);
                  }
                }}
                className="px-2.5 py-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-medium text-[11px] transition-colors"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bulk CSV / Text Importer Drawer */}
      {isBulkImportOpen && (
        <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              Quick Import / Paste Your Stock Holdings
            </h4>
            <button
              onClick={() => setIsBulkImportOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Paste one holding per line in the format: <span className="font-mono font-bold text-slate-700">TICKER, SHARES, BUY_PRICE</span> (e.g. <span className="font-mono text-indigo-600">RELIANCE, 50, 2900</span>).
          </p>

          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`TATAMOTORS, 100, 940.00\nHDFCBANK, 50, 1610.00\nINFY, 80, 1640.00\nZOMATO, 200, 260.00`}
            rows={4}
            className="w-full p-3 font-mono text-xs bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          {bulkError && (
            <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setIsBulkImportOpen(false)}
              className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProcessBulkImport}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              Import Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Add Stock Holding Inline Card / Form */}
      {isAddingStock && (
        <form onSubmit={handleAddHolding} className="mt-5 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-200 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Add Stock to Your Monitored Portfolio
            </h4>
            <span className="text-[11px] text-indigo-700 font-medium">
              Real-time NSE/BSE Market Feed Lookup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
            {/* Ticker Search */}
            <div className="relative sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Stock Ticker / Company
              </label>
              <input
                type="text"
                value={newTicker}
                onChange={(e) => handleTickerSearch(e.target.value)}
                placeholder="e.g. TCS, RELIANCE, INFY, ITC, SBIN..."
                required
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 uppercase"
              />

              {/* Autocomplete Search Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 max-h-48 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full px-3 py-2 text-left hover:bg-indigo-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{item.cleanTicker || item.symbol}</span>
                        <span className="text-[10px] text-slate-500 ml-1.5 truncate max-w-[160px] inline-block">{item.name}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-indigo-600">
                        {item.exchange || 'NSE'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shares Quantity */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Avg Buy Price */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsAddingStock(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              Add Holding to Portfolio
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        
        {/* Total Holdings Value */}
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Holdings Value</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            ₹{currentTotalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          
          {/* Cash Reserves with Inline Editor */}
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            {isEditingCash ? (
              <div className="flex items-center gap-1 mt-1">
                <span className="font-medium text-slate-600">Cash: ₹</span>
                <input
                  type="number"
                  value={customCash}
                  onChange={(e) => setCustomCash(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleSaveCash}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCash(false)}
                  className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span>Free Cash: ₹{userProfile.cashBalance.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => {
                    setCustomCash(userProfile.cashBalance);
                    setIsEditingCash(true);
                  }}
                  className="text-indigo-600 hover:underline text-[10px] font-bold"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Unrealized PnL */}
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Unrealized P&L</span>
            {totalUnrealizedPnl >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
          </div>
          <div
            className={`text-2xl font-black font-mono mt-1 flex items-baseline gap-2 flex-wrap ${
              totalUnrealizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <span>{totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              totalUnrealizedPnl >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {totalUnrealizedPnlPct >= 0 ? '+' : ''}{totalUnrealizedPnlPct.toFixed(2)}%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Invested Base: ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Portfolio Risk Score */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-850 uppercase">
            <span>Portfolio Risk Score</span>
            <span className="font-mono text-sm font-black">{calculatedRiskScore}/100</span>
          </div>
          <div className="w-full bg-emerald-200 h-2 rounded-full mt-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                calculatedRiskScore < 45 ? 'bg-emerald-600' : calculatedRiskScore < 70 ? 'bg-amber-500' : 'bg-rose-500'
              }`} 
              style={{ width: `${calculatedRiskScore}%` }} 
            />
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {calculatedRiskScore < 40 ? 'Well-diversified & structurally safe' :
               calculatedRiskScore < 65 ? 'Moderate concentration exposure' :
               'High concentration risk: Rebalancing advised'}
            </span>
          </div>
        </div>

      </div>

      {/* Holdings Table */}
      {userProfile.holdings.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-extrabold text-sm text-slate-700">No Holdings Input Yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Add Stock / Holding" or "Paste / Import CSV" above to enter your real stock holdings.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setIsAddingStock(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs shadow-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Stock</span>
            </button>
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs border border-slate-200 inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Paste Text List</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Asset / Ticker</th>
                <th className="pb-3">Shares</th>
                <th className="pb-3">Avg Buy Price</th>
                <th className="pb-3">Current Price</th>
                <th className="pb-3">Total Value</th>
                <th className="pb-3">Gain / Loss</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userProfile.holdings.map((h) => {
                const isEditing = editingTicker === h.ticker;
                const isProfit = h.unrealizedPnl >= 0;
                const totalVal = h.shares * h.currentPrice;

                return (
                  <tr key={h.ticker} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Ticker / Company */}
                    <td className="py-3.5 pl-2">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{h.companyName}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                          {h.ticker}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{h.sector}</div>
                    </td>

                    {/* Shares */}
                    <td className="py-3.5 font-mono font-bold text-slate-800">
                      {isEditing ? (
                        <input
                          type="number"
                          min="1"
                          value={editShares}
                          onChange={(e) => setEditShares(parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-xs"
                        />
                      ) : (
                        h.shares
                      )}
                    </td>

                    {/* Avg Buy Price */}
                    <td className="py-3.5 font-mono text-slate-700">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={editAvgPrice}
                          onChange={(e) => setEditAvgPrice(parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-white border border-indigo-300 rounded font-mono font-bold text-xs"
                        />
                      ) : (
                        `₹${h.averageBuyPrice.toFixed(2)}`
                      )}
                    </td>

                    {/* Current Live LTP */}
                    <td className="py-3.5 font-mono font-bold text-slate-900">
                      ₹{h.currentPrice.toFixed(2)}
                    </td>

                    {/* Total Value */}
                    <td className="py-3.5 font-mono font-bold text-slate-900">
                      ₹{totalVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Gain / Loss */}
                    <td className="py-3.5 font-mono">
                      <span className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isProfit ? '+' : ''}₹{h.unrealizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{h.unrealizedPnlPct.toFixed(2)}%)
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(h.ticker)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Save changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTicker(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(h)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit shares and buy price"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHolding(h.ticker)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remove holding"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectStock(h.ticker)}
                              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-full transition-colors inline-flex items-center gap-1 text-[11px] border border-indigo-200"
                              title="Audit this stock with the 3 detectives"
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

      {/* Investor Profile Settings Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Customize Investor Profile</h3>
                  <p className="text-xs text-slate-400">Personalize your identity and risk model</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Investor / Portfolio Name
                </label>
                <input
                  type="text"
                  value={profileFormName}
                  onChange={(e) => setProfileFormName(e.target.value)}
                  placeholder="e.g. My Portfolio, Sarah Connor, Alpha Wealth..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'expert'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setProfileFormExperience(lvl)}
                      className={`py-2 px-2 text-center rounded-xl font-bold capitalize transition-all ${
                        profileFormExperience === lvl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Risk Profile (Boss AI Model)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['conservative', 'moderate', 'aggressive'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setProfileFormRisk(r)}
                      className={`py-2 px-2 text-center rounded-xl font-bold capitalize transition-all ${
                        profileFormRisk === r
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
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
