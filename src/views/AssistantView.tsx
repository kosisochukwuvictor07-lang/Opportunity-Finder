import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { getApiUrl } from '../lib/api.ts';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

const SUGGESTED_QUESTIONS = [
  'How can I find a legitimate high-paying remote job from Nigeria?',
  'What are the full requirements to win a Chevening or Commonwealth scholarship?',
  'Can I transition into international tech roles without a university CS degree?',
  'How do I write a winning Statement of Purpose for global Master’s programs?',
  'How can I prepare for behavioral interview questions using the STAR framework?',
  'What free accredited certifications will make my CV stand out to remote recruiters?',
];

export const AssistantView: React.FC = () => {
  const { currentUser, userProfile, openAuthModal } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${userProfile?.fullName || 'there'}! I am **Opportunity AI Assistant**, your dedicated career and scholarship strategist.\n\nI can help you navigate verified remote employment, international scholarship applications (Chevening, Commonwealth, Mastercard Foundation), business grants (TEF), and ATS CV preparation tailored to your profile.\n\nWhat opportunity would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText: string = input) => {
    const text = messageText.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: Message = { role: 'user', content: text, createdAt: new Date().toISOString() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/gemini/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newHistory.slice(-8),
          userProfile: userProfile || {},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI assistant service.');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || data.fallback,
        createdAt: new Date().toISOString(),
      };
      setMessages([...newHistory, assistantMsg]);
    } catch (err: any) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: 'I apologize, but I experienced a temporary network issue. Please verify your connection or review official scholarship and career portal requirements directly.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation refreshed. How else can I assist your career or educational journey today?`,
      },
    ]);
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-purple-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                Opportunity AI Assistant
              </h1>
              <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized career coaching, scholarship guidance, and application procedures
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          title="Clear conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Suggested Prompts Carousel / Pills */}
      <div className="py-3 overflow-x-auto flex items-center gap-2 shrink-0 border-b border-slate-100 dark:border-slate-800/80 scrollbar-none">
        <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span>Ask about:</span>
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-500/60 whitespace-nowrap shrink-0 transition-colors shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5 pr-2">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-purple-600 dark:text-purple-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      <span>Opportunity Advisor</span>
                    </span>
                    <button
                      onClick={() => copyMessage(m.content, idx)}
                      className="p-1 rounded hover:text-slate-600 dark:hover:text-slate-200"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-purple-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>Analyzing requirements and crafting step-by-step guidance...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask about remote jobs, scholarship deadlines, interview tips, or CV guidance..."
            className="w-full pl-4 pr-12 py-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="absolute right-2 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Opportunity AI Assistant provides strategic advice. Always verify requirements directly with official institution portals.
        </p>
      </form>
    </div>
  );
};
