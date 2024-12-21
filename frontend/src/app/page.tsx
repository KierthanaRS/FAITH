"use client";
import React, { useState, useEffect } from "react";
import LeftSidebar from "./components/LeftSideBar";
import RightSidebar from "./components/RightSideBar";
import ChatBox from "./components/ChatBox";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ChatPage = () => {
  const router = useRouter();
  const [modelChanged, setModelChanged] = useState(false);
  const [modelSelection, setModelSelection] = useState("");
  const [messages, setMessages] = useState<
    {
      sender: string;
      text: string;
      metrics?: { hallucinationPercentage: number; reason: string };
    }[]
  >([]);
  const [history, setHistory] = useState<
    {
      id: string;
      name: string;
      messages: {
        usermsg: string;
        botmsg: string;
        metrics?: { hallucinationPercentage: number; reason: string };
      }[];
    }[]
  >([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  );
  interface Chat {
    modelName: string;
    chat: {
      chatid: string;
      chatName: string;
      messages: {
        usermsg: string;
        botmsg: string;
        metrics?: {
          hallucinationPercentage: number;
          reason: string;
        };
      }[];
    }[];
  }

  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  interface Analytics {
    modelName: string;
    promptCount: number;
    hallucinationCount: Record<string, number>;
    violenceMetricsCount: Record<string, number>;
    sexualMetricsCount: Record<string, number>;
    selfHarmMetricsCount: Record<string, number>;
    hateUnfairnessMetricsCount: Record<string, number>;
  }

  const [analytics, setAnalytics] = useState<Analytics[] | null>(null);
  // const dummyUser = {
  //   id: "675af187fc14f57242759769",
  //   avatar:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyWLjkYKGswBE2f9mynFkd8oPT1W4Gx8RpDQ&s",
  //   name: "John Doe",
  //   email: "johndoe@contoso.com",
  // };

  interface User {
    id: string;
    avatar: string;
    name: string;
    email: string;
  }

  const [user, setUser] = useState<User>({
    id: "",
    avatar: "",
    name: "",
    email: "",
  });
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [textModels] = useState<string[]>([
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
    const fetchData = async () => {
      try {
        // Check if the user is authenticated by validating the JWT in the cookies
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/validate_token`,
          {
            method: "GET",
            credentials: "include", // Include cookies in the request
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLoggedIn(true);
          setUser(data.user);
          if (data.user && allChats.length === 0) {
            fetchChats(data.user.id);
          }
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.log("Error validating token:", error);
        setLoggedIn(false);
      }

      fetchAnalytics();
    };

    fetchData();
  }, [loggedIn]);

  useEffect(() => {
    if (allChats.length > 0) {
      updateHistoryForModel(model);
    }
  }, [model]);

  // Fetch chats from the backend
  const fetchChats = async (userid: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/getChats/${userid}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setAllChats(data[0]?.chat || []);
        updateHistoryForModel(model, data[0]?.chat); // Initialize history for the current model
      } else {
        setHistory([]);
        setMessages([]);
      }
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/`
      );
      const data = await response.json();
      setAnalytics(data.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  // Update history and messages based on the selected model
  const updateHistoryForModel = (selectedModel: string, chats = allChats) => {
    let filteredChats: Chat[] = [];

    if (selectedModel === "Use other model") {
      filteredChats = [];
    } else {
      // Filter only for the selected model
      filteredChats = chats.filter(
        (chat: Chat) => chat.modelName === selectedModel
      );
    }

    // Flatten chats to retrieve the messages
    const chatHistory = filteredChats.flatMap((model: Chat) =>
      model.chat.map(
        (c: {
          chatid: string;
          chatName: string;
          messages: {
            usermsg: string;
            botmsg: string;
            metrics?: { hallucinationPercentage: number; reason: string };
          }[];
        }) => ({
          id: c.chatid,
          name: c.chatName,
          messages: c.messages,
        })
      )
    );

    setHistory(chatHistory);

    if (!modelChanged) {
      const selectedChat = history.find(
        (chat) => chat.id === selectedHistoryId
      );
      if (selectedChat) {
        const userMessages = selectedChat.messages.flatMap((msg) => [
          { sender: "user", text: msg.usermsg },
          { sender: "bot", text: msg.botmsg, metrics: msg.metrics },
        ]);
        setMessages(userMessages);
      }
    }
    if (modelChanged) {
      setSelectedHistoryId(null);
      setMessages([]);
      setModelChanged(false);
    }
    // setSelectedHistoryId(null);
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
    const timestamp = date.toISOString().replace(/[-:.]/g, "");
    const randomName = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomName}`;
  };
  const createChat = async (message: string, model: string) => {
    const id = generateUniqueId(); // Generate a unique ID
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bots/create-chat`;

    try {
      // Call the backend API
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          model: model,
        }),
      });

      // Parse the JSON response
      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      return { chatId: id, chatName: data.chat_name };
    } catch (error) {
      console.log("Error creating chat:", error);
      throw error;
    }
  };

  const generateResponse = async (message: string, model: string) => {
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bots/generate-response`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          model: model,
        }),
      });

      // Parse the JSON response
      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();
      return {
        bot_response: data.bot_response,
        hallucination: data.hallucination.groundedness,
        reason: data.hallucination.groundedness_reason,
      };
    } catch (error) {
      console.log("Error generating response", error);
      throw error;
    }
  };
  const handleSend = async (message: string) => {
    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botMessage = { sender: "bot", text: "Thinking...." };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setIsFetching(true);

    try {
      // Find the selected chat from history
      const selectedChat = history.find(
        (chat) => chat.id === selectedHistoryId
      );

      // Variables for chat ID and name
      let id = selectedChat?.id;
      let name = selectedChat?.name;
      let flag = false;
      let newid = null;
      if (!selectedChat || selectedHistoryId == null) {
        // Create a new chat if none is selected
        const chatData = await createChat(message, "gpt-4o-mini");
        id = chatData.chatId;
        name = chatData.chatName
          .replace(" ", "")
          .replace('"', "")
          .replace('"', "");
        flag = true;
        newid = id;
      }

      const { bot_response, hallucination, reason } = await generateResponse(
        message,
        model
      );
      const halluciantionNumber = Math.floor(hallucination);
      const newMessage = {
        usermsg: message,
        botmsg: bot_response,
        metrics: {
          hallucinationPercentage: halluciantionNumber,
          reason: reason,
        },
      };

      if (loggedIn) {
        const payload = {
          userid: user.id,
          chat: [
            {
              modelName: model,
              chat: [
                {
                  chatid: id, // Use chatid from selected history
                  chatName: name, // Use chatName from selected history
                  messages: [newMessage], // Append new message
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
          if (flag) {
            fetchChats(user.id);
            setSelectedHistoryId(newid);
          }
          const updatedBotMessage = {
            sender: "bot",
            text: bot_response,
            metrics: newMessage.metrics,
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
      } else {
        const updatedBotMessage = {
          sender: "bot",
          text: bot_response,
          metrics: newMessage.metrics,
        };

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove placeholder bot message
          updatedBotMessage,
        ]);
      }
    } catch (error) {
      console.log("Error:", error);

      const errorBotMessage = {
        sender: "bot",
        text: "We are currently being rate limited due to high traffic. We deeply regret the inconvenience caused. Please try again after some time.",
      };

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        errorBotMessage,
      ]);
    } finally {
      setIsFetching(false);
      fetchAnalytics();
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setLoggedIn(false);
    setHistory([]);
    setMessages([]);
    setAllChats([]);
  };

  const handleModelChange = (selectedModel: string) => {
    if (selectedModel === "Test our model") {
      router.push("/aboutUs");
    }
    setModel(selectedModel);
    setModelChanged(true);
  };

  return (
    <div className="flex h-screen">
      <LeftSidebar
        companyName="FAITH"
        models={[
          "gpt-4o-mini",
          "gpt-4o",
          "gpt-4",
          "gpt-35-turbo-16k",
          "Test our model",
          "Use other model",
        ]}
        history={history}
        model={model}
        user={user}
        isLoggedIn={loggedIn}
        onModelChange={handleModelChange}
        onHistorySelect={handleHistorySelect}
        onHistoryAdd={() => {
          setSelectedHistoryId(null);
          setMessages([]);
        }}
        selectedHistoryId={selectedHistoryId}
        onLogoutClick={handleLogout}
        onLoginClick={handleLogin}
      />
      <div className="flex-1">
        <ChatBox
          messages={messages}
          onSend={handleSend}
          model={model}
          otherModels={textModels}
          historyId={selectedHistoryId}
          user={user}
          fetching={isFetching}
          modelSelection={modelSelection}
          setModelSelection={setModelSelection}
        />
      </div>
      <RightSidebar
        modelName={model}
        modelSelection={modelSelection}
        analytics={analytics}
        onDetailedAnalyticsClick={() => {
          router.push("/dashboard");
        }}
      />
    </div>
  );
};

export default ChatPage;
