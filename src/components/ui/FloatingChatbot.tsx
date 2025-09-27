import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, Zap } from "lucide-react";
import DefiChatbot, { ParsedRecipient } from "./DefiChatbot";

interface FloatingChatbotProps {
  onBatchSubmit: (batch: ParsedRecipient[]) => Promise<void>;
}

export default function FloatingChatbot({ onBatchSubmit }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-show notification after a delay (simulating a helpful prompt)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (hasNewMessage) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(20px) scale(0.8); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes spinSparkle {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateY(-20px); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateY(-20px); opacity: 0; }
        }
        
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-fade-in-delayed { animation: fadeIn 0.3s ease-out 0.2s both; }
        .animate-slide-in-left { animation: slideInLeft 0.3s ease-out; }
        .animate-slide-in-up { animation: slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slide-down { animation: slideDown 0.3s ease-out 0.1s both; }
        .animate-pulse-ring { animation: pulseRing 2s infinite 0.5s; }
        .animate-pulse-ring-delayed { animation: pulseRing 2s infinite 1s; }
        .animate-spin-sparkle { animation: spinSparkle 1.5s infinite; }
        .animate-message-in { animation: messageIn 0.3s ease-out both; }
      `}</style>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transform hover:scale-105 active:scale-95 transition-transform duration-200">
        <button
          onClick={toggleChatbot}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-2xl shadow-2xl shadow-orange-500/30 flex items-center justify-center group transition-all duration-300 border border-orange-400/20 hover:shadow-orange-500/40 hover:border-orange-400/60"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Notification badge */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-fade-in">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Sparkles animation */}
          {isHovered && (
            <div className="absolute inset-0 animate-fade-in">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 animate-spin-sparkle"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-20px)`
                  }}
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </div>
              ))}
            </div>
          )}

          {/* Main icon */}
          <div
            className={`relative z-10 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Bot className="w-7 h-7 text-white" />
            )}
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-0 border-2 border-orange-400 rounded-2xl animate-pulse-ring opacity-30"></div>
          <div className="absolute inset-0 border border-orange-400 rounded-2xl animate-pulse-ring-delayed opacity-20"></div>
        </button>

        {/* Tooltip */}
        {isHovered && !isOpen && (
          <div className="absolute right-16 sm:right-20 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl whitespace-nowrap animate-slide-in-left hidden sm:block">
            <div className="text-sm text-white font-medium">
              AI Batch Assistant
            </div>
            <div className="text-xs text-gray-400">
              Click to start chatting
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Enhanced Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center sm:items-end sm:justify-end p-4 sm:p-6 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={toggleChatbot}
          />

          {/* Chatbot Container */}
          <div className="relative w-full max-w-sm sm:w-96 h-[90vh] max-h-[500px] sm:h-[600px] sm:mr-20 sm:mb-20 animate-slide-in-up">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-3xl blur-2xl scale-105"></div>

            {/* Main chatbot container */}
            <div className="relative bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-b border-gray-700/50 p-4 animate-slide-down">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI Batch Assistant</h3>
                      <p className="text-xs text-gray-400">Online • Ready to help</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleChatbot}
                    className="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Enhanced DefiChatbot */}
              <div className="h-[calc(90vh-160px)] max-h-[420px] sm:h-[520px] flex flex-col animate-fade-in-delayed">
                <EnhancedDefiChatbot onBatchSubmit={onBatchSubmit} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Enhanced version of DefiChatbot with better styling
function EnhancedDefiChatbot({ onBatchSubmit }: { onBatchSubmit: (batch: ParsedRecipient[]) => Promise<void> }) {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<{ sender: "user" | "bot"; text: string; timestamp: Date }[]>([
    {
      sender: "bot",
      text: "👋 Welcome to BlockBundlR! I'm your AI assistant for batch transactions. Try saying: 'Send 0.1 tRBTC to 0x123...abc and 0.2 tRBTC to 0x456...def'",
      timestamp: new Date()
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const addBotMessage = (message: string) => {
    setChat((prev) => [...prev, { sender: "bot", text: message, timestamp: new Date() }]);
  };

  const handleSend = async () => {
    const userText = input.trim();
    if (!userText) return;

    setChat((prev) => [...prev, { sender: "user", text: userText, timestamp: new Date() }]);
    setInput("");
    setIsLoading(true);

    const processingMessage = { sender: "bot" as const, text: "🔄 Processing your request...", timestamp: new Date() };
    setChat((prev) => [...prev, processingMessage]);

    try {
      const response = await fetch("/api/parse-defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await response.json();

      // Remove processing message
      setChat((prev) => prev.filter((msg) => !msg.text.includes("🔄 Processing")));

      if (!data.result || !Array.isArray(data.result) || data.result.length === 0) {
        addBotMessage("❌ I couldn't parse that request. Please try something like:\n\n'Send 0.1 tRBTC to 0x123...abc and 0.2 tRBTC to 0x456...def'");
        return;
      }

      const jsonText = `✅ Parsed ${data.result.length} transaction(s):\n\n${JSON.stringify(data.result, null, 2)}`;
      addBotMessage(jsonText);

      try {
        await onBatchSubmit(data.result);
        addBotMessage("🚀 Transaction submitted! Check your wallet for confirmation.");
      } catch (txError: any) {
        addBotMessage(`❌ Transaction failed: ${txError.message || txError}`);
      }
    } catch (error: any) {
      setChat((prev) => prev.filter((msg) => !msg.text.includes("🔄 Processing")));
      addBotMessage("❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-message-in`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl break-words whitespace-pre-wrap relative
                ${msg.sender === "user"
                  ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-md shadow-lg shadow-orange-500/20"
                  : "bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-md shadow-lg"
                }
              `}
            >
              {msg.sender === "bot" && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">AI Assistant</span>
                </div>
              )}
              <div className="text-sm leading-relaxed">{msg.text}</div>
              <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-orange-200" : "text-gray-500"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) handleSend();
          }}
          className="flex space-x-3"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
              placeholder="Type your batch request..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 ${!isLoading && input.trim() ? "shadow-orange-500/20" : ""
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["Send to 2 addresses", "Batch 5 transfers", "Help"].map((suggestion, idx) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full text-gray-300 transition-colors animate-fade-in hover:scale-105"
              style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}