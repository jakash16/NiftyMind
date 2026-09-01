import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  ShieldCheck, 
  Zap, 
  Newspaper, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  Settings2, 
  Sliders, 
  Plus, 
  Trash2, 
  Radio, 
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
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'SIGNAL_BREAKOUT':
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case 'SENTIMENT_SPIKE':
        return <Newspaper className="w-4 h-4 text-purple-600" />;
      case 'GOOGLE_TREND_SPIKE':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'CUSTOM_ALERT':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'SYSTEM_DEGRADED':
      case 'PORTFOLIO_ALERT':
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
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
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] mt-10 sm:mt-12">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Market Notification Center
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Automated AI Agent alerts & condition triggers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'feed' && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-2.5 py-1 rounded-full hover:bg-indigo-50"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'feed' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Feed ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'preferences' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3 h-3 text-indigo-600" />
            <span>Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('custom_rules')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'custom_rules' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings2 className="w-3 h-3 text-indigo-600" />
            <span>Custom Rules ({customAlerts.length})</span>
          </button>
        </div>

        {/* Tab 1: Live Feed */}
        {activeTab === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
            {/* Quick Test Alert Simulation Trigger */}
            <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs text-indigo-900 font-semibold">
                  Test the real-time AI alert dispatcher
                </span>
              </div>
              <button
                onClick={onTriggerTestAlert}
                className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-all shrink-0"
              >
                Trigger Live Alert
              </button>
            </div>

            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`pt-2.5 first:pt-0 p-3 rounded-2xl transition-all ${
                    notif.read ? 'opacity-75 bg-white' : 'bg-indigo-50/40 border border-indigo-100/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-full bg-white border border-slate-200 shadow-2xs mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.ticker && (
                        <button
                          onClick={() => {
                            onSelectStock(notif.ticker!);
                            onClose();
                          }}
                          className="mt-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
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
              <div className="p-8 text-center text-xs text-slate-400">
                No active notifications.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Custom Alert Preferences */}
        {activeTab === 'preferences' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="text-xs text-slate-500 font-medium">
              Configure which market conditions and AI detective discoveries trigger in-app notifications:
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              
              {/* Price Volatility */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Significant Price Volatility</div>
                  <div className="text-[11px] text-slate-500">
                    Triggers when stock moves {alertPreferences.priceThresholdPct}% in a single session
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.priceVolatility}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, priceVolatility: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>

              {/* Price Threshold Slider */}
              {alertPreferences.priceVolatility && (
                <div className="pl-3 pr-3 pb-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-bold mb-1">
                    <span>Trigger Threshold:</span>
                    <span className="text-indigo-600 font-mono">±{alertPreferences.priceThresholdPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={alertPreferences.priceThresholdPct}
                    onChange={(e) => onUpdatePreferences({ ...alertPreferences, priceThresholdPct: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}

              {/* Technical Trend Reversals (Chart Detective) */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Technical Trend Shifts & Breakouts</div>
                  <div className="text-[11px] text-slate-500">
                    200-EMA crossovers, RSI exhaustion warnings, MACD divergences
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.trendReversals}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, trendReversals: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>

              {/* SEBI Filings (Rulebook Detective) */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">SEBI Regulatory & Audit Disclosures</div>
                  <div className="text-[11px] text-slate-500">
                    New filings, promoter pledge changes, and auditor note updates
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.sebiFilings}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, sebiFilings: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>

              {/* Google Trends Surges */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Google Trends Search Spikes</div>
                  <div className="text-[11px] text-slate-500">
                    Triggers when search score exceeds {alertPreferences.googleTrendsThreshold}/100
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.googleTrendsSurges}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, googleTrendsSurges: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>

              {/* In-app Toast Banners */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">In-App Floating Toast Banners</div>
                  <div className="text-[11px] text-slate-500">
                    Display realtime alerts on the screen top-right corner
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertPreferences.toastNotifications}
                  onChange={(e) => onUpdatePreferences({ ...alertPreferences, toastNotifications: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Custom Alert Rules Builder */}
        {activeTab === 'custom_rules' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* Create Rule Form */}
            <form onSubmit={handleCreateRule} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                Add Custom Price / Indicator Trigger
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                {/* Stock Ticker Select */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Stock</label>
                  <select
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs"
                  >
                    {stocks.map((s) => (
                      <option key={s.ticker} value={s.ticker}>{s.ticker}</option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs"
                  >
                    <option value="PRICE_ABOVE">Price Above (₹)</option>
                    <option value="PRICE_BELOW">Price Below (₹)</option>
                    <option value="RSI_ABOVE">RSI Above</option>
                    <option value="RSI_BELOW">RSI Below</option>
                    <option value="TREND_SPIKE">Trend Score Above</option>
                  </select>
                </div>

                {/* Target Value */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target Value</label>
                  <input
                    type="number"
                    value={newTargetValue}
                    onChange={(e) => setNewTargetValue(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 text-xs"
                    placeholder="e.g. 950"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-2xs"
              >
                Save Alert Rule
              </button>
            </form>

            {/* Active Rules List */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Active Custom Conditions ({customAlerts.length})
              </div>

              <div className="space-y-2">
                {customAlerts.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-indigo-700 text-xs">{rule.ticker}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {rule.condition.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Target: <strong className="font-mono text-slate-900">{rule.targetValue}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteCustomAlert(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="Delete rule"
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
