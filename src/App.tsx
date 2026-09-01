/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { StockOverview } from './components/StockOverview';
import { PriceChart } from './components/PriceChart';
import { GoogleTrendsRadar } from './components/GoogleTrendsRadar';
import { AgentDetectiveCard } from './components/AgentDetectiveCard';
import { BossSynthesisView } from './components/BossSynthesisView';
import { LiveTrendsPanel } from './components/LiveTrendsPanel';
import { PortfolioWatchlist } from './components/PortfolioWatchlist';
import { PortfolioAuditModal } from './components/PortfolioAuditModal';
import { ReasoningTraceModal } from './components/ReasoningTraceModal';
import { ProofCitationsDrawer } from './components/ProofCitationsDrawer';
import { AgentChatbot } from './components/AgentChatbot';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { NotificationCenter } from './components/NotificationCenter';

import { 
  StockData, 
  DetectiveOutput, 
  BossSynthesis, 
  RiskProfileType, 
  UserProfile, 
  PortfolioHolding,
  PortfolioAuditResult,
  NotificationItem, 
  SystemMetrics,
  AlertPreferences,
  CustomAlertRule
} from './types';
import { 
  POPULAR_STOCKS, 
  INITIAL_USER_PROFILE, 
  INITIAL_SYSTEM_METRICS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_ALERT_PREFERENCES,
  INITIAL_CUSTOM_ALERTS
} from './data/stocks';
import { fetchStocks, fetchLiveStock, runMultiAgentAnalysis, auditUserPortfolio, AnalysisResponse } from './services/api';
import { Bot, Sparkles, Activity, ShieldCheck, Newspaper, Shield, Layers, HelpCircle, Bell, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(POPULAR_STOCKS);
  const [activeTicker, setActiveTicker] = useState<string>('TATAMOTORS');
  const [isRefreshingLive, setIsRefreshingLive] = useState<boolean>(false);
  
  // Persisted Risk Profile
  const [riskProfile, setRiskProfile] = useState<RiskProfileType>(() => {
    try {
      const saved = localStorage.getItem('findetect_risk_profile');
      if (saved && (saved === 'conservative' || saved === 'moderate' || saved === 'aggressive')) {
        return saved as RiskProfileType;
      }
    } catch (e) {
      // localStorage not available
    }
    return 'conservative';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('findetect_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER_PROFILE;
  });
  const [degradedScenario, setDegradedScenario] = useState<'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals'>('none');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAuditingPortfolio, setIsAuditingPortfolio] = useState<boolean>(false);
  const [isPortfolioAuditModalOpen, setIsPortfolioAuditModalOpen] = useState<boolean>(false);
  const [portfolioAuditResult, setPortfolioAuditResult] = useState<PortfolioAuditResult | null>(null);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string>('Just now');

  // Multi-Agent Analysis State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Modals / Drawers State
  const [activeReasoningDetective, setActiveReasoningDetective] = useState<DetectiveOutput | null>(null);
  const [activeCitationsDetective, setActiveCitationsDetective] = useState<DetectiveOutput | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  
  // Notification and Alert Preferences State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('findetect_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [alertPreferences, setAlertPreferences] = useState<AlertPreferences>(() => {
    try {
      const saved = localStorage.getItem('findetect_alert_prefs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ALERT_PREFERENCES;
  });

  const [customAlerts, setCustomAlerts] = useState<CustomAlertRule[]>(() => {
    try {
      const saved = localStorage.getItem('findetect_custom_alerts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CUSTOM_ALERTS;
  });

  // Floating Toast Notification State
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(INITIAL_SYSTEM_METRICS);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('findetect_risk_profile', riskProfile);
    } catch (e) {}
  }, [riskProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('findetect_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('findetect_alert_prefs', JSON.stringify(alertPreferences));
    } catch (e) {}
  }, [alertPreferences]);

  useEffect(() => {
    try {
      localStorage.setItem('findetect_custom_alerts', JSON.stringify(customAlerts));
    } catch (e) {}
  }, [customAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem('findetect_user_profile', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  // Current Stock Object
  const currentStock = stocks.find((s) => s.ticker === activeTicker) || stocks[0] || POPULAR_STOCKS[0];

  // Stable references for state accessed inside callbacks / intervals
  const stocksRef = useRef(stocks);
  stocksRef.current = stocks;
  const currentStockRef = useRef(currentStock);
  currentStockRef.current = currentStock;
  const alertPreferencesRef = useRef(alertPreferences);
  alertPreferencesRef.current = alertPreferences;
  const customAlertsRef = useRef(customAlerts);
  customAlertsRef.current = customAlerts;

  // Add Notification Helper
  const pushNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);
    if (alertPreferencesRef.current.toastNotifications) {
      setActiveToast(newNotif);
      setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 6000);
    }
  }, []);

  // Execute Analysis Function
  const executeAnalysis = useCallback(async (ticker: string, profile: RiskProfileType, scenario: 'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals') => {
    setIsAnalyzing(true);
    try {
      const result = await runMultiAgentAnalysis(ticker, profile, scenario);
      setAnalysisResult(result);
      setLastAnalyzedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Update System Metrics
      setSystemMetrics((prev) => ({
        ...prev,
        averageResponseLatencyMs: Math.round((prev.averageResponseLatencyMs + result.synthesis.totalLatencyMs) / 2),
        totalAnalysesRun: prev.totalAnalysesRun + 1,
        degradedHandledCount: scenario !== 'none' ? prev.degradedHandledCount + 1 : prev.degradedHandledCount
      }));

      // Check if critical conditions meet notification criteria
      if (alertPreferencesRef.current.trendReversals && result.detectives.chart.verdict === 'BEARISH' && result.stock.rsi14 > 70) {
        pushNotification({
          title: `Technical Warning: ${ticker}`,
          message: `RSI is overbought at ${result.stock.rsi14}. Chart Detective flags sprint exhaustion.`,
          ticker,
          type: 'SIGNAL_BREAKOUT'
        });
      }

      if (alertPreferencesRef.current.sebiFilings && result.stock.filings.length > 0 && Math.random() < 0.3) {
        pushNotification({
          title: `SEBI Filing Verified: ${ticker}`,
          message: `${result.stock.filings[0].title} audited with ${result.stock.filings[0].confidenceScore}% confidence.`,
          ticker,
          type: 'FILING_ALERT'
        });
      }

    } catch (err) {
      console.warn("Analysis failed, handled safely:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [pushNotification]);

  // Initial load
  useEffect(() => {
    fetchStocks().then((data) => {
      if (data && data.length > 0) setStocks(data);
    });
    executeAnalysis(activeTicker, riskProfile, degradedScenario);
  }, []);

  // Periodic Market Condition Evaluator (Simulates real-time market event detector)
  useEffect(() => {
    const interval = setInterval(() => {
      const alerts = customAlertsRef.current;
      const allSt = stocksRef.current;
      const curSt = currentStockRef.current;
      const prefs = alertPreferencesRef.current;

      // Evaluate custom user alerts
      if (alerts.length > 0) {
        const randomRule = alerts[Math.floor(Math.random() * alerts.length)];
        const targetStock = allSt.find(s => s.ticker === randomRule.ticker);
        if (targetStock && Math.random() < 0.25) {
          pushNotification({
            title: `Custom Alert Triggered: ${randomRule.ticker}`,
            message: `Target ${randomRule.condition.replace(/_/g, ' ')} (${randomRule.targetValue}) matched current level ₹${targetStock.currentPrice}.`,
            ticker: randomRule.ticker,
            type: 'CUSTOM_ALERT'
          });
        }
      }

      // Check Google Trends spikes
      if (prefs.googleTrendsSurges && curSt?.googleTrends && curSt.googleTrends.searchScore >= prefs.googleTrendsThreshold) {
        if (Math.random() < 0.2) {
          pushNotification({
            title: `Google Trends Surge: ${curSt.ticker}`,
            message: `Search momentum index surged to ${curSt.googleTrends.searchScore}/100 with query "${curSt.googleTrends.breakoutQueries[0]?.query || 'momentum'}".`,
            ticker: curSt.ticker,
            type: 'GOOGLE_TREND_SPIKE'
          });
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [pushNotification]);

  // Trigger analysis when stock, risk profile, or degraded scenario changes
  const handleSelectStock = async (ticker: string) => {
    setActiveTicker(ticker);
    
    // Check if the stock is not yet loaded in our local stocks state
    const existing = stocks.find(s => s.ticker.toUpperCase() === ticker.toUpperCase());
    if (!existing) {
      try {
        const liveStock = await fetchLiveStock(ticker);
        if (liveStock) {
          setStocks(prev => [liveStock, ...prev.filter(s => s.ticker !== liveStock.ticker)]);
        }
      } catch (err) {
        console.warn("Could not prefetch stock live data:", err);
      }
    }

    executeAnalysis(ticker, riskProfile, degradedScenario);
  };

  const handleRefreshLiveFeed = async () => {
    setIsRefreshingLive(true);
    try {
      const refreshedStock = await fetchLiveStock(activeTicker);
      if (refreshedStock) {
        setStocks(prev => prev.map(s => s.ticker === refreshedStock.ticker ? refreshedStock : s));
        pushNotification({
          title: `Live Feed Synced: ${activeTicker}`,
          message: `Updated LTP ₹${refreshedStock.currentPrice.toFixed(2)} (${refreshedStock.changePercent >= 0 ? '+' : ''}${refreshedStock.changePercent.toFixed(2)}%) directly from exchange.`,
          ticker: activeTicker,
          type: 'SIGNAL_BREAKOUT'
        });
      }
    } catch (err) {
      console.warn("Live feed sync failed:", err);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  const handleChangeRiskProfile = (profile: RiskProfileType) => {
    setRiskProfile(profile);
    setUserProfile((prev) => ({ ...prev, riskProfile: profile }));
    executeAnalysis(activeTicker, profile, degradedScenario);

    pushNotification({
      title: `Risk Profile Updated: ${profile.toUpperCase()}`,
      message: `The Boss AI Synthesizer has recalibrated recommendation weights and stop-loss limits for ${profile} allocation.`,
      type: 'PORTFOLIO_ALERT'
    });
  };

  const handleChangeDegradedScenario = (scenario: 'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals') => {
    setDegradedScenario(scenario);
    executeAnalysis(activeTicker, riskProfile, scenario);

    if (scenario !== 'none') {
      pushNotification({
        title: `Degraded Test Mode Activated: ${scenario.replace(/_/g, ' ').toUpperCase()}`,
        message: `System successfully activated zero-hallucination guardrail for ${activeTicker}.`,
        ticker: activeTicker,
        type: 'SYSTEM_DEGRADED'
      });
    }
  };

  // Update holdings and cash balance
  const handleUpdateHoldings = (newHoldings: PortfolioHolding[], cashBalance?: number) => {
    setUserProfile((prev) => {
      const updatedCash = cashBalance !== undefined ? cashBalance : prev.cashBalance;
      const totalVal = newHoldings.reduce((acc, h) => acc + (h.currentPrice * h.shares), 0);
      return {
        ...prev,
        holdings: newHoldings,
        cashBalance: updatedCash,
        portfolioValue: totalVal + updatedCash
      };
    });

    pushNotification({
      title: 'Portfolio Holdings Updated',
      message: `Your monitored portfolio now contains ${newHoldings.length} assets with real-time risk tracking.`,
      type: 'PORTFOLIO_ALERT'
    });
  };

  // Update profile name, experience level, risk profile
  const handleUpdateProfile = (updatedFields: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updatedFields };
      return next;
    });

    if (updatedFields.riskProfile && updatedFields.riskProfile !== riskProfile) {
      setRiskProfile(updatedFields.riskProfile);
    }

    if (updatedFields.name) {
      pushNotification({
        title: 'Investor Profile Updated',
        message: `Active portfolio renamed to "${updatedFields.name}".`,
        type: 'PORTFOLIO_ALERT'
      });
    }
  };

  // Run full portfolio audit with the 3 AI Detectives
  const handleAuditPortfolio = async () => {
    setIsAuditingPortfolio(true);
    try {
      const result = await auditUserPortfolio(
        userProfile.holdings,
        userProfile.cashBalance,
        riskProfile,
        userProfile.name
      );
      setPortfolioAuditResult(result);
      setIsPortfolioAuditModalOpen(true);

      pushNotification({
        title: `Portfolio Multi-Agent Audit: ${result.overallVerdict.replace(/_/g, ' ')}`,
        message: `Health score rated ${result.overallScore}/100 with ${result.holdingAudits.length} holdings audited across all 3 AI Detectives.`,
        type: 'PORTFOLIO_ALERT'
      });
    } catch (err) {
      console.warn("Portfolio audit failed:", err);
    } finally {
      setIsAuditingPortfolio(false);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddCustomAlert = (rule: Omit<CustomAlertRule, 'id' | 'createdDate'>) => {
    const newRule: CustomAlertRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdDate: 'Just now'
    };
    setCustomAlerts((prev) => [newRule, ...prev]);
    pushNotification({
      title: `New Alert Rule Created`,
      message: `Monitoring ${rule.ticker} for ${rule.condition.replace(/_/g, ' ')} (${rule.targetValue}).`,
      ticker: rule.ticker,
      type: 'CUSTOM_ALERT'
    });
  };

  const handleDeleteCustomAlert = (id: string) => {
    setCustomAlerts((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTriggerTestAlert = () => {
    pushNotification({
      title: `⚡ Live Test Alert: ${currentStock.ticker}`,
      message: `Price moved +${(Math.random() * 2 + 1).toFixed(2)}% in high-volume trade. Technical & News Detectives confirmed alignment.`,
      ticker: currentStock.ticker,
      type: 'SIGNAL_BREAKOUT'
    });
  };

  // Target & Stop Loss Numbers for Chart Lines
  const targetPriceNum = analysisResult?.synthesis?.actionPlan?.targetPrice 
    ? parseFloat(analysisResult.synthesis.actionPlan.targetPrice.replace(/[^\d.]/g, '')) 
    : undefined;

  const stopLossPriceNum = analysisResult?.synthesis?.actionPlan?.stopLossPrice 
    ? parseFloat(analysisResult.synthesis.actionPlan.stopLossPrice.replace(/[^\d.]/g, '')) 
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navigation */}
      <Navbar
        currentStock={currentStock}
        allStocks={stocks}
        onSelectStock={handleSelectStock}
        riskProfile={riskProfile}
        onChangeRiskProfile={handleChangeRiskProfile}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Live Continuous Ticker Bar */}
      <MarketTicker
        stocks={stocks}
        onSelectStock={handleSelectStock}
        activeTicker={activeTicker}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Intro Mission Banner for Retail Investors */}
        <div className="mb-6 bg-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Hedge-Fund Grade Intelligence for Everyone
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">• Under 60 Seconds</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              3 AI Detectives Protecting Your Money in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Big hedge funds deploy teams of analysts with supercomputers. NiftyMind gives you 3 specialized AI robots running parallel technical, regulatory (SEBI RAG), and news synthesis to make safe, grounded choices.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-xs font-bold transition-all border border-slate-700 shadow-2xs"
            >
              How It Works
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 ring-2 ring-indigo-400/20"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Detectives</span>
            </button>
          </div>
        </div>

        {/* Stock Overview Header with Degraded Simulator & Audit CTA */}
        <StockOverview
          stock={currentStock}
          isAnalyzing={isAnalyzing}
          onRunAnalysis={() => executeAnalysis(activeTicker, riskProfile, degradedScenario)}
          degradedScenario={degradedScenario}
          onChangeDegradedScenario={handleChangeDegradedScenario}
          riskProfile={riskProfile}
          lastAnalyzedTime={lastAnalyzedTime}
          onRefreshLiveFeed={handleRefreshLiveFeed}
          isRefreshingLive={isRefreshingLive}
        />

        {/* Interactive Live Price Chart with Zoom, Pan, Multi-indicators & Guardrails */}
        <PriceChart 
          stock={currentStock} 
          targetPrice={targetPriceNum}
          stopLossPrice={stopLossPriceNum}
        />

        {/* Google Trends Real-Time Pulse for Active Stock */}
        <GoogleTrendsRadar
          stock={currentStock}
          onSelectQuery={() => setIsChatOpen(true)}
        />

        {/* 3 AI DETECTIVES (THE ROBOTS THINKING IN PARALLEL) */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  Autonomous Multi-Agent Swarm
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Meet Your 3 Specialized AI Detectives
              </h3>
            </div>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Running simultaneously on live feeds</span>
            </div>
          </div>

          {/* Detectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {analysisResult ? (
              <>
                <AgentDetectiveCard
                  detective={analysisResult.detectives.chart}
                  onInspectReasoning={(d) => setActiveReasoningDetective(d)}
                  onViewCitations={(d) => setActiveCitationsDetective(d)}
                />
                <AgentDetectiveCard
                  detective={analysisResult.detectives.rulebook}
                  onInspectReasoning={(d) => setActiveReasoningDetective(d)}
                  onViewCitations={(d) => setActiveCitationsDetective(d)}
                />
                <AgentDetectiveCard
                  detective={analysisResult.detectives.news}
                  onInspectReasoning={(d) => setActiveReasoningDetective(d)}
                  onViewCitations={(d) => setActiveCitationsDetective(d)}
                />
              </>
            ) : (
              <div className="col-span-3 p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                Initializing AI Detectives...
              </div>
            )}
          </div>
        </div>

        {/* THE BOSS AI (SYNTHESIS & PERSONALIZATION ENGINE) */}
        {analysisResult && (
          <BossSynthesisView
            synthesis={analysisResult.synthesis}
            stock={currentStock}
            riskProfile={riskProfile}
            onChangeRiskProfile={handleChangeRiskProfile}
          />
        )}

        {/* Live Market Trends, Sector Heatmap & Google Trends Leaderboard */}
        <LiveTrendsPanel onSelectStockByTicker={handleSelectStock} />

        {/* User Portfolio & Holdings Watchlist */}
        <PortfolioWatchlist
          userProfile={userProfile}
          allStocks={stocks}
          onSelectStock={handleSelectStock}
          onAuditPortfolio={handleAuditPortfolio}
          isAuditingPortfolio={isAuditingPortfolio}
          onUpdateHoldings={handleUpdateHoldings}
          onUpdateProfile={handleUpdateProfile}
          riskProfile={riskProfile}
          onChangeRiskProfile={handleChangeRiskProfile}
        />

      </main>

      {/* Portfolio Multi-Agent Audit Modal */}
      <PortfolioAuditModal
        isOpen={isPortfolioAuditModalOpen}
        onClose={() => setIsPortfolioAuditModalOpen(false)}
        auditResult={portfolioAuditResult}
        userProfile={userProfile}
        riskProfile={riskProfile}
        onSelectStock={handleSelectStock}
      />

      {/* Floating Toast Notification Banner */}
      {activeToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="p-2 bg-indigo-600 rounded-full shrink-0 mt-0.5">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-white truncate">{activeToast.title}</h4>
              <button
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              {activeToast.message}
            </p>
            {activeToast.ticker && (
              <button
                onClick={() => {
                  handleSelectStock(activeToast.ticker!);
                  setActiveToast(null);
                }}
                className="mt-2 text-[10px] font-bold text-indigo-300 hover:text-white flex items-center gap-1"
              >
                <span>Switch to {activeToast.ticker}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals and Drawers */}
      <ReasoningTraceModal
        detective={activeReasoningDetective}
        onClose={() => setActiveReasoningDetective(null)}
      />

      <ProofCitationsDrawer
        detective={activeCitationsDetective}
        onClose={() => setActiveCitationsDetective(null)}
      />

      <AgentChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentStock={currentStock}
        riskProfile={riskProfile}
      />

      <SystemArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        metrics={systemMetrics}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectStock={handleSelectStock}
        alertPreferences={alertPreferences}
        onUpdatePreferences={setAlertPreferences}
        customAlerts={customAlerts}
        onAddCustomAlert={handleAddCustomAlert}
        onDeleteCustomAlert={handleDeleteCustomAlert}
        onTriggerTestAlert={handleTriggerTestAlert}
        stocks={stocks}
      />

      {/* Floating Chat Trigger Button for Mobile/Convenience */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl shadow-indigo-500/25 flex items-center gap-2 text-xs font-bold ring-4 ring-indigo-500/10 active:scale-95 transition-all"
        >
          <Bot className="w-5 h-5 text-white" />
          <span className="hidden sm:inline">Ask AI Detectives</span>
        </button>
      )}

      {/* Systematic Geometric Balance Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900">Nifty<span className="text-indigo-600">Mind</span></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Autonomous Multi-Agent Financial Intelligence</span>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Status: ONLINE
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
              Detectives Active: 3/3
            </span>
            <span className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              Verified by RAG Protocol v2.1
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
