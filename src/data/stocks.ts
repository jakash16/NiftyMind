import { StockData, UserProfile, NotificationItem, SystemMetrics, AlertPreferences, CustomAlertRule } from '../types';

export const POPULAR_STOCKS: StockData[] = [
  {
    ticker: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    exchange: 'NSE',
    sector: 'Automobile & EV',
    currentPrice: 942.50,
    previousClose: 928.10,
    dayHigh: 948.80,
    dayLow: 926.00,
    change: 14.40,
    changePercent: 1.55,
    volume: 18450200,
    avgVolume: 12500000,
    marketCap: '₹3,46,800 Cr',
    peRatio: 16.4,
    fiftyTwoWeekHigh: 1179.00,
    fiftyTwoWeekLow: 650.20,
    rsi14: 64.2,
    macd: { value: 12.8, signal: 10.4, histogram: 2.4 },
    ema20: 931.2,
    ema50: 915.0,
    ema200: 840.5,
    promoterPledgePct: 0.0,
    promoterHoldingPct: 46.36,
    debtToEquity: 1.12,
    fiiNetFlowTrend: 'INFLOW',
    historicalPrices: [
      { time: '09:15', price: 928.5, volume: 1450000, open: 928.0, high: 931.0, low: 927.5, close: 928.5, ema20: 926.0, ema50: 912.0, ema200: 838.0, rsi: 56.4, macd: 1.2, bollingerUpper: 946.0, bollingerLower: 918.0 },
      { time: '09:45', price: 930.2, volume: 1120000, open: 928.5, high: 932.0, low: 928.0, close: 930.2, ema20: 927.0, ema50: 912.5, ema200: 838.5, rsi: 58.1, macd: 1.4, bollingerUpper: 946.5, bollingerLower: 918.5 },
      { time: '10:15', price: 933.8, volume: 1890000, open: 930.2, high: 935.0, low: 929.5, close: 933.8, ema20: 928.5, ema50: 913.0, ema200: 839.0, rsi: 61.2, macd: 1.7, bollingerUpper: 947.0, bollingerLower: 919.0 },
      { time: '10:45', price: 936.4, volume: 2100000, open: 933.8, high: 937.5, low: 932.5, close: 936.4, ema20: 929.8, ema50: 913.6, ema200: 839.4, rsi: 63.5, macd: 2.0, bollingerUpper: 948.0, bollingerLower: 920.0 },
      { time: '11:30', price: 935.1, volume: 1600000, open: 936.4, high: 937.0, low: 934.0, close: 935.1, ema20: 930.2, ema50: 914.0, ema200: 839.8, rsi: 61.8, macd: 2.1, bollingerUpper: 948.0, bollingerLower: 920.5 },
      { time: '12:15', price: 938.6, volume: 2450000, open: 935.1, high: 940.0, low: 934.8, close: 938.6, ema20: 930.8, ema50: 914.4, ema200: 840.1, rsi: 64.0, macd: 2.3, bollingerUpper: 949.0, bollingerLower: 921.0 },
      { time: '13:00', price: 941.2, volume: 2900000, open: 938.6, high: 943.0, low: 938.0, close: 941.2, ema20: 931.0, ema50: 914.8, ema200: 840.3, rsi: 65.8, macd: 2.5, bollingerUpper: 949.5, bollingerLower: 922.0 },
      { time: '13:45', price: 946.8, volume: 3800000, open: 941.2, high: 948.8, low: 940.5, close: 946.8, ema20: 931.5, ema50: 915.2, ema200: 840.6, rsi: 68.4, macd: 2.8, bollingerUpper: 950.5, bollingerLower: 923.0 },
      { time: '14:30', price: 944.5, volume: 2200000, open: 946.8, high: 947.5, low: 943.0, close: 944.5, ema20: 931.4, ema50: 915.1, ema200: 840.5, rsi: 65.2, macd: 2.6, bollingerUpper: 950.0, bollingerLower: 923.0 },
      { time: '15:15', price: 943.0, volume: 1800000, open: 944.5, high: 945.5, low: 942.0, close: 943.0, ema20: 931.2, ema50: 915.0, ema200: 840.5, rsi: 64.2, macd: 2.4, bollingerUpper: 949.8, bollingerLower: 923.2 },
      { time: '15:30', price: 942.5, volume: 2000200, open: 943.0, high: 944.5, low: 941.8, close: 942.5, ema20: 931.2, ema50: 915.0, ema200: 840.5, rsi: 64.2, macd: 2.4, bollingerUpper: 949.8, bollingerLower: 923.2 }
    ],
    filings: [
      {
        id: 'filing-tatamotors-1',
        sourceType: 'SEBI_FILING',
        title: 'SEBI LODR Reg 30: Demerger Plan Approval & Passenger Vehicle Growth',
        documentName: 'Tata_Motors_Demerger_SEBI_Disclosure_2025.pdf',
        pageOrClause: 'Section 4, Page 12, Clause 8(b)',
        filingDate: '12 Feb 2026',
        verifiedQuote: '"The Board has approved the composite scheme of arrangement for demerging the Commercial Vehicle (CV) business and Passenger Vehicle (PV) including EV business into two separate listed entities with 0 promoter share pledge and clean unencumbered assets."',
        confidenceScore: 98
      },
      {
        id: 'filing-tatamotors-2',
        sourceType: 'AUDIT_NOTE',
        title: 'Statutory Auditor Review - JLR Cash Flow & Debt Reduction Note',
        documentName: 'Q3_FY26_Statutory_Auditor_Limited_Review.pdf',
        pageOrClause: 'Page 31, Auditor Note 7',
        filingDate: '28 Jan 2026',
        verifiedQuote: '"Net automotive debt has decreased by ₹14,200 Crores YoY, meeting the zero-net-debt trajectory. No material regulatory non-compliances or adverse auditor qualifications were observed."',
        confidenceScore: 95
      }
    ],
    news: [
      {
        id: 'news-tatamotors-1',
        title: 'Tata Motors EV sales jump 28% in February as new Punch.ev & Curvv lead retail bookings',
        source: 'LiveMint Auto Pulse',
        timestamp: '2 hours ago',
        sentiment: 'POSITIVE',
        impactScore: 8,
        url: 'https://livemint.com',
        snippet: 'Strong domestic demand and aggressive charging infrastructure expansion are insulating margins against input cost pressures.'
      },
      {
        id: 'news-tatamotors-2',
        title: 'JLR order book remains robust at over 148,000 units with Defender and Range Rover leading premium segment',
        source: 'Bloomberg Quint',
        timestamp: '5 hours ago',
        sentiment: 'POSITIVE',
        impactScore: 7,
        url: 'https://bloomberg.com',
        snippet: 'Wholesale deliveries picked up steadily across UK and European dealer networks.'
      }
    ],
    googleTrends: {
      searchScore: 88,
      previousScore: 72,
      changePct: 22.2,
      searchVolumeDescription: 'High breakout interest fueled by Curvv EV deliveries & Demerger updates',
      momentum: 'SURGING',
      breakoutQueries: [
        { query: 'Tata Curvv EV real world range test', growth: '+280%', sentiment: 'POSITIVE' },
        { query: 'Tata Motors demerger share ratio record date', growth: '+190%', sentiment: 'POSITIVE' },
        { query: 'Tata Sierra EV launch timeline 2026', growth: '+115%', sentiment: 'POSITIVE' },
        { query: 'JLR order backlog Defender UK', growth: '+65%', sentiment: 'NEUTRAL' }
      ],
      regionalBreakdown: [
        { region: 'Maharashtra', intensity: 96 },
        { region: 'Karnataka', intensity: 88 },
        { region: 'Gujarat', intensity: 84 },
        { region: 'Tamil Nadu', intensity: 79 },
        { region: 'Delhi NCR', intensity: 92 }
      ],
      liveQueryStream: [
        { id: 'gq-1', query: 'Tata Motors share price target after demerger', location: 'Mumbai, MH', timestamp: 'Just now', sentiment: 'POSITIVE' },
        { id: 'gq-2', query: 'Tata Curvv EV on-road price Bengaluru', location: 'Bengaluru, KA', timestamp: '1m ago', sentiment: 'POSITIVE' },
        { id: 'gq-3', query: 'Tata Punch EV vs Nexon EV comparison', location: 'Pune, MH', timestamp: '3m ago', sentiment: 'NEUTRAL' }
      ],
      lastUpdated: 'Live streaming from Google Trends API'
    }
  },
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Limited',
    exchange: 'NSE',
    sector: 'Conglomerate / Energy & Telecom',
    currentPrice: 2894.20,
    previousClose: 2872.00,
    dayHigh: 2908.00,
    dayLow: 2865.50,
    change: 22.20,
    changePercent: 0.77,
    volume: 8740000,
    avgVolume: 7100000,
    marketCap: '₹19,58,000 Cr',
    peRatio: 27.2,
    fiftyTwoWeekHigh: 3024.90,
    fiftyTwoWeekLow: 2220.30,
    rsi14: 58.6,
    macd: { value: 8.4, signal: 6.2, histogram: 2.2 },
    ema20: 2870.0,
    ema50: 2835.0,
    ema200: 2680.0,
    promoterPledgePct: 0.0,
    promoterHoldingPct: 50.31,
    debtToEquity: 0.44,
    fiiNetFlowTrend: 'INFLOW',
    historicalPrices: [
      { time: '09:15', price: 2874.0, volume: 820000, open: 2872.0, high: 2878.0, low: 2869.0, close: 2874.0, ema20: 2865.0, ema50: 2830.0, ema200: 2678.0, rsi: 54.0, macd: 1.8, bollingerUpper: 2915.0, bollingerLower: 2840.0 },
      { time: '10:00', price: 2881.5, volume: 1450000, open: 2874.0, high: 2885.0, low: 2873.0, close: 2881.5, ema20: 2866.5, ema50: 2831.0, ema200: 2678.5, rsi: 56.2, macd: 2.0, bollingerUpper: 2915.0, bollingerLower: 2842.0 },
      { time: '11:00', price: 2888.0, volume: 1950000, open: 2881.5, high: 2891.0, low: 2879.0, close: 2888.0, ema20: 2868.0, ema50: 2832.0, ema200: 2679.0, rsi: 58.0, macd: 2.2, bollingerUpper: 2916.0, bollingerLower: 2845.0 },
      { time: '12:00', price: 2884.2, volume: 1100000, open: 2888.0, high: 2889.0, low: 2882.0, close: 2884.2, ema20: 2868.5, ema50: 2833.0, ema200: 2679.2, rsi: 56.5, macd: 2.1, bollingerUpper: 2916.0, bollingerLower: 2846.0 },
      { time: '13:00', price: 2892.0, volume: 1600000, open: 2884.2, high: 2896.0, low: 2884.0, close: 2892.0, ema20: 2869.2, ema50: 2834.0, ema200: 2679.6, rsi: 58.5, macd: 2.3, bollingerUpper: 2918.0, bollingerLower: 2848.0 },
      { time: '14:00', price: 2901.5, volume: 2100000, open: 2892.0, high: 2908.0, low: 2890.0, close: 2901.5, ema20: 2870.2, ema50: 2835.0, ema200: 2680.0, rsi: 61.0, macd: 2.5, bollingerUpper: 2920.0, bollingerLower: 2850.0 },
      { time: '15:00', price: 2896.0, volume: 880000, open: 2901.5, high: 2902.0, low: 2894.0, close: 2896.0, ema20: 2870.0, ema50: 2835.0, ema200: 2680.0, rsi: 59.0, macd: 2.3, bollingerUpper: 2918.0, bollingerLower: 2850.0 },
      { time: '15:30', price: 2894.2, volume: 400000, open: 2896.0, high: 2898.0, low: 2893.0, close: 2894.2, ema20: 2870.0, ema50: 2835.0, ema200: 2680.0, rsi: 58.6, macd: 2.2, bollingerUpper: 2918.0, bollingerLower: 2850.0 }
    ],
    filings: [
      {
        id: 'filing-reliance-1',
        sourceType: 'SEBI_FILING',
        title: 'SEBI Shareholding Pattern: Zero Promoter Pledge Confirmation',
        documentName: 'RIL_Shareholding_Pattern_Q3_FY26.pdf',
        pageOrClause: 'Table II, Row 3(a)',
        filingDate: '15 Jan 2026',
        verifiedQuote: '"Number of equity shares pledged or otherwise encumbered by promoter and promoter group entities remains 0.00% (Nil)."',
        confidenceScore: 99
      },
      {
        id: 'filing-reliance-2',
        sourceType: 'SEBI_FILING',
        title: 'SEBI Disclosure: Jio 5G Standalone & Retail Digital Expansion',
        documentName: 'RIL_Corporate_Presentation_FY26.pdf',
        pageOrClause: 'Slide 18, Regulatory Notes',
        filingDate: '24 Jan 2026',
        verifiedQuote: '"Jio Infocomm subscriber base reached 490 million with ARPU expanding to ₹198/month. Clean tax and regulatory clearances obtained for new energy gigafactories in Jamnagar."',
        confidenceScore: 96
      }
    ],
    news: [
      {
        id: 'news-reliance-1',
        title: 'Reliance Retail steps up fast-fashion and quick commerce footprint across Tier 2 hubs',
        source: 'Economic Times',
        timestamp: '3 hours ago',
        sentiment: 'POSITIVE',
        impactScore: 7,
        url: 'https://economictimes.indiatimes.com',
        snippet: 'Merchant onboarding crossed 4.2 million touchpoints with improved EBITDA margins.'
      }
    ],
    googleTrends: {
      searchScore: 79,
      previousScore: 74,
      changePct: 6.7,
      searchVolumeDescription: 'Steady institutional and consumer search interest around Jio IPO speculations',
      momentum: 'STABLE',
      breakoutQueries: [
        { query: 'Jio IPO expected date 2026 SEBI filing', growth: '+140%', sentiment: 'POSITIVE' },
        { query: 'Reliance green hydrogen Jamnagar giga complex', growth: '+85%', sentiment: 'POSITIVE' },
        { query: 'Jio 5G recharge plan price comparison', growth: '+50%', sentiment: 'NEUTRAL' }
      ],
      regionalBreakdown: [
        { region: 'Gujarat', intensity: 98 },
        { region: 'Maharashtra', intensity: 94 },
        { region: 'Delhi NCR', intensity: 89 },
        { region: 'Uttar Pradesh', intensity: 82 },
        { region: 'Karnataka', intensity: 76 }
      ],
      liveQueryStream: [
        { id: 'gq-rel-1', query: 'Reliance Industries bonus share credit date', location: 'Ahmedabad, GJ', timestamp: 'Just now', sentiment: 'POSITIVE' },
        { id: 'gq-rel-2', query: 'Jio financial services quarterly results', location: 'Surat, GJ', timestamp: '2m ago', sentiment: 'POSITIVE' }
      ],
      lastUpdated: 'Live sync active'
    }
  },
  {
    ticker: 'ZOMATO',
    name: 'Zomato Limited (Eternal)',
    exchange: 'NSE',
    sector: 'Internet / Quick Commerce & Food Delivery',
    currentPrice: 268.40,
    previousClose: 254.10,
    dayHigh: 272.00,
    dayLow: 253.50,
    change: 14.30,
    changePercent: 5.63,
    volume: 48900000,
    avgVolume: 32000000,
    marketCap: '₹2,38,000 Cr',
    peRatio: 92.5,
    fiftyTwoWeekHigh: 298.50,
    fiftyTwoWeekLow: 135.00,
    rsi14: 76.4,
    macd: { value: 7.2, signal: 5.1, histogram: 2.1 },
    ema20: 252.0,
    ema50: 238.0,
    ema200: 195.0,
    promoterPledgePct: 0.0,
    promoterHoldingPct: 0.0,
    debtToEquity: 0.02,
    fiiNetFlowTrend: 'INFLOW',
    historicalPrices: [
      { time: '09:15', price: 255.0, volume: 3100000, open: 254.1, high: 257.0, low: 253.5, close: 255.0, ema20: 249.0, ema50: 235.0, ema200: 193.0, rsi: 68.0, macd: 1.4, bollingerUpper: 265.0, bollingerLower: 242.0 },
      { time: '10:00', price: 260.4, volume: 8400000, open: 255.0, high: 262.0, low: 254.8, close: 260.4, ema20: 250.0, ema50: 236.0, ema200: 193.5, rsi: 72.5, macd: 1.7, bollingerUpper: 268.0, bollingerLower: 244.0 },
      { time: '11:00', price: 264.2, volume: 11800000, open: 260.4, high: 266.0, low: 259.5, close: 264.2, ema20: 251.0, ema50: 237.0, ema200: 194.0, rsi: 74.8, macd: 1.9, bollingerUpper: 270.0, bollingerLower: 245.0 },
      { time: '12:00', price: 263.0, volume: 6600000, open: 264.2, high: 265.0, low: 262.0, close: 263.0, ema20: 251.4, ema50: 237.3, ema200: 194.3, rsi: 73.0, macd: 1.9, bollingerUpper: 270.0, bollingerLower: 246.0 },
      { time: '13:00', price: 266.8, volume: 9200000, open: 263.0, high: 268.0, low: 263.0, close: 266.8, ema20: 251.8, ema50: 237.6, ema200: 194.7, rsi: 75.2, macd: 2.0, bollingerUpper: 272.0, bollingerLower: 247.0 },
      { time: '14:00', price: 271.5, volume: 13200000, open: 266.8, high: 272.0, low: 266.5, close: 271.5, ema20: 252.2, ema50: 238.0, ema200: 195.0, rsi: 78.0, macd: 2.2, bollingerUpper: 274.0, bollingerLower: 248.0 },
      { time: '15:00', price: 269.0, volume: 5100000, open: 271.5, high: 271.8, low: 268.0, close: 269.0, ema20: 252.0, ema50: 238.0, ema200: 195.0, rsi: 76.8, macd: 2.1, bollingerUpper: 273.5, bollingerLower: 248.5 },
      { time: '15:30', price: 268.4, volume: 1500000, open: 269.0, high: 269.8, low: 267.8, close: 268.4, ema20: 252.0, ema50: 238.0, ema200: 195.0, rsi: 76.4, macd: 2.1, bollingerUpper: 273.0, bollingerLower: 249.0 }
    ],
    filings: [
      {
        id: 'filing-zomato-1',
        sourceType: 'SEBI_FILING',
        title: 'SEBI Outcome of Board Meeting: Blinkit Dark Store Unit Economics',
        documentName: 'Zomato_Financial_Results_Q3_2026.pdf',
        pageOrClause: 'Note 14, Management Discussion, Page 22',
        filingDate: '04 Feb 2026',
        verifiedQuote: '"Blinkit achieved contribution margin positivity across 82% of dark stores with GOV growing 118% YoY. Cash balance exceeds ₹11,500 Crores following QIP completion."',
        confidenceScore: 94
      }
    ],
    news: [
      {
        id: 'news-zomato-1',
        title: 'Quick commerce boom accelerates as Blinkit expands 10-minute grocery and electronics delivery',
        source: 'Moneycontrol Tech',
        timestamp: '1 hour ago',
        sentiment: 'POSITIVE',
        impactScore: 9,
        url: 'https://moneycontrol.com',
        snippet: 'Analysts note RSI reaching overbought 76 territory indicating high momentum with potential short-term pullback risk.'
      }
    ],
    googleTrends: {
      searchScore: 94,
      previousScore: 78,
      changePct: 20.5,
      searchVolumeDescription: 'Massive surge in consumer queries for Blinkit 10-minute delivery in Tier 1 & 2 cities',
      momentum: 'SURGING',
      breakoutQueries: [
        { query: 'Blinkit 10 min iPhone delivery near me', growth: '+340%', sentiment: 'POSITIVE' },
        { query: 'Zomato share price target after Q3 profit', growth: '+210%', sentiment: 'POSITIVE' },
        { query: 'District app live events booking Zomato', growth: '+160%', sentiment: 'POSITIVE' }
      ],
      regionalBreakdown: [
        { region: 'Delhi NCR', intensity: 99 },
        { region: 'Bengaluru', intensity: 97 },
        { region: 'Mumbai', intensity: 92 },
        { region: 'Hyderabad', intensity: 88 },
        { region: 'Pune', intensity: 85 }
      ],
      liveQueryStream: [
        { id: 'gq-zom-1', query: 'Blinkit store open timings morning', location: 'Gurugram, HR', timestamp: 'Just now', sentiment: 'POSITIVE' },
        { id: 'gq-zom-2', query: 'Zomato Gold discount code', location: 'Bengaluru, KA', timestamp: '45s ago', sentiment: 'POSITIVE' }
      ],
      lastUpdated: 'Live sync active'
    }
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    sector: 'Banking & Financial Services',
    currentPrice: 1785.60,
    previousClose: 1792.00,
    dayHigh: 1799.00,
    dayLow: 1778.00,
    change: -6.40,
    changePercent: -0.36,
    volume: 14200000,
    avgVolume: 16000000,
    marketCap: '₹13,55,000 Cr',
    peRatio: 18.8,
    fiftyTwoWeekHigh: 1870.00,
    fiftyTwoWeekLow: 1363.55,
    rsi14: 48.2,
    macd: { value: -1.2, signal: 0.4, histogram: -1.6 },
    ema20: 1792.0,
    ema50: 1780.0,
    ema200: 1685.0,
    promoterPledgePct: 0.0,
    promoterHoldingPct: 0.0,
    debtToEquity: 7.1,
    fiiNetFlowTrend: 'NEUTRAL',
    historicalPrices: [
      { time: '09:15', price: 1791.0, volume: 1200000, open: 1792.0, high: 1795.0, low: 1789.0, close: 1791.0, ema20: 1794.0, ema50: 1782.0, ema200: 1684.0, rsi: 50.0, macd: -0.8, bollingerUpper: 1810.0, bollingerLower: 1770.0 },
      { time: '10:00', price: 1788.5, volume: 2400000, open: 1791.0, high: 1792.0, low: 1785.0, close: 1788.5, ema20: 1793.0, ema50: 1781.0, ema200: 1684.2, rsi: 48.5, macd: -1.0, bollingerUpper: 1808.0, bollingerLower: 1771.0 },
      { time: '11:00', price: 1782.0, volume: 3800000, open: 1788.5, high: 1789.0, low: 1778.0, close: 1782.0, ema20: 1792.0, ema50: 1780.0, ema200: 1684.5, rsi: 45.0, macd: -1.4, bollingerUpper: 1806.0, bollingerLower: 1772.0 },
      { time: '12:00', price: 1785.0, volume: 2100000, open: 1782.0, high: 1787.0, low: 1781.0, close: 1785.0, ema20: 1792.0, ema50: 1780.0, ema200: 1684.8, rsi: 47.0, macd: -1.5, bollingerUpper: 1805.0, bollingerLower: 1772.5 },
      { time: '13:00', price: 1780.2, volume: 2700000, open: 1785.0, high: 1786.0, low: 1779.0, close: 1780.2, ema20: 1792.0, ema50: 1780.0, ema200: 1685.0, rsi: 46.0, macd: -1.6, bollingerUpper: 1804.0, bollingerLower: 1772.0 },
      { time: '14:00', price: 1784.0, volume: 2600000, open: 1780.2, high: 1786.5, low: 1780.0, close: 1784.0, ema20: 1792.0, ema50: 1780.0, ema200: 1685.0, rsi: 47.5, macd: -1.5, bollingerUpper: 1803.0, bollingerLower: 1772.0 },
      { time: '15:00', price: 1786.5, volume: 1400000, open: 1784.0, high: 1788.0, low: 1783.0, close: 1786.5, ema20: 1792.0, ema50: 1780.0, ema200: 1685.0, rsi: 48.5, macd: -1.3, bollingerUpper: 1802.0, bollingerLower: 1773.0 },
      { time: '15:30', price: 1785.6, volume: 500000, open: 1786.5, high: 1787.5, low: 1784.5, close: 1785.6, ema20: 1792.0, ema50: 1780.0, ema200: 1685.0, rsi: 48.2, macd: -1.2, bollingerUpper: 1802.0, bollingerLower: 1773.0 }
    ],
    filings: [
      {
        id: 'filing-hdfc-1',
        sourceType: 'SEBI_FILING',
        title: 'RBI Regulatory Compliance & Capital Adequacy Basel III Report',
        documentName: 'HDFC_Bank_Pillar_3_Disclosures_Q3.pdf',
        pageOrClause: 'Clause 6.2, CRAR Summary Table',
        filingDate: '19 Jan 2026',
        verifiedQuote: '"Gross Non-Performing Assets (GNPA) stood stable at 1.24% of gross advances. Capital Adequacy Ratio (CRAR) comfortably maintained at 19.8% against regulatory minimum of 11.5%."',
        confidenceScore: 99
      }
    ],
    news: [
      {
        id: 'news-hdfc-1',
        title: 'HDFC Bank credit-deposit ratio normalizes smoothly following post-merger branch deposit blitz',
        source: 'CNBC-TV18',
        timestamp: '4 hours ago',
        sentiment: 'NEUTRAL',
        impactScore: 6,
        url: 'https://cnbctv18.com',
        snippet: 'Net interest margin held steady at 3.45% amid competitive deposit rate pricing.'
      }
    ],
    googleTrends: {
      searchScore: 71,
      previousScore: 75,
      changePct: -5.3,
      searchVolumeDescription: 'High baseline retail banking search traffic for fixed deposits & netbanking',
      momentum: 'STABLE',
      breakoutQueries: [
        { query: 'HDFC Bank special FD interest rate senior citizens', growth: '+45%', sentiment: 'POSITIVE' },
        { query: 'HDFC home loan interest rate 2026', growth: '+30%', sentiment: 'NEUTRAL' },
        { query: 'HDFC Bank mobile app login issue status', growth: '+15%', sentiment: 'NEUTRAL' }
      ],
      regionalBreakdown: [
        { region: 'Maharashtra', intensity: 95 },
        { region: 'Tamil Nadu', intensity: 90 },
        { region: 'Karnataka', intensity: 88 },
        { region: 'Delhi NCR', intensity: 87 },
        { region: 'West Bengal', intensity: 78 }
      ],
      liveQueryStream: [
        { id: 'gq-hdfc-1', query: 'HDFC Bank netbanking password reset', location: 'Chennai, TN', timestamp: '1m ago', sentiment: 'NEUTRAL' }
      ],
      lastUpdated: 'Live sync active'
    }
  },
  {
    ticker: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    sector: 'IT Services & AI Engineering',
    currentPrice: 1895.00,
    previousClose: 1878.50,
    dayHigh: 1910.00,
    dayLow: 1875.00,
    change: 16.50,
    changePercent: 0.88,
    volume: 6200000,
    avgVolume: 5800000,
    marketCap: '₹7,85,000 Cr',
    peRatio: 28.5,
    fiftyTwoWeekHigh: 1990.00,
    fiftyTwoWeekLow: 1358.00,
    rsi14: 61.5,
    macd: { value: 6.8, signal: 4.5, histogram: 2.3 },
    ema20: 1880.0,
    ema50: 1845.0,
    ema200: 1650.0,
    promoterPledgePct: 0.0,
    promoterHoldingPct: 14.71,
    debtToEquity: 0.08,
    fiiNetFlowTrend: 'INFLOW',
    historicalPrices: [
      { time: '09:15', price: 1880.0, volume: 500000, open: 1878.5, high: 1884.0, low: 1875.0, close: 1880.0, ema20: 1872.0, ema50: 1840.0, ema200: 1648.0, rsi: 56.0, macd: 1.4, bollingerUpper: 1910.0, bollingerLower: 1850.0 },
      { time: '10:00', price: 1888.0, volume: 1100000, open: 1880.0, high: 1891.0, low: 1879.0, close: 1888.0, ema20: 1875.0, ema50: 1841.0, ema200: 1648.5, rsi: 59.0, macd: 1.7, bollingerUpper: 1912.0, bollingerLower: 1852.0 },
      { time: '11:00', price: 1892.5, volume: 1400000, open: 1888.0, high: 1895.0, low: 1886.0, close: 1892.5, ema20: 1877.0, ema50: 1842.0, ema200: 1649.0, rsi: 61.0, macd: 1.9, bollingerUpper: 1914.0, bollingerLower: 1855.0 },
      { time: '12:00', price: 1890.0, volume: 900000, open: 1892.5, high: 1893.0, low: 1888.0, close: 1890.0, ema20: 1878.0, ema50: 1843.0, ema200: 1649.3, rsi: 59.8, macd: 1.9, bollingerUpper: 1914.0, bollingerLower: 1856.0 },
      { time: '13:00', price: 1898.0, volume: 1300000, open: 1890.0, high: 1902.0, low: 1889.0, close: 1898.0, ema20: 1879.0, ema50: 1844.0, ema200: 1649.6, rsi: 62.5, macd: 2.1, bollingerUpper: 1916.0, bollingerLower: 1858.0 },
      { time: '14:00', price: 1904.0, volume: 1500000, open: 1898.0, high: 1910.0, low: 1897.0, close: 1904.0, ema20: 1880.0, ema50: 1845.0, ema200: 1650.0, rsi: 64.0, macd: 2.4, bollingerUpper: 1918.0, bollingerLower: 1860.0 },
      { time: '15:00', price: 1897.0, volume: 500000, open: 1904.0, high: 1905.0, low: 1895.0, close: 1897.0, ema20: 1880.0, ema50: 1845.0, ema200: 1650.0, rsi: 61.8, macd: 2.3, bollingerUpper: 1916.0, bollingerLower: 1860.0 },
      { time: '15:30', price: 1895.0, volume: 200000, open: 1897.0, high: 1898.0, low: 1894.0, close: 1895.0, ema20: 1880.0, ema50: 1845.0, ema200: 1650.0, rsi: 61.5, macd: 2.3, bollingerUpper: 1916.0, bollingerLower: 1860.0 }
    ],
    filings: [
      {
        id: 'filing-infy-1',
        sourceType: 'SEBI_FILING',
        title: 'SEBI LODR: Large Deal TCV & Generative AI Topaz Adoption',
        documentName: 'Infosys_SEBI_Investor_Release_Q3_2026.pdf',
        pageOrClause: 'Page 8, Deal Win Metrics',
        filingDate: '10 Jan 2026',
        verifiedQuote: '"Large deal Total Contract Value (TCV) stood at $3.2 Billion with 54% net new wins. Generative AI platform Topaz active in over 380 enterprise transformation engagements."',
        confidenceScore: 97
      }
    ],
    news: [
      {
        id: 'news-infy-1',
        title: 'Infosys expands Enterprise AI alliance with European banking giants for cloud modernization',
        source: 'Reuters Financial',
        timestamp: '6 hours ago',
        sentiment: 'POSITIVE',
        impactScore: 7,
        url: 'https://reuters.com',
        snippet: 'Operating margin guidance raised to 21-22% band backed by automation efficiencies.'
      }
    ],
    googleTrends: {
      searchScore: 82,
      previousScore: 68,
      changePct: 20.6,
      searchVolumeDescription: 'Strong surge in queries regarding Generative AI deals and Topaz enterprise rollouts',
      momentum: 'HIGH',
      breakoutQueries: [
        { query: 'Infosys Topaz AI enterprise case studies', growth: '+220%', sentiment: 'POSITIVE' },
        { query: 'Infosys Q4 wage hike and bonus payout', growth: '+95%', sentiment: 'POSITIVE' },
        { query: 'Infosys share price prediction next 6 months', growth: '+70%', sentiment: 'POSITIVE' }
      ],
      regionalBreakdown: [
        { region: 'Karnataka', intensity: 98 },
        { region: 'Telangana', intensity: 94 },
        { region: 'Tamil Nadu', intensity: 91 },
        { region: 'Maharashtra', intensity: 86 },
        { region: 'Delhi NCR', intensity: 82 }
      ],
      liveQueryStream: [
        { id: 'gq-infy-1', query: 'Infosys Topaz platform pricing', location: 'Bengaluru, KA', timestamp: 'Just now', sentiment: 'POSITIVE' },
        { id: 'gq-infy-2', query: 'Infosys employee stock options vesting', location: 'Hyderabad, TS', timestamp: '2m ago', sentiment: 'NEUTRAL' }
      ],
      lastUpdated: 'Live sync active'
    }
  },
  {
    ticker: 'ADANIENT',
    name: 'Adani Enterprises Limited',
    exchange: 'NSE',
    sector: 'Metals, Mining & Infrastructure Incubator',
    currentPrice: 2980.00,
    previousClose: 3045.00,
    dayHigh: 3060.00,
    dayLow: 2940.00,
    change: -65.00,
    changePercent: -2.13,
    volume: 12400000,
    avgVolume: 8200000,
    marketCap: '₹3,40,000 Cr',
    peRatio: 88.0,
    fiftyTwoWeekHigh: 3450.00,
    fiftyTwoWeekLow: 2140.00,
    rsi14: 39.4,
    macd: { value: -18.5, signal: -12.0, histogram: -6.5 },
    ema20: 3050.0,
    ema50: 3120.0,
    ema200: 2950.0,
    promoterPledgePct: 2.85,
    promoterHoldingPct: 73.19,
    debtToEquity: 1.85,
    fiiNetFlowTrend: 'OUTFLOW',
    historicalPrices: [
      { time: '09:15', price: 3040.0, volume: 1100000, open: 3045.0, high: 3060.0, low: 3030.0, close: 3040.0, ema20: 3055.0, ema50: 3125.0, ema200: 2948.0, rsi: 44.0, macd: -5.0, bollingerUpper: 3150.0, bollingerLower: 2960.0 },
      { time: '10:00', price: 3010.0, volume: 2800000, open: 3040.0, high: 3042.0, low: 3005.0, close: 3010.0, ema20: 3052.0, ema50: 3122.0, ema200: 2949.0, rsi: 41.5, macd: -5.5, bollingerUpper: 3140.0, bollingerLower: 2955.0 },
      { time: '11:00', price: 2975.0, volume: 4200000, open: 3010.0, high: 3015.0, low: 2965.0, close: 2975.0, ema20: 3050.0, ema50: 3120.0, ema200: 2949.5, rsi: 38.0, macd: -6.2, bollingerUpper: 3130.0, bollingerLower: 2950.0 },
      { time: '12:00', price: 2960.0, volume: 2100000, open: 2975.0, high: 2980.0, low: 2950.0, close: 2960.0, ema20: 3050.0, ema50: 3120.0, ema200: 2950.0, rsi: 37.0, macd: -6.5, bollingerUpper: 3125.0, bollingerLower: 2948.0 },
      { time: '13:00', price: 2948.0, volume: 1800000, open: 2960.0, high: 2965.0, low: 2940.0, close: 2948.0, ema20: 3050.0, ema50: 3120.0, ema200: 2950.0, rsi: 36.0, macd: -6.8, bollingerUpper: 3120.0, bollingerLower: 2945.0 },
      { time: '14:00', price: 2970.0, volume: 1400000, open: 2948.0, high: 2975.0, low: 2945.0, close: 2970.0, ema20: 3050.0, ema50: 3120.0, ema200: 2950.0, rsi: 38.5, macd: -6.6, bollingerUpper: 3120.0, bollingerLower: 2945.0 },
      { time: '15:00', price: 2978.0, volume: 700000, open: 2970.0, high: 2982.0, low: 2968.0, close: 2978.0, ema20: 3050.0, ema50: 3120.0, ema200: 2950.0, rsi: 39.2, macd: -6.5, bollingerUpper: 3120.0, bollingerLower: 2945.0 },
      { time: '15:30', price: 2980.0, volume: 300000, open: 2978.0, high: 2985.0, low: 2975.0, close: 2980.0, ema20: 3050.0, ema50: 3120.0, ema200: 2950.0, rsi: 39.4, macd: -6.5, bollingerUpper: 3120.0, bollingerLower: 2945.0 }
    ],
    filings: [
      {
        id: 'filing-adani-1',
        sourceType: 'SEBI_FILING',
        title: 'SEBI SAST Disclosure: Promoter Pledge Release & Capex Debt Coverage',
        documentName: 'Adani_Enterprises_SEBI_SAST_Filing_2026.pdf',
        pageOrClause: 'Regulation 31(1), Annexure B, Page 4',
        filingDate: '18 Feb 2026',
        verifiedQuote: '"Promoter pledge stands at 2.85% of total share capital, down from 4.1%. Net debt-to-EBITDA ratio for incubated infrastructure verticals is 3.1x with credit rating affirmed at A+."',
        confidenceScore: 89
      }
    ],
    news: [
      {
        id: 'news-adani-1',
        title: 'Adani Green Energy commissions 1.2 GW hybrid solar-wind park in Khavda, Gujarat',
        source: 'Business Standard',
        timestamp: '3 hours ago',
        sentiment: 'NEUTRAL',
        impactScore: 6,
        url: 'https://business-standard.com',
        snippet: 'High leverage and volatile FII sentiment keep beta elevated at 1.74.'
      }
    ],
    googleTrends: {
      searchScore: 84,
      previousScore: 89,
      changePct: -5.6,
      searchVolumeDescription: 'Elevated search queries following airport capex disclosures and renewable parks',
      momentum: 'COOLING',
      breakoutQueries: [
        { query: 'Adani Navi Mumbai airport operational launch date', growth: '+175%', sentiment: 'POSITIVE' },
        { query: 'Adani Enterprises share target price 2026', growth: '+60%', sentiment: 'NEUTRAL' },
        { query: 'Adani Khavda solar park capacity update', growth: '+45%', sentiment: 'POSITIVE' }
      ],
      regionalBreakdown: [
        { region: 'Gujarat', intensity: 97 },
        { region: 'Maharashtra', intensity: 91 },
        { region: 'Delhi NCR', intensity: 88 },
        { region: 'Rajasthan', intensity: 81 },
        { region: 'Madhya Pradesh', intensity: 75 }
      ],
      liveQueryStream: [
        { id: 'gq-ada-1', query: 'Adani Enterprises quarterly investor call transcript', location: 'Ahmedabad, GJ', timestamp: '1m ago', sentiment: 'NEUTRAL' }
      ],
      lastUpdated: 'Live sync active'
    }
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-retail-101',
  name: 'My Investment Portfolio',
  riskProfile: 'conservative',
  experienceLevel: 'beginner',
  portfolioValue: 245000,
  cashBalance: 85000,
  holdings: [
    {
      ticker: 'TATAMOTORS',
      companyName: 'Tata Motors Limited',
      shares: 120,
      averageBuyPrice: 880.00,
      currentPrice: 942.50,
      sector: 'Automobile & EV',
      unrealizedPnl: 7500.00,
      unrealizedPnlPct: 7.10
    },
    {
      ticker: 'HDFCBANK',
      companyName: 'HDFC Bank Limited',
      shares: 60,
      averageBuyPrice: 1720.00,
      currentPrice: 1785.60,
      sector: 'Banking',
      unrealizedPnl: 3936.00,
      unrealizedPnlPct: 3.81
    },
    {
      ticker: 'INFY',
      companyName: 'Infosys Limited',
      shares: 30,
      averageBuyPrice: 1840.00,
      currentPrice: 1895.00,
      sector: 'IT Services',
      unrealizedPnl: 1650.00,
      unrealizedPnlPct: 2.99
    }
  ],
  watchlist: ['TATAMOTORS', 'RELIANCE', 'ZOMATO', 'INFY', 'HDFCBANK', 'ADANIENT']
};

export const INITIAL_SYSTEM_METRICS: SystemMetrics = {
  averageResponseLatencyMs: 642,
  signalAccuracy30Day: 88.7,
  portfolioRiskScore: 32,
  totalAnalysesRun: 1420,
  verifiedCitationsCount: 3840,
  degradedHandledCount: 142
};

export const INITIAL_ALERT_PREFERENCES: AlertPreferences = {
  priceVolatility: true,
  priceThresholdPct: 2.0,
  trendReversals: true,
  sebiFilings: true,
  googleTrendsSurges: true,
  googleTrendsThreshold: 80,
  portfolioGuardrails: true,
  toastNotifications: true,
  soundAlerts: false
};

export const INITIAL_CUSTOM_ALERTS: CustomAlertRule[] = [
  {
    id: 'rule-1',
    ticker: 'TATAMOTORS',
    condition: 'PRICE_ABOVE',
    targetValue: 955.0,
    active: true,
    createdDate: 'Today'
  },
  {
    id: 'rule-2',
    ticker: 'ZOMATO',
    condition: 'RSI_ABOVE',
    targetValue: 75.0,
    active: true,
    createdDate: 'Yesterday'
  },
  {
    id: 'rule-3',
    ticker: 'RELIANCE',
    condition: 'TREND_SPIKE',
    targetValue: 85.0,
    active: true,
    createdDate: '2 days ago'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'SEBI Filing Verified: Tata Motors',
    message: 'Demerger approval & clean 0% promoter pledge confirmed in SEBI LODR disclosure.',
    ticker: 'TATAMOTORS',
    type: 'FILING_ALERT',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Google Trends Spike: ZOMATO (+20.5%)',
    message: 'Search interest index hit 94/100 driven by "Blinkit 10 min iPhone delivery" queries.',
    ticker: 'ZOMATO',
    type: 'GOOGLE_TREND_SPIKE',
    timestamp: '22 mins ago',
    read: false,
    meta: { trendScore: 94, changePct: 20.5 }
  },
  {
    id: 'notif-3',
    title: 'Technical Momentum Surge: ZOMATO',
    message: 'RSI at 76.4 with volume anomaly (1.5x average). Robot 1 flags sprint exhaustion risk.',
    ticker: 'ZOMATO',
    type: 'SIGNAL_BREAKOUT',
    timestamp: '35 mins ago',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Autonomous System Resilience Check',
    message: 'Zero uncited claims generated across 1,420 multi-agent synthesis loops.',
    type: 'SYSTEM_DEGRADED',
    timestamp: '1 hour ago',
    read: true
  }
];

export const SECTOR_TRENDS = [
  { sector: 'Automobile & EV', changePct: +2.14, momentum: 'HIGH', sentiment: 'BULLISH', topStock: 'TATAMOTORS (+1.55%)' },
  { sector: 'Banking & Financials', changePct: +0.42, momentum: 'MODERATE', sentiment: 'NEUTRAL', topStock: 'ICICIBANK (+1.2%)' },
  { sector: 'IT Services & AI', changePct: +1.18, momentum: 'HIGH', sentiment: 'BULLISH', topStock: 'INFY (+0.88%)' },
  { sector: 'Quick Commerce & Internet', changePct: +4.85, momentum: 'VERY_HIGH', sentiment: 'BULLISH', topStock: 'ZOMATO (+5.63%)' },
  { sector: 'Energy & Oil/Gas', changePct: +0.65, momentum: 'MODERATE', sentiment: 'NEUTRAL', topStock: 'RELIANCE (+0.77%)' },
  { sector: 'Infrastructure & Metals', changePct: -1.35, momentum: 'LOW', sentiment: 'BEARISH', topStock: 'ADANIENT (-2.13%)' }
];

export const FII_DII_FLOW_DATA = [
  { day: 'Mon', fii: +1420, dii: +850 },
  { day: 'Tue', fii: -680, dii: +1240 },
  { day: 'Wed', fii: +2150, dii: +920 },
  { day: 'Thu', fii: +1890, dii: +1100 },
  { day: 'Fri', fii: +2450, dii: +1400 }
];
