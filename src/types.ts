export type RiskProfileType = 'conservative' | 'moderate' | 'aggressive';

export interface UserProfile {
  id: string;
  name: string;
  riskProfile: RiskProfileType;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  portfolioValue: number;
  cashBalance: number;
  holdings: PortfolioHolding[];
  watchlist: string[];
}

export interface PortfolioHolding {
  ticker: string;
  companyName: string;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  sector: string;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
}

export interface PortfolioAuditResult {
  overallScore: number; // 0-100
  overallVerdict: 'HEALTHY_BALANCED' | 'MODERATE_RISK' | 'HIGH_CONCENTRATION' | 'OVERBOUGHT_REBALANCE';
  verdictTitle: string;
  summary: string;
  totalHoldingsValue: number;
  totalInvested: number;
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPct: number;
  cashReserves: number;
  sectorAllocation: { sector: string; value: number; percentage: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' }[];
  detectives: {
    rulebook: {
      score: number;
      verdict: SignalType;
      summary: string;
      avgPromoterPledge: number;
      highDebtHoldings: string[];
      governanceFlags: string[];
    };
    chart: {
      score: number;
      verdict: SignalType;
      summary: string;
      portfolioRsi: number;
      aboveEma200Pct: number;
      momentumLeaders: string[];
      momentumLaggards: string[];
    };
    news: {
      score: number;
      verdict: SignalType;
      summary: string;
      overallSentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
      institutionalFlow: 'ACCUMULATING' | 'NEUTRAL' | 'DISTRIBUTING';
      keyNewsSignals: string[];
    };
  };
  holdingAudits: {
    ticker: string;
    companyName: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
    currentValue: number;
    portfolioWeightPct: number;
    unrealizedPnl: number;
    unrealizedPnlPct: number;
    actionRecommendation: 'ACCUMULATE' | 'HOLD' | 'TRIM' | 'TAKE_PROFIT' | 'EXIT';
    suggestedWeightPct: number;
    stopLossPrice?: number;
    rationale: string;
    detectiveVerdict: {
      chart: SignalType;
      rulebook: SignalType;
      news: SignalType;
    };
  }[];
  rebalanceSuggestions: {
    actionType: 'BUY' | 'SELL' | 'HOLD' | 'DIVERSIFY';
    ticker?: string;
    description: string;
    impact: string;
  }[];
  auditedAt: string;
}

export type SignalType = 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'SAFE' | 'WARNING' | 'HIGH_RISK' | 'POSITIVE' | 'NEGATIVE';

export interface AgentReasoningStep {
  stepNumber: number;
  title: string;
  description: string;
  timestamp: string;
  latencyMs: number;
  dataPointsUsed?: string[];
  status: 'completed' | 'warning' | 'failed';
}

export interface AgentCitation {
  id: string;
  sourceType: 'SEBI_FILING' | 'ANNUAL_REPORT' | 'NEWS_WIRE' | 'TECHNICAL_FEED' | 'AUDIT_NOTE';
  title: string;
  documentName: string;
  pageOrClause: string;
  filingDate: string;
  verifiedQuote: string;
  url?: string;
  confidenceScore: number;
}

export interface DetectiveOutput {
  agentId: 'chart' | 'rulebook' | 'news';
  agentName: string;
  agentRole: string;
  avatarIcon: string;
  summary: string;
  verdict: SignalType;
  confidenceScore: number; // 0 to 100
  keyMetrics: Record<string, string | number>;
  reasoningChain: AgentReasoningStep[];
  citations: AgentCitation[];
  degradedStatus?: {
    isDegraded: boolean;
    reason?: string;
    impactOnConfidence?: number;
  };
  latencyMs: number;
}

export interface BossSynthesis {
  recommendation: 'STRONG_BUY' | 'CAUTIOUS_BUY' | 'HOLD_AND_WATCH' | 'REDUCE_EXPOSURE' | 'STRICT_AVOID';
  recommendationLabel: string;
  recommendationColor: string;
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  headline: string;
  plainEnglishExplanation: string;
  customProfileReasoning: string;
  actionPlan: {
    suggestedAction: string;
    entryRange?: string;
    targetPrice?: string;
    stopLossPrice?: string;
    positionSizeGuidance: string;
    timeHorizon: string;
  };
  synthesisMatrix: {
    agentId: 'chart' | 'rulebook' | 'news';
    agentName: string;
    agentVerdict: SignalType;
    weightGiven: number; // e.g. 0.35
    whyWeightedThisWay: string;
  }[];
  riskWarnings: string[];
  degradedDataNotice?: string;
  totalLatencyMs: number;
  timestamp: string;
}

export interface StockData {
  ticker: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ';
  sector: string;
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  marketCap: string;
  peRatio: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  rsi14: number;
  macd: { value: number; signal: number; histogram: number };
  ema20: number;
  ema50: number;
  ema200: number;
  promoterPledgePct: number;
  promoterHoldingPct: number;
  debtToEquity: number;
  fiiNetFlowTrend: 'INFLOW' | 'OUTFLOW' | 'NEUTRAL';
  historicalPrices: { 
    time: string; 
    price: number; 
    volume: number; 
    open?: number; 
    high?: number; 
    low?: number; 
    close?: number;
    ema20?: number;
    ema50?: number;
    ema200?: number;
    rsi?: number;
    macd?: number;
    bollingerUpper?: number;
    bollingerLower?: number;
  }[];
  filings: AgentCitation[];
  news: MarketNewsItem[];
  googleTrends?: GoogleTrendsData;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  impactScore: number; // 1 to 10
  url: string;
  snippet: string;
}

export interface SystemMetrics {
  averageResponseLatencyMs: number;
  signalAccuracy30Day: number; // percentage e.g. 88.6%
  portfolioRiskScore: number; // 0 to 100
  totalAnalysesRun: number;
  verifiedCitationsCount: number;
  degradedHandledCount: number;
}

export interface GoogleTrendsData {
  searchScore: number; // 0 to 100
  previousScore: number;
  changePct: number; // e.g. +18.4%
  searchVolumeDescription: string;
  momentum: 'SURGING' | 'HIGH' | 'STABLE' | 'COOLING';
  breakoutQueries: { query: string; growth: string; sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' }[];
  regionalBreakdown: { region: string; intensity: number }[];
  liveQueryStream: { id: string; query: string; location: string; timestamp: string; sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' }[];
  lastUpdated: string;
}

export interface AlertPreferences {
  priceVolatility: boolean;
  priceThresholdPct: number; // e.g. 2%
  trendReversals: boolean;
  sebiFilings: boolean;
  googleTrendsSurges: boolean;
  googleTrendsThreshold: number; // e.g. 75
  portfolioGuardrails: boolean;
  toastNotifications: boolean;
  soundAlerts: boolean;
}

export interface CustomAlertRule {
  id: string;
  ticker: string;
  condition: 'PRICE_ABOVE' | 'PRICE_BELOW' | 'RSI_ABOVE' | 'RSI_BELOW' | 'TREND_SPIKE';
  targetValue: number;
  active: boolean;
  createdDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  ticker?: string;
  type: 'FILING_ALERT' | 'SIGNAL_BREAKOUT' | 'SENTIMENT_SPIKE' | 'SYSTEM_DEGRADED' | 'PORTFOLIO_ALERT' | 'GOOGLE_TREND_SPIKE' | 'CUSTOM_ALERT';
  timestamp: string;
  read: boolean;
  meta?: {
    changePct?: number;
    trendScore?: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'boss' | 'chart' | 'rulebook' | 'news';
  senderName: string;
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedQuestions?: string[];
}
