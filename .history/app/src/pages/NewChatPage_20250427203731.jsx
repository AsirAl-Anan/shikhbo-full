"use client";

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client"; // ✅ import socket.io-client

import { ChatMessage, InputArea } from "../components/Chat/NewChat/NewChatComponents";

const SOCKET_URL = "http://localhost:8000"; // 🔥 Your backend URL here

function NewChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server:", socketRef.current.id);
    });

    // Listening for chat started (first message)
    socketRef.current.on("chatStarted", ({ chatId, messages }) => {
      setChatId(chatId);
      setMessages(messages);
      setIsTyping(false);
    });

    // Listening for next messages
    socketRef.current.on("messageReceived", ({ messages }) => {
      setMessages(messages);
      setIsTyping(false);
    });

    socketRef.current.on("error", ({ message }) => {
      console.error(message);
      setIsTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsTyping(true);

    if (!chatId) {
      // Emit startChat event if chat not started yet
      socketRef.current.emit("startChat", { prompt: inputValue });
    } else {
      // Otherwise continue the chat
      socketRef.current.emit("sendMessage", { chatId, prompt: inputValue });
    }

    // Push user message instantly to UI
    const newUserMessage = {
      id: Date.now(),
      content: inputValue,
      role: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E] text-white">
      {!hasMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold mb-8">What can I help with?</h1>
          <div className="w-full max-w-2xl px-4">
            <InputArea
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto p-4 flex flex-col">
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs">AI</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>
          <div className="p-4">
            <InputArea
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default NewChatPage;
