// src/pages/Chat/Chat.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../context/UserContext";
import ChatInput from "./ChatInput";
import { ShikhboIcon } from "../assets/ShihkboLogo";

const ChatPage = () => {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const currentUser = useContext(AuthContext)?.currentUser || null;
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  
  // Connect to socket when component mounts
  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/auth";
      return;
    }

    // Initialize socket connection
    socketRef.current = io("http://localhost:8000");
    
    // Join the chat room
    socketRef.current.emit("join_chat", chatId);
    
    // Fetch chat history
    fetchChatHistory();
    
    // Socket event listeners
    socketRef.current.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsTyping(false);
    });
    
    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
      alert("An error occurred: " + error.message);
    });
    
    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_chat", chatId);
        socketRef.current.disconnect();
      }
    };
  }, [chatId, currentUser]);
  
  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Fetch chat history from API
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send a text message
  const sendMessage = (content) => {
    if (!content.trim()) return;
    
    const message = {
      sender: "user",
      content,
      timestamp: new Date(),
    };
    
    // Add message to UI immediately (optimistic UI)
    setMessages((prevMessages) => [...prevMessages, message]);
    
    // Indicate AI is typing
    setIsTyping(true);
    
    // Send message via socket
    socketRef.current.emit("send_message", {
      chatId,
      message,
    });
  };
  
  // Send a message with image
  const sendImageMessage = (content, imageUrl) => {
    const message = {
      sender: "user",
      content,
      image: imageUrl,
      timestamp: new Date(),
    };
    
    // Add message to UI immediately (optimistic UI)
    setMessages((prevMessages) => [...prevMessages, message]);
    
    // Indicate AI is typing
    setIsTyping(true);
    
    // Send message via socket
    socketRef.current.emit("send_image_message", {
      chatId,
      message,
      imageUrl,
    });
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - same as HomePage */}
      <div 
        className={`
          fixed md:relative z-20 h-full border-r border-gray-800 
          flex flex-col bg-black transition-all duration-300 ease-in-out
          ${isMobile 
            ? `${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'} overflow-hidden`
            : `${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`
          }
        `}
      >
        {/* Sidebar content - simplified for this example */}
        <div className={`w-64 ${(!isSidebarOpen && !isMobile) ? 'invisible' : 'visible'}`}>
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <ShikhboIcon className="h-8 w-8"/>
              <h1 className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-purple-600 to-pink-500">ShikhZy</h1>
            </div>
            {isMobile && (
              <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Simplified sidebar navigation */}
          <nav className="p-4 flex-1 overflow-y-auto">
            <a href="/chat/new" className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </a>
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {currentUser?.username?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm">{currentUser?.username || "User"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center">
            {/* Hamburger menu button */}
            <button onClick={toggleSidebar} className="mr-4 text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI Chat</h1>
              <p className="text-gray-400">{chatId}</p>
            </div>
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p>Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          msg.sender === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-800 text-white"
                        }`}
                      >
                        {msg.image && (
                          <div className="mb-2">
                            <img
                              src={msg.image}
                              alt="User uploaded"
                              className="rounded-lg max-h-60 w-auto"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 text-right mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 rounded-lg p-4 max-w-[75%]">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-black">
          <ChatInput 
            onSendMessage={sendMessage} 
            onSendImageMessage={sendImageMessage} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;