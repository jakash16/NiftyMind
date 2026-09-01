import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Activity, ShieldCheck, Newspaper, Crown, RefreshCw, FileText } from 'lucide-react';
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
      senderName: 'Boss AI',
      text: `Hello! I orchestrate the 3 AI Detectives for ${currentStock.name}. For your ${riskProfile} risk profile, what would you like verified or synthesized?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [`SEBI LODR Filings (${currentStock.ticker})`],
      suggestedQuestions: [
        `Why did Agent 2 verify the promoter pledge?`,
        `What is the recommended stop-loss for my ${riskProfile} profile?`,
        `How does the Technical Agent evaluate momentum?`
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        senderName: selectedAgent === 'boss' ? 'Boss AI' : selectedAgent === 'chart' ? 'Technical Agent' : selectedAgent === 'rulebook' ? 'Rulebook Agent' : 'News Agent',
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
    { id: 'boss' as const, name: 'Boss AI', icon: Crown, color: 'text-amber-400' },
    { id: 'chart' as const, name: 'Agent 1 (Technical)', icon: Activity, color: 'text-cyan-400' },
    { id: 'rulebook' as const, name: 'Agent 2 (Rulebook)', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'news' as const, name: 'Agent 3 (Macro)', icon: Newspaper, color: 'text-violet-400' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[460px] h-[580px] bg-[#0A0A0E] rounded-2xl border border-white/10 overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-4 bg-[#08080C] border-b border-white/10 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Ask AI Detectives</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 border border-white/10">
                {currentStock.ticker}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Grounded telemetry & citations</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Detective Switcher Tabs */}
      <div className="flex items-center gap-1 p-2 bg-[#08080C] border-b border-white/5 overflow-x-auto text-xs">
        {agentTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedAgent === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedAgent(tab.id)}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                isSelected 
                  ? 'bg-white text-black font-semibold' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3 h-3 ${isSelected ? 'text-black' : tab.color}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#08080C]/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1 mb-1 px-1">
                <span className="text-[10px] font-medium text-neutral-500 uppercase">{msg.senderName}</span>
                <span className="text-[10px] font-mono text-neutral-600">{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-white text-black font-medium'
                    : 'bg-[#0E0E14] text-neutral-200 border border-white/10'
                }`}
              >
                <p className="font-mono">{msg.text}</p>

                {/* Proof Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 flex-wrap text-[10px] text-neutral-400 font-mono">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>Sources:</span>
                    {msg.sources.map((s, idx) => (
                      <span key={idx} className="text-neutral-300 bg-white/5 px-1.5 py-0.2 rounded border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested Follow-up Pills */}
              {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 max-w-[90%]">
                  {msg.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[11px] font-mono text-neutral-300 bg-[#0E0E14] hover:bg-[#14141C] border border-white/10 rounded-md px-2.5 py-1 text-left transition-colors"
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
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-[#0E0E14] p-2.5 rounded-xl border border-white/10 w-fit">
            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            <span>Analyzing telemetry & citations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#08080C] border-t border-white/10">
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
            placeholder={`Ask ${selectedAgent === 'boss' ? 'Boss AI' : 'this Agent'}...`}
            className="flex-1 px-3 py-2 bg-[#0E0E14] rounded-lg text-xs text-white placeholder-neutral-500 border border-white/10 focus:outline-hidden focus:border-white/30 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isSending}
            className="p-2 bg-white disabled:opacity-40 text-black rounded-lg transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
