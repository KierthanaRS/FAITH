import React, { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface ChatBoxProps {
  messages: { sender: string; text: string; metrics?: { hallucinationPercentage: number; reason: string } }[];
  onSend: (message: string) => void;
  model: string;
  otherModels: string[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSend, model, otherModels }) => {
  const [input, setInput] = useState("");
  const [display, setDisplay] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [modelSelection, setModelSelection] = useState("");
  const [customMessages, setCustomMessages] = useState<
    { sender: string; text: string; metrics?: { hallucinationPercentage: number; reason: string } }[]
  >([]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();  
    if(!modelSelection.trim() || !query.trim() || !response.trim()) {
      alert("Please fill all the fields");
      return;
    }
    if (query.trim() && response.trim()) {
      
      const userMessage = { sender: "user", text: query };
      setCustomMessages((prevMessages) => [...prevMessages, userMessage]);

     
      const botMessage = { sender: "bot", text: response };
      setCustomMessages((prevMessages) => [...prevMessages, botMessage]);

     
      const metrics = {
        sender: "bot",
        text: "",
        metrics: { hallucinationPercentage: 12, reason: "Inaccurate context provided" },
      };
      setCustomMessages((prevMessages) => [...prevMessages, metrics]);

      setModelSelection("");
      setQuery("");
      setResponse("");
    }
  };

  useEffect(() => {
    if (model === "Use other model") {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  }, [model]);

  return (
    <div className="flex flex-col h-full bg-background text-text">
      {display ? (
        <div className="p-4 bg-background flex flex-col h-full gap-4">
        <form  className="flex flex-col flex-1 space-y-4">
          {/* Model Selection */}
          <div>
          <label className="block font-semibold mb-2 relative">
              Model
              <IoMdInformationCircleOutline className="ml-[3.5rem] mt-[-2%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
                Select the model used for the query.
              </span>
            </label>
            < select className="block font-semibold mb-2 relative w-full p-2 bg-background rounded-md text-white  border border-gray-600 focus:outline-none"
             onChange={(e) =>setModelSelection(e.target.value)}
            >
              <option value="">Select a model</option>
              {otherModels.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            
            </select>
          </div>
          {/* Query */}
          <div>
            <label className="block font-semibold mb-2 relative">
              Prompt
              <IoMdInformationCircleOutline className="ml-[4rem] mt-[-2%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-background text-white text-sm rounded">
                Provide the prompt given to the model.
              </span>
            </label>
            <input
              type="text"
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white mt-2"
              placeholder="Enter your query"
              required
            />
          </div>
  
          {/* Response */}
          <div>
            <label className="block font-semibold mb-2 relative">
              Response
              <IoMdInformationCircleOutline className="ml-[5rem] mt-[-2%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
                Provide the AI-generated response to analyze.
              </span>
            </label>
            <textarea
              name="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white mt-2"
              rows={3}
              placeholder="Enter the response"
              required
            ></textarea>
          </div>
          </form>
  
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {customMessages.map((msg, index) => (
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
                    <p className="text-sm">{`Hallucination: ${msg.metrics.hallucinationPercentage}%`}</p>
                    <p className="text-sm">{`Reason: ${msg.metrics.reason}`}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
  
          {/* Submit Button */}
          <div className="mt-4">
            <button
            onClick={handleCustomSubmit}
              type="submit"
              className="w-full p-2 bg-gray-700 text-white font-bold hover:bg-gray-800 rounded-lg"
            >
              Submit
            </button>
          </div>
        
      </div>
      ) : (
        <>
          <div className="flex-1 p-4 overflow-y-auto inline-block custom-scrollbar">
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
                    <p className="text-sm">{`Hallucination: ${msg.metrics.hallucinationPercentage}%`}</p>
                    <p className="text-sm">{`Reason: ${msg.metrics.reason}`}</p>
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
              className="ml-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Send
            </button>
          </div>
        </>

      )}
        
    </div>
  );
};

export default ChatBox;
