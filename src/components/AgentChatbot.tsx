import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Activity, ShieldCheck, Newspaper, Crown, RefreshCw, FileText, CheckCircle } from 'lucide-react';
import { ChatMessage, RiskProfileType, StockData } from '../types';
import { sendChatMessage } from '../services/api';

interface AgentChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: StockData;
  riskProfile: RiskProfileType;
}

export const AgentChatbot: React.FC<AgentChatbotProps> = ({
  isOpen,
  onClose,
  currentStock,
  riskProfile,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<'boss' | 'chart' | 'rulebook' | 'news'>('boss');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'boss',
      senderName: 'The Boss AI',
      text: `Hello! I manage the 3 AI Detectives for ${currentStock.name}. For your ${riskProfile} risk profile, how can our team help you with your investment decision today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [`SEBI LODR Filings (${currentStock.ticker})`],
      suggestedQuestions: [
        `Why did Robot 2 verify the promoter pledge?`,
        `What is the recommended stop-loss for my ${riskProfile} profile?`,
        `How does the Chart Detective evaluate momentum?`
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const response = await sendChatMessage(text, currentStock.ticker, selectedAgent, riskProfile);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: selectedAgent,
        senderName: selectedAgent === 'boss' ? 'The Boss AI' : selectedAgent === 'chart' ? 'Chart Detective' : selectedAgent === 'rulebook' ? 'Rulebook Detective' : 'News Detective',
        text: response.reply,
        timestamp: response.timestamp,
        sources: response.sources,
        suggestedQuestions: response.suggestedQuestions
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("Chat error:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const agentTabs = [
    { id: 'boss' as const, name: 'Boss AI', icon: Crown, color: 'text-amber-500' },
    { id: 'chart' as const, name: 'Robot 1 (Chart)', icon: Activity, color: 'text-indigo-500' },
    { id: 'rulebook' as const, name: 'Robot 2 (Rulebook)', icon: ShieldCheck, color: 'text-emerald-500' },
    { id: 'news' as const, name: 'Robot 3 (News)', icon: Newspaper, color: 'text-purple-500' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[460px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold">Ask the AI Detectives</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                {currentStock.ticker}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Real-time answers with verified citations</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Detective Switcher Tabs */}
      <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
        {agentTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedAgent === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedAgent(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                isSelected ? 'bg-white text-indigo-700 shadow-2xs ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{msg.senderName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Proof Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 flex-wrap text-[10px] text-slate-400 font-medium">
                    <FileText className="w-3 h-3 text-emerald-600" />
                    <span>Grounding Sources:</span>
                    {msg.sources.map((s, idx) => (
                      <span key={idx} className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Pills */}
              {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 max-w-[90%]">
                  {msg.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full px-3 py-1 text-left transition-colors"
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Detective is analyzing citations & market data...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask ${selectedAgent === 'boss' ? 'the Boss AI' : 'this Detective'} about ${currentStock.ticker}...`}
            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-900 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isSending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
