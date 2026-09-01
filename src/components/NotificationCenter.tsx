import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  ShieldCheck, 
  Zap, 
  Newspaper, 
  AlertTriangle, 
  ArrowRight, 
  Settings2, 
  Sliders, 
  Plus, 
  Trash2, 
  Flame, 
  Activity,
  Sparkles
} from 'lucide-react';
import { NotificationItem, AlertPreferences, CustomAlertRule, StockData } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectStock: (ticker: string) => void;
  alertPreferences: AlertPreferences;
  onUpdatePreferences: (prefs: AlertPreferences) => void;
  customAlerts: CustomAlertRule[];
  onAddCustomAlert: (rule: Omit<CustomAlertRule, 'id' | 'createdDate'>) => void;
  onDeleteCustomAlert: (id: string) => void;
  onTriggerTestAlert: () => void;
  stocks: StockData[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectStock,
  alertPreferences,
  onUpdatePreferences,
  customAlerts,
  onAddCustomAlert,
  onDeleteCustomAlert,
  onTriggerTestAlert,
  stocks
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'preferences' | 'custom_rules'>('feed');

  // New Custom Alert Form State
  const [newTicker, setNewTicker] = useState(stocks[0]?.ticker || 'TATAMOTORS');
  const [newCondition, setNewCondition] = useState<CustomAlertRule['condition']>('PRICE_ABOVE');
  const [newTargetValue, setNewTargetValue] = useState<number>(950);

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'FILING_ALERT':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'SIGNAL_BREAKOUT':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'SENTIMENT_SPIKE':
        return <Newspaper className="w-4 h-4 text-violet-400" />;
      case 'GOOGLE_TREND_SPIKE':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'CUSTOM_ALERT':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'SYSTEM_DEGRADED':
      case 'PORTFOLIO_ALERT':
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetValue || newTargetValue <= 0) return;
    onAddCustomAlert({
      ticker: newTicker,
      condition: newCondition,
      targetValue: Number(newTargetValue),
      active: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/85">
      <div className="bg-[#0A0A0E] w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[88vh] mt-10 sm:mt-12">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#08080C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Notification Center
              </h3>
              <p className="text-[11px] text-neutral-400">
                AI Agent triggers & real-time telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'feed' && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-medium text-neutral-300 hover:text-white transition-colors px-2.5 py-1 rounded-md bg-[#14141C] hover:bg-[#1C1C26] border border-white/10"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#08080C] p-1 border-b border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all text-center ${
              activeTab === 'feed' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Feed ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'preferences' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('custom_rules')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'custom_rules' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings2 className="w-3 h-3" />
            <span>Rules ({customAlerts.length})</span>
          </button>
        </div>

        {/* Tab 1: Live Feed */}
        {activeTab === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {/* Quick Test Alert Simulation */}
            <div className="p-3 rounded-xl bg-[#0E0E14] border border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs text-neutral-300 font-medium">
                  Test AI alert dispatcher
                </span>
              </div>
              <button
                onClick={onTriggerTestAlert}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-white text-black hover:bg-neutral-200 transition-all shrink-0"
              >
                Trigger
              </button>
            </div>

            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl transition-all border ${
                    notif.read 
                      ? 'opacity-60 bg-[#0E0E14] border-white/5' 
                      : 'bg-[#121218] border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#08080C] border border-white/10 mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-white truncate">{notif.title}</h4>
                        <span className="text-[10px] text-neutral-500 font-mono shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.ticker && (
                        <button
                          onClick={() => {
                            onSelectStock(notif.ticker!);
                            onClose();
                          }}
                          className="mt-1.5 text-[11px] font-medium text-cyan-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
                        >
                          <span>Analyze {notif.ticker}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                No active notifications.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Alert Preferences */}
        {activeTab === 'preferences' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            <div className="text-neutral-400">
              Configure conditions and AI detective alerts:
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#0E0E14] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Significant Price Volatility</div>
                  <div className="text-[11px] text-neutral-400">
                    Triggers when stock moves {alertPreferences.priceThresholdPct}% in a session
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.priceVolatility}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, priceVolatility: e.target.checked })}
                  className="w-4 h-4 rounded focus:ring-0 accent-white"
                />
              </div>

              {alertPreferences.priceVolatility && (
                <div className="px-3 pb-1">
                  <div className="flex justify-between text-[11px] text-neutral-400 font-medium mb-1">
                    <span>Threshold:</span>
                    <span className="text-cyan-300 font-mono">±{alertPreferences.priceThresholdPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={alertPreferences.priceThresholdPct}
                    onChange={(e) => onUpdatePreferences({ ...alertPreferences, priceThresholdPct: Number(e.target.value) })}
                    className="w-full h-1.5 bg-[#181822] rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#0E0E14] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Technical Shifts & Breakouts</div>
                  <div className="text-[11px] text-neutral-400">
                    200-EMA crossovers, RSI alerts, MACD triggers
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.trendReversals}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, trendReversals: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0E0E14] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">SEBI Regulatory Disclosures</div>
                  <div className="text-[11px] text-neutral-400">
                    Filings, promoter pledge updates, auditor notes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.sebiFilings}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, sebiFilings: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0E0E14] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Google Trends Search Spikes</div>
                  <div className="text-[11px] text-neutral-400">
                    Triggers when search score exceeds {alertPreferences.googleTrendsThreshold}/100
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.googleTrendsSurges}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, googleTrendsSurges: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Alert Rules */}
        {activeTab === 'custom_rules' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            <form onSubmit={handleCreateRule} className="p-3.5 rounded-xl bg-[#0E0E14] border border-white/10">
              <h4 className="font-semibold text-white mb-2.5 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Add Custom Price / Indicator Trigger
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-[10px] font-medium text-neutral-400 uppercase">Stock</label>
                  <select
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-[#08080C] border border-white/10 text-white font-mono text-xs"
                  >
                    {stocks.map((s) => (
                      <option key={s.ticker} value={s.ticker}>{s.ticker}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-neutral-400 uppercase">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-lg bg-[#08080C] border border-white/10 text-white font-medium text-xs"
                  >
                    <option value="PRICE_ABOVE">Price Above (₹)</option>
                    <option value="PRICE_BELOW">Price Below (₹)</option>
                    <option value="RSI_ABOVE">RSI Above</option>
                    <option value="RSI_BELOW">RSI Below</option>
                    <option value="TREND_SPIKE">Trend Score Above</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-neutral-400 uppercase">Target</label>
                  <input
                    type="number"
                    value={newTargetValue}
                    onChange={(e) => setNewTargetValue(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg bg-[#08080C] border border-white/10 font-mono text-white text-xs"
                    placeholder="e.g. 950"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-white text-black font-semibold text-xs transition-all"
              >
                Save Alert Rule
              </button>
            </form>

            <div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">
                Active Conditions ({customAlerts.length})
              </div>

              <div className="space-y-1.5">
                {customAlerts.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-lg bg-[#0E0E14] border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs font-mono">{rule.ticker}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-300">
                          {rule.condition.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                        Target: <strong className="text-white">{rule.targetValue}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteCustomAlert(rule.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-white/5 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
