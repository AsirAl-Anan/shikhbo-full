"use client";

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { ChatMessage, InputArea } from "../components/Chat/NewChat/NewChatComponents";
import instance from "../utils/axios";
const axios = instance;
const SOCKET_URL = "http://localhost:8000";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useParams } from "react-router-dom";

function NewChatPage() {
 
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    setIsTyping(true);
  
    if (!chatId) {
      // Emit startChat event if chat not started yet
      socketRef.current.emit("startChat", { prompt: inputValue, userId: currentUser._id });
    } else {
      // Otherwise continue the chat
      socketRef.current.emit("sendMessage", { chatId, prompt: inputValue });
    }
  
    // Push user message instantly to UI (optimistic update)
    const newUserMessage = {
      id: Date.now(), // Temporary ID
      content: inputValue,
      role: "user",
      chatId: chatId, // Will be null initially for new chats
      timestamp: new Date().toISOString(),
      sender: "user"
    };
  
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages; // Update ref as well
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
                <ChatMessage key={message.id || message._id} message={message} />
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