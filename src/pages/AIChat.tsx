import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Sparkles, Trash2, Bot, User, 
  Loader2, AlertCircle, ArrowLeft, Zap,
  Package, FileText, Users, Wrench, BarChart3, HelpCircle, Languages
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import type { ChatMessage } from '../services/geminiService';

type ResponseLanguage = 'auto' | 'english' | 'sinhala';

interface Message extends ChatMessage {
  id: string;
  isError?: boolean;
}

export const AIChat: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseLanguage, setResponseLanguage] = useState<ResponseLanguage>('auto');
  const [hasApiKey] = useState(geminiService.hasApiKey());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Always focus input on mount
  useEffect(() => {
    if (hasApiKey) {
      inputRef.current?.focus();
    }
  }, [hasApiKey]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing conversation history and add welcome if empty
  useEffect(() => {
    const history = geminiService.getHistory();
    if (history.length > 0) {
      setMessages(history.map(msg => ({
        ...msg,
        id: Math.random().toString(36).substring(2, 9)
      })));
    } else if (hasApiKey) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Ayubowan! 🙏 Welcome to ECOTEC AI Assistant!

I'm here to help you with anything related to the ECOTEC System:

📦 **Inventory Management** - Products, brands, categories, stock tracking
👥 **Customer Management** - Customer details, purchase history, credit tracking
📄 **Sales & Billing** - Invoices, quotations, estimates
🔧 **Services & Repairs** - Job notes, service tracking
📊 **Reports & Analytics** - Sales reports, inventory reports, exports
💰 **Cash Management** - Daily summaries, transactions
🛡️ **Warranty Management** - Claims, tracking
⚙️ **Settings & Configuration** - Shop details, preferences

ඕනෑම භාෂාවකින් (English, සිංහල, Singlish) ඔබට ප්‍රශ්න අහන්න පුළුවන්!

**Tips:**
• Press **Enter** to send your message
• Ask me "kohomada invoice ekak hadanne?" for help in Singlish
• Ask me "invoice එකක් හදන්නේ කොහොමද?" for help in Sinhala

How can I assist you today? 😊`,
        timestamp: new Date()
      }]);
    }
  }, [hasApiKey]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Re-focus input after sending
    setTimeout(() => inputRef.current?.focus(), 50);

    try {
      const response = await geminiService.sendMessage(userMessage.content, responseLanguage);
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    geminiService.clearHistory();
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Chat cleared! 🔄

How can I help you today? 😊`,
      timestamp: new Date()
    }]);
    inputRef.current?.focus();
  };

  // Handle quick question from sidebar
  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <li key={index} className="ml-4">{line.substring(2)}</li>;
        }
        if (/^\d+\.\s/.test(line)) {
          return <li key={index} className="ml-4">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <p key={index} className={line === '' ? 'h-2' : ''} 
             dangerouslySetInnerHTML={{ __html: boldFormatted }} />
        );
      });
  };

  // No API key screen
  if (!hasApiKey) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-slate-400'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              ECOTEC AI Assistant
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Your intelligent assistant for the ECOTEC System
            </p>
          </div>
        </div>

        <div className={`rounded-2xl border p-12 text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            <Bot className={`w-10 h-10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            API Key Required
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Please configure your Gemini API key in the .env file to use the AI Assistant.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-88px)] sm:h-[calc(100vh-100px)] flex gap-4 lg:gap-6">
      {/* Quick Suggestions Sidebar - Hidden on smaller screens */}
      <div className={`hidden lg:flex flex-col w-56 xl:w-64 rounded-2xl border overflow-hidden flex-shrink-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Sidebar Header */}
        <div className={`p-3 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
            <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Quick Questions
            </h3>
          </div>
        </div>

        {/* Quick Suggestion Categories */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Inventory */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2">
              <Package className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Inventory
              </span>
            </div>
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("How do I add a new product?")}
              text="Add product"
            />
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("product ekak add karanne kohomada?")}
              text="Product add කරන්නේ?"
            />
          </div>

          {/* Invoices */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2">
              <FileText className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Billing
              </span>
            </div>
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("How to create an invoice?")}
              text="Create invoice"
            />
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("invoice ekak print karanne kohomada?")}
              text="Invoice print?"
            />
          </div>

          {/* Customers */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2">
              <Users className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Customers
              </span>
            </div>
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("How to add a new customer?")}
              text="Add customer"
            />
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("customer credit balance balanne kohomada?")}
              text="Credit balance?"
            />
          </div>

          {/* Services */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2">
              <Wrench className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Services
              </span>
            </div>
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("How to create a job note?")}
              text="Job note"
            />
          </div>

          {/* Reports */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2">
              <BarChart3 className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Reports
              </span>
            </div>
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("How to generate sales report?")}
              text="Sales report"
            />
          </div>

          {/* Help */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2">
              <HelpCircle className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                General
              </span>
            </div>
            <QuickSuggestionButton 
              theme={theme} 
              onClick={() => handleQuickQuestion("What can you help me with?")}
              text="What can you do?"
            />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-slate-400'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h1 className={`text-base sm:text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  ECOTEC AI
                </h1>
                <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  En • සිං • Singlish
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className={`p-2 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 text-slate-300'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Container - Maximized height */}
        <div className={`flex-1 flex flex-col rounded-xl sm:rounded-2xl border overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/50 border-slate-700/50' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 ${
          theme === 'dark' ? 'bg-slate-900/30' : 'bg-slate-50/50'
        }`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 lg:gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : message.isError
                  ? 'bg-gradient-to-br from-red-500 to-rose-600'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : message.isError ? (
                  <AlertCircle className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message bubble */}
              <div className={`max-w-[75%] lg:max-w-[70%] rounded-2xl px-4 lg:px-5 py-3 lg:py-4 ${
                message.role === 'user'
                  ? theme === 'dark'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : message.isError
                  ? theme === 'dark'
                    ? 'bg-red-900/50 text-red-200 border border-red-700/50'
                    : 'bg-red-50 text-red-700 border border-red-200'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700/50'
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100'
              }`}>
                <div className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">
                  {formatMessage(message.content)}
                </div>
                <p className={`text-[10px] lg:text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-blue-200'
                    : message.isError
                    ? theme === 'dark' ? 'text-red-400' : 'text-red-400'
                    : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 lg:gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className={`rounded-2xl px-4 lg:px-5 py-3 lg:py-4 ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700/50' : 'bg-white shadow-sm border border-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <Loader2 className={`w-5 h-5 animate-spin ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Compact Input Area */}
        <div className={`p-2 sm:p-3 border-t flex-shrink-0 ${
          theme === 'dark' ? 'border-slate-700/50 bg-slate-900/80' : 'border-slate-200 bg-white'
        }`}>
          {/* Language Selector */}
          <div className="flex items-center gap-1 mb-2">
            <Languages className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`text-[10px] mr-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Reply:
            </span>
            <div className={`flex rounded-lg p-0.5 ${theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-100'}`}>
              <button
                onClick={() => setResponseLanguage('auto')}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  responseLanguage === 'auto'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm'
                    : theme === 'dark' 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setResponseLanguage('english')}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  responseLanguage === 'english'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                    : theme === 'dark' 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setResponseLanguage('sinhala')}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  responseLanguage === 'sinhala'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : theme === 'dark' 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                සිංහල
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message... (En/සිං/Singlish)"
              disabled={isLoading}
              className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="relative group w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl overflow-hidden"
            >
              {/* Radiant glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 group-hover:blur-lg transition-all" />
              <div className="absolute inset-[2px] bg-gradient-to-br from-emerald-500 to-blue-600 rounded-[10px]" />
              <Send className="relative w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Quick Suggestion Button Component
interface QuickSuggestionButtonProps {
  theme: 'light' | 'dark';
  onClick: () => void;
  text: string;
}

const QuickSuggestionButton: React.FC<QuickSuggestionButtonProps> = ({ theme, onClick, text }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all truncate ${
      theme === 'dark'
        ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white'
        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
    }`}
  >
    {text}
  </button>
);
