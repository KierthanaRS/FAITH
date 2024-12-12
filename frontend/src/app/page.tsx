"use client"
import React, { useState } from "react";
import LeftSidebar from "./components/LeftSideBar";
import RightSidebar from "./components/RightSideBar";
import ChatBox from "./components/ChatBox";
import {useRouter} from "next/navigation";


const ChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<{ sender: string; text: string; metrics?: { hallucinationPercentage: number; reason: string } }[]>([]);
  const [history, setHistory] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "Chat 1" },
    { id: "2", name: "Chat 2" },
  ]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  );
  const [textModels, setTextModels] = useState<string[]>( [
    "Claude 3",
    "Claude 2",
    "Claude 1",
    "Gemini 1",
    "Gemini 1.5",
    "BERT",
    "ALBERT",
    "T5",
    "PaLM 1",
    "PaLM 2",
    "Med-PaLM",
    "LLaMA 2",
    "LLaMA 1",
    "OPT-175B",
    "Command R+",
    "Embed",
    "BLOOM",
    "Flan-T5",
    "Falcon Models",
    "M6-10T",
    "Megatron-Turing NLG",
    "BioMegatron",
    "Jurassic-2 Jumbo",
    "Jurassic-1",
    "Ernie 4.0",
    "Ernie 3.0",
    "ChatGLM-2",
    "ChatGLM-6B",
    "Mistral 7B",
    "Mixtral",
    "RedPajama"
  ]
  );
  const [model, setModel] = useState<string>("gpt-4.0");
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  const handleSend = (message: string) => {
    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botMessage = { sender: "bot", text: "No responses as of now" };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    const metrics= { sender: "bot", text: "", metrics: { hallucinationPercentage: 12, reason: "Inaccurate context provided" } };
    setMessages((prevMessages) => [...prevMessages, metrics]);
  };

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    window.location.reload();
  };

  const handleModelChange = (model: string) => {
    if(model=="Test our model"){
      router.push("/aboutUs")
    }
    setModel(model);
  };

  const handleHistorySelect = (historyId: string) => {
    setSelectedHistoryId(historyId);
    // Optionally load the corresponding messages for the selected history.
    const chatMessages = historyId === "1"
    ? [ { sender: "user", text: "Hello 1" },
      { sender: "bot", text: "Here is your answer..." },
      { sender: "bot", text: "", metrics: { hallucinationPercentage: 12, reason: "Inaccurate context provided" } },]
    : [ { sender: "user", text: "Hello 2" },
      { sender: "bot", text: "Here is your answer..." },
      { sender: "bot", text: "", metrics: { hallucinationPercentage: 12, reason: "Inaccurate context provided" } },];
  setMessages(chatMessages);
  };

  const handleHistoryAdd = () => {
    const newId = String(history.length + 1);
    const newName = `Chat ${newId}`;
    setHistory([...history, { id: newId, name: newName }]);
    setSelectedHistoryId(newId);
  };

  return (
    <div className="flex h-screen">
      <LeftSidebar
        companyName="FAITH"
        models={["gpt-4.0", "gpt-3.5", "Test our model","Use other model"]}
        history={history}
        user={{
          avatar: "https://via.placeholder.com/150",
          name: "Jane Doe",
          email: "jane.doe@example.com",
        }}
        isLoggedIn={loggedIn}
        onModelChange={handleModelChange}
        onHistorySelect={handleHistorySelect}
        onHistoryAdd={handleHistoryAdd}
        selectedHistoryId={selectedHistoryId}
        onLogoutClick={handleLogout}
        onLoginClick={handleLogin}
      />
      <div className="flex-1">
        <ChatBox messages={messages} onSend={handleSend} model={model} otherModels={textModels} />
      </div>
      <RightSidebar
        modelName={model}
        stats={{
          totalPrompts: 150,
          falsePositives: 5,
          falseNegatives: 2,
          hallucinationPercentage: 12,
        }}
        onDetailedAnalyticsClick={() => {router.push("/dashboard")}}

      />
    </div>
  );
};

export default ChatPage;
