"use client";

import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { ChatMessage, InputArea } from "../components/Chat/NewChat/NewChatComponents";
import instance from "../utils/axios";
const axios = instance;
const SOCKET_URL = "http://localhost:8000";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useParams } from "react-router-dom";

function NewChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: paramChatId } = useParams();
  
  // Keep a reference to the full message history
  const messagesRef = useRef([]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 

  useEffect(() => {
    if (paramChatId !== undefined && paramChatId !== null && paramChatId !== "null") { 
     
      const fetchChat = async () => {
        console.log("Fetching existing chat with ID:", paramChatId);
        console.log("old")
        try {
          const res = await axios.post(
            `/ai/chat/getChat`, 
            { chatId: paramChatId }, 
            { withCredentials: true }
          );
          console.log("Fetched chat data:", res.data);
          setMessages(res.data.messages);
          messagesRef.current = res.data.messages; // Store in ref for persistence
          setChatId(paramChatId);
        } catch (error) {
          console.error("Failed to fetch existing chat:", error);
        }
      };
      fetchChat();
    }
  }, [paramChatId]);


  useEffect(() => {
    if (!paramChatId && messages.length > 0) {
      console.log("Navigating to chatId:", messages[0]?.chatId);
      console.log("new chat")
      console.log(messages[0])
      navigate(`/${messages[0]?.chatId}`);
    }
    scrollToBottom();
  }, [messages, navigate, paramChatId]); //problem

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  
    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server:", socketRef.current.id);
    });
  
    // Listening for chat started (first message)
    socketRef.current.on("chatStarted", ({ chatId, messages: newMessages }) => {
      // Don't navigate yet, just set the chatId and messages
      setChatId(chatId);
      setMessages(newMessages);
      messagesRef.current = newMessages; // Update ref
      console.log("Chat started with ID:", chatId);
      // After receiving the chatId from the backend, navigate to the chat page
      navigate(`/${chatId}`);
      
      setIsTyping(false);
    });
  
    // Modified messageReceived event handler
    socketRef.current.on("messageReceived", ({ messages: receivedMessages }) => {
      // Extract chatId from the first message if available
      const receivedChatId = receivedMessages[0]?.chatId;
      
      if (receivedChatId && receivedChatId === paramChatId) {
        // We're in an existing chat - need to preserve history
        const newMessages = [...messagesRef.current];
        receivedMessages.forEach(receivedMsg => {
          const msgExists = newMessages.some(
            existingMsg => (existingMsg._id || existingMsg.id) === (receivedMsg._id || receivedMsg.id)
          );
          
          if (!msgExists) {
            newMessages.push(receivedMsg);
          }
        });
        
        // Update both state and ref
        setMessages(newMessages);
        messagesRef.current = newMessages;
      } else {
        // New chat or different chat - use the full set of messages
        setMessages(receivedMessages);
        messagesRef.current = receivedMessages;
      }
      
      setIsTyping(false);
    });
  
    socketRef.current.on("error", ({ message }) => {
      console.error(message);
      setIsTyping(false);
    });
  
    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate,paramChatId]); // Only re-run if navigate changes
  
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
      chatId: chatId, // Will be null initially
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