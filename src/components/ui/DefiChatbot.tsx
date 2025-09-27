import React, { useState, useRef, useEffect } from "react";

export interface ParsedRecipient {
  address: string;
  amount: string;
  token: string;
}

interface DefiChatbotProps {
  onBatchSubmit: (batch: ParsedRecipient[]) => Promise<void>;
}

export default function DefiChatbot({ onBatchSubmit }: DefiChatbotProps) {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chat, setChat] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello, welcome to BlockbundlR! How can I assist you with batch transactions today?" }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const addBotMessage = (message: string) => {
    setChat((prev) => [...prev, { sender: "bot", text: message }]);
  };

  const handleSend = async () => {
    const userText = input.trim();
    if (!userText) return;

    setChat((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    addBotMessage("Processing...");

    try {
      const response = await fetch("/api/parse-defi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await response.json();

      // Remove the "Processing..." message
      setChat((prev) => prev.filter((msg) => msg.text !== "Processing..."));

      if (!data.result || !Array.isArray(data.result) || data.result.length === 0) {
        // addBotMessage("❌ Please enter a valid DeFi batch transfer prompt.");
        addBotMessage(
            "❌ Please enter a valid DeFi batch transfer prompt like: transfer X tRTBC to 0x...abc, Y tRTBC to 0x...xyz"
          );
          
        return;
      }

      const jsonText = JSON.stringify(data.result, null, 2);
      addBotMessage(jsonText);

      try {
        await onBatchSubmit(data.result);
        addBotMessage("✅ Transaction Processing! Please wait for Wallet popup!!.");
      } catch (txError: any) {
        addBotMessage(`❌ Transaction failed: ${txError.message || txError}`);
      }
    } catch (error: any) {
      setChat((prev) => prev.filter((msg) => msg.text !== "Processing..."));
      addBotMessage("❌ Unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10 p-4 rounded-xl glass-card max-w-lg mx-auto flex flex-col h-[450px]">
      <div className="mb-3 font-bold text-orange-400 text-center text-lg">Batch Transaction Chatbot</div>

      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-900 rounded-md border border-gray-700">
        {chat.length === 0 && (
          <div className="text-gray-500 text-sm text-center select-none">
            Chat history will appear here...
          </div>
        )}

        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-3 py-2 rounded-lg break-words whitespace-pre-wrap
              ${msg.sender === "user" ? "bg-orange-600 text-white self-end rounded-tr-none" :
              "bg-gray-700 text-green-300 self-start rounded-bl-none"}
            `}
            style={{ wordBreak: "break-word" }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isLoading) handleSend();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          placeholder="Enter DeFi prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`glass-button px-5 py-2 rounded-lg font-semibold
          ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {isLoading ? "Processing..." : "Send"}
        </button>
      </form>
    </div>
  );
}
