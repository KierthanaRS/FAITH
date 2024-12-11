import React, { useState } from "react";

interface ChatBoxProps {
  messages: { sender: string; text: string; metrics?: { hallucinationPercentage: number; reason: string } }[];
  onSend: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 p-4 overflow-y-auto text-white inline-block custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 mb-5 ${
              msg.sender === "user"
                ? "flex justify-end bg-userBubble max-w-[50%] ml-auto rounded-lg"
                : "justify-start bg-aiBubble max-w-[70%] mr-auto rounded-lg"
            }`}
          >
            {msg.text && <span>{msg.text}</span>}
            {msg.metrics && (
              <div className="bg-metrics p-3 mt-2 rounded-lg">
                <p className="text-sm text-white">
                  Hallucination: {msg.metrics.hallucinationPercentage}%
                </p>
                <p className="text-sm text-white">
                  Reason: {msg.metrics.reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-background flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 bg-userBubble rounded-md text-white"
        />
        <button
          onClick={handleSend}
          className="ml-4 bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
