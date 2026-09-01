/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
import { Canvas3DScene } from './components/Canvas3DScene';
import { CustomCursor } from './components/CustomCursor';

import { 
  StockData, 
  DetectiveOutput, 
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
import { Bot, Sparkles, Bell, X, ArrowRight, Layers, ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>(POPULAR_STOCKS);
  const [activeTicker, setActiveTicker] = useState<string>('TATAMOTORS');
  const [isRefreshingLive, setIsRefreshingLive] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  // Persisted Risk Profile
  const [riskProfile, setRiskProfile] = useState<RiskProfileType>(() => {
    try {
      const saved = localStorage.getItem('findetect_risk_profile');
      if (saved && (saved === 'conservative' || saved === 'moderate' || saved === 'aggressive')) {
        return saved as RiskProfileType;
      }
    } catch (e) {
      // ignore
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

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Track scroll progress for 3D engine and editorial transitions
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

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
      }, 5000);
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

  // Periodic Market Condition Evaluator
  useEffect(() => {
    const interval = setInterval(() => {
      const alerts = customAlertsRef.current;
      const allSt = stocksRef.current;
      const curSt = currentStockRef.current;
      const prefs = alertPreferencesRef.current;

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

  const handleSelectStock = async (ticker: string) => {
    setActiveTicker(ticker);
    
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
      message: `The Boss AI Synthesizer recalibrated recommendation weights and stop-loss limits for ${profile} allocation.`,
      type: 'PORTFOLIO_ALERT'
    });
  };

  const handleChangeDegradedScenario = (scenario: 'none' | 'missing_filing' | 'feed_glitch' | 'conflicting_signals') => {
    setDegradedScenario(scenario);
    executeAnalysis(activeTicker, riskProfile, scenario);

    if (scenario !== 'none') {
      pushNotification({
        title: `Degraded Test Mode: ${scenario.replace(/_/g, ' ').toUpperCase()}`,
        message: `System activated zero-hallucination guardrail for ${activeTicker}.`,
        ticker: activeTicker,
        type: 'SYSTEM_DEGRADED'
      });
    }
  };

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
      title: `Live Test Alert: ${currentStock.ticker}`,
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
    <div className="relative min-h-screen bg-[#050505] text-[#EDEDED] antialiased flex flex-col font-sans selection:bg-white/20 selection:text-white">
      
      {/* Dynamic 3D Background Scene */}
      <Canvas3DScene 
        scrollProgress={scrollProgress} 
        currentStock={currentStock} 
      />

      {/* Bespoke Precision Custom Cursor */}
      <CustomCursor />

      {/* Static Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Top Navigation Bar */}
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

      {/* Main Interactive Scrollytelling Container */}
      <main ref={mainContainerRef} className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Floating Scrollytelling Scene Navigator (Desktop HUD) */}
        <aside aria-label="Scrollytelling Scenes" className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-2.5 bg-[#0A0A0E]/90 p-2.5 rounded-2xl border border-white/10">
          <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider px-2 pb-1 border-b border-white/10 text-center">
            Scenes
          </div>
          {[
            { id: 'scene-1', num: '01', title: 'Swarm Active', range: [0, 0.20] },
            { id: 'scene-2', num: '02', title: 'Data Convergence', range: [0.20, 0.40] },
            { id: 'scene-3', num: '03', title: 'Deep Market Analysis', range: [0.40, 0.65] },
            { id: 'scene-4', num: '04', title: 'External Context', range: [0.65, 0.85] },
            { id: 'scene-5', num: '05', title: 'Action & Synthesis', range: [0.85, 1.0] },
          ].map((scene) => {
            const isActive = scrollProgress >= scene.range[0] && scrollProgress <= scene.range[1];
            return (
              <a
                key={scene.id}
                href={`#${scene.id}`}
                className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-cyan-400 scale-125' : 'bg-neutral-600 group-hover:bg-neutral-400'}`} />
                <span>{scene.num}</span>
                <span className="hidden group-hover:inline text-[10px] whitespace-nowrap text-neutral-300 font-sans pl-1">
                  {scene.title}
                </span>
              </a>
            );
          })}
        </aside>

        {/* =========================================================================
            SCENE 1: SWARM ACTIVE (Scroll 0% - 20%)
            ========================================================================= */}
        <section id="scene-1" className="relative pt-2 pb-6 scroll-mt-24">
          <div className="bg-[#0A0A0E] p-6 sm:p-10 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-500/10 rounded-md border border-cyan-500/20 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    SCENE 01 • SWARM ACTIVE
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    3 Autonomous AI Detectives • Real-time Parallel Execution
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                  3 AI Detectives Protecting <br />
                  <span className="text-neutral-400 font-normal">
                    Your Capital in Real-Time.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal">
                  NiftyMind orchestrates three parallel AI specialists: <strong>Robot 01 (Technical Chartist)</strong>, <strong>Robot 02 (SEBI LODR RAG)</strong>, and <strong>Robot 03 (Macro Sentiment)</strong>. They audit live price action, filings, and public search interest simultaneously.
                </p>

                {/* 3 Detectives Spatial Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="bg-[#0E0E14] p-3 rounded-xl border border-cyan-500/20 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400">AGENT 01</div>
                      <div className="text-xs font-semibold text-white">Chart Detective</div>
                    </div>
                  </div>

                  <div className="bg-[#0E0E14] p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400">AGENT 02</div>
                      <div className="text-xs font-semibold text-white">Rulebook RAG</div>
                    </div>
                  </div>

                  <div className="bg-[#0E0E14] p-3 rounded-xl border border-violet-500/20 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-[10px] font-mono text-violet-400">AGENT 03</div>
                      <div className="text-xs font-semibold text-white">Macro & Sentiment</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setIsArchitectureModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg text-xs font-medium text-neutral-200 bg-[#121218] hover:bg-[#1A1A22] border border-white/10 hover:border-white/20 transition-all text-center flex items-center justify-center gap-2 font-mono"
                >
                  <span>Architecture Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4 text-black" />
                  <span>Ask AI Detectives</span>
                </button>
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono">Active Target: <strong className="text-white font-medium">{currentStock.name} ({currentStock.ticker})</strong></span>
              <a href="#scene-2" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors">
                <span>Scroll down to Scene 02 (Data Convergence)</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 2: DATA CONVERGENCE (Scroll 20% - 40%)
            ========================================================================= */}
        <section id="scene-2" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                SCENE 02 • DATA CONVERGENCE
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Real-Time Exchange Telemetry & Resilience Console
              </span>
            </div>
            <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>NSE: Live Stream Active</span>
            </div>
          </div>

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
        </section>

        {/* =========================================================================
            SCENE 3: DEEP MARKET ANALYSIS - CHART DETECTIVE (Scroll 40% - 65%)
            ========================================================================= */}
        <section id="scene-3" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                SCENE 03 • DEEP MARKET ANALYSIS
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Robot 01 Technical Projection & Volumetric Indicators
              </span>
            </div>
            {analysisResult && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  CONFIDENCE: {analysisResult.detectives.chart.confidenceScore}% ({analysisResult.detectives.chart.verdict})
                </span>
              </div>
            )}
          </div>

          <PriceChart 
            stock={currentStock} 
            targetPrice={targetPriceNum}
            stopLossPrice={stopLossPriceNum}
          />
        </section>

        {/* =========================================================================
            SCENE 4: EXTERNAL CONTEXT & SWARM MATRIX (Scroll 65% - 85%)
            ========================================================================= */}
        <section id="scene-4" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                SCENE 04 • EXTERNAL CONTEXT & SWARM MATRIX
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Google Trends Search Pulse & 3 Parallel Domain Experts
              </span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Grounding: SEBI LODR + Google Search
            </span>
          </div>

          {/* Google Trends Regional Radar */}
          <GoogleTrendsRadar
            stock={currentStock}
            onSelectQuery={() => setIsChatOpen(true)}
          />

          {/* 3 AI Detectives Swarm Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Parallel Detective Telemetry</span>
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                Click "Thinking Trace" or "Proof" for verifiable audit logs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="col-span-3 p-16 text-center bg-[#0A0A0E] rounded-2xl border border-white/10 text-neutral-400 text-sm">
                  <div className="w-6 h-6 rounded-full border-2 border-neutral-400 border-t-white animate-spin mx-auto mb-3" />
                  Initializing parallel AI detective telemetry...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SCENE 5: ACTION & PORTFOLIO SYNTHESIS (Scroll 85% - 100%)
            ========================================================================= */}
        <section id="scene-5" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                SCENE 05 • ACTION & PORTFOLIO SYNTHESIS
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Boss AI Decision Matrix & Multi-Asset Portfolio Safeguards
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Personalized for {riskProfile.toUpperCase()} Investor
            </span>
          </div>

          {/* Boss AI Synthesis View */}
          {analysisResult && (
            <BossSynthesisView
              synthesis={analysisResult.synthesis}
              stock={currentStock}
              riskProfile={riskProfile}
              onChangeRiskProfile={handleChangeRiskProfile}
            />
          )}

          {/* Live Market Trends & Sector Heatmap */}
          <LiveTrendsPanel onSelectStockByTicker={handleSelectStock} />

          {/* User Portfolio Watchlist & Holdings Audit */}
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
        </section>

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
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#0E0E14] text-white p-4 rounded-xl border border-white/10 flex items-start gap-3 animate-fade-in shadow-xl">
          <div className="p-2 bg-white/10 rounded-lg shrink-0 mt-0.5">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-semibold text-white truncate">{activeToast.title}</h4>
              <button
                onClick={() => setActiveToast(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-300 mt-1 leading-snug">
              {activeToast.message}
            </p>
            {activeToast.ticker && (
              <button
                onClick={() => {
                  handleSelectStock(activeToast.ticker!);
                  setActiveToast(null);
                }}
                className="mt-2 text-[10px] font-semibold text-cyan-300 hover:text-white flex items-center gap-1 font-mono"
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

      {/* Floating Chat Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#121218] hover:bg-[#1A1A24] text-white p-3 sm:px-4 sm:py-3 rounded-full border border-white/15 flex items-center gap-2 text-xs font-semibold active:scale-95 transition-all shadow-lg"
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Ask AI Detectives</span>
        </button>
      )}

      {/* Obsidian-Themed Footer */}
      <footer className="relative z-10 bg-[#07070A] border-t border-white/10 py-6 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">NIFTY<span className="text-cyan-400">MIND</span></span>
            <span className="text-white/20">•</span>
            <span className="text-neutral-400">Multi-Agent Financial Intelligence Swarm</span>
          </div>
          
          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              SYSTEM: ONLINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium font-mono">
              DETECTIVES: 3/3 ACTIVE
            </span>
            <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10 font-mono">
              SEBI LODR RAG PROTOCOL
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
