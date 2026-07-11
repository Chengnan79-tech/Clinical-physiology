import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Bot, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

interface AITutorProps {
  currentModule: string;
  currentMode: 'simulator' | 'quiz';
  currentData: Record<string, any>;
}

export default function AITutor({ currentModule, currentMode, currentData }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `您好！我是您的臨床生理學 AI 導師。🤝
我對目前的 **${getModuleName(currentModule)} - ${currentMode === 'simulator' ? '參數模擬' : '診斷測驗'}** 非常熟悉。
如果您對當前波形特徵、電生理原理或臨床意義有任何疑問，歡迎隨時問我！`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function getModuleName(mod: string) {
    switch (mod) {
      case 'ecg': return '心電圖判讀';
      case 'pft': return '肺功能分析';
      case 'eeg': return '腦波觀測';
      case 'emg': return '肌電圖';
      case 'ultrasound': return '超音波';
      default: return mod;
    }
  }

  // Auto-add system tip if module/mode changes
  useEffect(() => {
    setMessages(prev => [
      ...prev,
      {
        id: `system-change-${Date.now()}`,
        sender: 'assistant',
        text: `💡 我已偵測到您切換至 **${getModuleName(currentModule)} - ${currentMode === 'simulator' ? '參數模擬' : '診斷測驗'}**。我可以為您解說這個主題的重點！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [currentModule, currentMode]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsgText = inputValue.trim();
    setInputValue('');
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          context: {
            topic: getModuleName(currentModule),
            mode: currentMode === 'simulator' ? '互動模擬器' : '診斷測驗',
            data: currentData,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '無法取得 AI 回覆');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '連線至 AI 導師時發生錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: `對話已重設！我是您的臨床生理學 AI 導師。對當前 **${getModuleName(currentModule)}** 有任何疑問都可以問我喔！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl" id="ai-tutor-container">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/15 rounded-lg text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              臨床生理學 AI 導師
            </h3>
            <p className="text-[11px] text-slate-400">Gemini 專業輔助教學</p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          title="清除歷史紀錄"
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          id="btn-clear-chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px]" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-emerald-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-1">
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <p className={`text-[9px] text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center shrink-0 animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/50 border border-slate-700/40 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span>AI 導師正在分析波形與解說...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">連線失敗</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="詢問 AI 導師（例如：什麼是 ST 上升？）"
          className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 rounded-xl px-3.5 py-2 text-xs outline-none transition-all"
          disabled={isLoading}
          id="chat-input-field"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 rounded-xl transition-all font-medium disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center shrink-0 cursor-pointer"
          id="btn-send-message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
