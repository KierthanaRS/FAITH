"use client";
import React, { useState, useEffect } from "react";
import LeftSidebar from "./components/LeftSideBar";
import RightSidebar from "./components/RightSideBar";
import ChatBox from "./components/ChatBox";
import { useRouter } from "next/navigation";

const ChatPage = () => {
  const router = useRouter();

  const [messages, setMessages] = useState<
    { sender: string; text: string; metrics?: { hallucinationPercentage: number; reason: string } }[]
  >([]);
  const [history, setHistory] = useState<{ id: string; name: string; messages: any[] }[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<any[]>([]); // Store all fetched chat data

  const dummyUser = {
    id: "675af187fc14f57242759769",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyWLjkYKGswBE2f9mynFkd8oPT1W4Gx8RpDQ&s",
    name: "John Doe",
    email: "johndoe@contoso.com",
  };

  const [user, setUser] = useState<any>(dummyUser);
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const [textModels, setTextModels] = useState<string[]>([
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
    "RedPajama",
  ]);


  useEffect(() => {
    if (loggedIn && user && allChats.length === 0) {
      fetchChats(user.id); // Fetch only once if not already fetched
    }
  }, [loggedIn, user]);

  useEffect(() => {
    if (allChats.length > 0) {
      updateHistoryForModel(model);
    }
  }, [model, allChats]);

  // Fetch chats from the backend
  const fetchChats = async (userid: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/getChats/${userid}`);
      const data = await response.json();

      if (data && data.length > 0) {
        setAllChats(data[0]?.chat || []); // Store all chat data
        updateHistoryForModel(model, data[0]?.chat); // Initialize history for the current model
      } else {
        setHistory([]);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Update history and messages based on the selected model
  const updateHistoryForModel = (selectedModel: string, chats = allChats) => {
    let filteredChats = [];
  
    if (selectedModel === "Use other model") {
       filteredChats=[];
    } else {
      // Filter only for the selected model
      filteredChats = chats.filter((chat: any) => chat.modelName === selectedModel);
    }
  
    // Flatten chats to retrieve the messages
    const chatHistory = filteredChats.flatMap((model: any) =>
      model.chat.map((c: any) => ({
        id: c.chatid,
        name: c.chatName,
        messages: c.messages, // These messages include usermsg and botmsg
      }))
    );
  
    setHistory(chatHistory);
  
    // Automatically display all messages for "Use other model"
    if (selectedModel === "Use other model") {
      const allOtherModelMessages = chatHistory.flatMap((chat) =>
        chat.messages.flatMap((msg: any) => [
          { sender: "user", text: msg.usermsg },
          { sender: "bot", text: msg.botmsg, metrics: msg.metrics },
        ])
      );
      setMessages(allOtherModelMessages);
    } else {
      setMessages([]);
    }
  
    setSelectedHistoryId(null);
  };
  

  const handleHistorySelect = (historyId: string) => {
    setSelectedHistoryId(historyId);
    const selectedChat = history.find((chat) => chat.id === historyId);
    if (selectedChat) {
      const userMessages = selectedChat.messages.flatMap((msg) => [
        { sender: "user", text: msg.usermsg },
        { sender: "bot", text: msg.botmsg, metrics: msg.metrics },
      ]);
      setMessages(userMessages);
    }
  };
  const generateUniqueId = () => {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[-:.]/g, ''); 
    const randomName = Math.random().toString(36).substring(2, 8); 
  };
  // Handle sending a message
  const handleSend =async (message: string) => {
    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botMessage = { sender: "bot", text: "Thinking...." };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    try {
      // Find the selected chat from history
      const selectedChat = history.find((chat) => chat.id === selectedHistoryId);
  
      if (!selectedChat) {
        console.error("No chat selected to update");
        return;
      }
  
      // Prepare new message to send
      const newMessage = {
        usermsg: message,
        botmsg: "This is a placeholder response from the bot.",
        metrics: {
          hallucinationPercentage: 12,
          reason: "Response needs more context.",
        },
      };
  
      // Construct payload
      const payload = {
        userid: user.id,
        chat: [
          {
            modelName: model,
            chat: [
              {
                chatid: selectedChat.id, // Use chatid from selected history
                chatName: selectedChat.name, // Use chatName from selected history
                messages: [...selectedChat.messages, newMessage], // Append new message
              },
            ],
          },
        ],
      };
  
      // POST request to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/addchats`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
  
        // Update bot message with actual response
        const updatedBotMessage = {
          sender: "bot",
          text: responseData.botResponse || "Success!",
          metrics: responseData.metrics || { hallucinationPercentage: 12, reason: "Generic response" },
        };
  
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove placeholder bot message
          updatedBotMessage,
        ]);
  
        // Update local history state
        const updatedHistory = history.map((chat) =>
          chat.id === selectedHistoryId
            ? {
                ...chat,
                messages: [...chat.messages, newMessage], // Append new message
              }
            : chat
        );
        setHistory(updatedHistory);
      } else {
        throw new Error("Failed to send chat data");
      }
    } catch (error) {
      console.error("Error:", error);
  
      const errorBotMessage = {
        sender: "bot",
        text: "An error occurred. Please try again.",
      };
  
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        errorBotMessage,
      ]);
    }
  };

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    window.location.reload();
  };

  const handleModelChange = (selectedModel: string) => {
    if (selectedModel === "Test our model") {
      router.push("/aboutUs");
    }
    setModel(selectedModel); 
  };
 
  return (
    <div className="flex h-screen">
      <LeftSidebar
        companyName="FAITH"
        models={["gpt-4o-mini", "gpt-4o", "gpt-4", "gpt-35-turbo-16k", "Test our model", "Use other model"]}
        history={history}
        model={model}
        user={user}
        isLoggedIn={loggedIn}
        onModelChange={handleModelChange}
        onHistorySelect={handleHistorySelect}
        onHistoryAdd={() => {
          setSelectedHistoryId(null)
          setMessages([])
        }}
        selectedHistoryId={selectedHistoryId}
        onLogoutClick={handleLogout}
        onLoginClick={handleLogin}
      />
      <div className="flex-1">
        <ChatBox messages={messages} onSend={handleSend} model={model} otherModels={textModels} historyId={selectedHistoryId} user={user}/>
      </div>
      <RightSidebar
        modelName={model}
        stats={{
          totalPrompts: 150,
          falsePositives: 5,
          falseNegatives: 2,
          hallucinationPercentage: 12,
        }}
        onDetailedAnalyticsClick={() => {
          router.push("/dashboard");
        }}
      />
    </div>
  );
};

export default ChatPage;
