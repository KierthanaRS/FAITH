import React, { useState } from 'react';

interface ChatBoxProps {
  messages: { sender: string; text: string }[];
  onSend: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 p-4 overflow-y-auto text-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-5 ${msg.sender === 'user' ? 'text-right bg-userBubble w-[50%] ml-[50%]' : 'text-left bg-aiBubble w-[70%]'}`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-background flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 bg-userBubble rounded-md text-white"
        />
        <button onClick={handleSend} className="ml-4 bg-gray-700 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
