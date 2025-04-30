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
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatName, setChatName] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: paramChatId } = useParams();
  const location = useLocation();
  const pendingQueryProcessed = useRef(false);
  
  // Keep a reference to the full message history
  const messagesRef = useRef([]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Handle direct submission from ChatModal when arriving at /new
  useEffect(() => {
    if (location.pathname === "/new" && !pendingQueryProcessed.current) {
      const pendingQuery = localStorage.getItem('chatModalQuery');
      const isPending = localStorage.getItem('chatModalPending') === 'true';
      
      if (pendingQuery && isPending && socketRef.current && socketRef.current.connected) {
        pendingQueryProcessed.current = true; // Mark as processed to prevent duplicate submissions
        
        // Create and display the user message immediately
        const newUserMessage = {
          id: Date.now(),
          content: pendingQuery,
          role: "user",
          chatId: null,
          timestamp: new Date().toISOString(),
          sender: "user"
        };
        
        setMessages([newUserMessage]);
        messagesRef.current = [newUserMessage];
        
        // Submit the query directly
        submitQueryDirectly(pendingQuery);
        
        // Clear the pending query from localStorage
        localStorage.removeItem('chatModalQuery');
        localStorage.removeItem('chatModalPending');
      }
    }
  }, [location.pathname, socketRef.current?.connected]);
  
  // This function handles direct submission from ChatModal
  const submitQueryDirectly = (query) => {
    if (!query.trim()) return;
    
    setIsTyping(true);
    
    // Emit startChat event since this will always be a new chat
    socketRef.current.emit("startChat", { prompt: query, userId: currentUser._id });
  };
  
  // Reset state when navigating to /new
  useEffect(() => {
    // Check if we're at the /new route
    if (location.pathname === "/new") {
      console.log("Resetting state for new chat");
      
      // Only reset if we don't have a pending query from ChatModal
      const isPending = localStorage.getItem('chatModalPending') === 'true';
      if (!isPending) {
        setMessages([]);
        messagesRef.current = [];
        setChatId(null);
        setChatName(null); // Reset chat name
        setShouldNavigate(false);
        pendingQueryProcessed.current = false;
      }
    }
  }, [location.pathname]);
  
  useEffect(() => {
    if (paramChatId !== undefined && paramChatId !== null && paramChatId !== "null") { 
      const fetchChat = async () => {
        console.log("Fetching existing chat with ID:", paramChatId);
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
          
          // Set chat name if it exists in the response
          if (res.data.chat && res.data.chat.chatName) {
            setChatName(res.data.chat.chatName);
            console.log("Chat name:", res.data.chat.chatName);
          }
          
          // Clear any pending query data since we're loading an existing chat
          localStorage.removeItem('chatModalQuery');
          localStorage.removeItem('chatModalPending');
          pendingQueryProcessed.current = false;
        } catch (error) {
          console.error("Failed to fetch existing chat:", error);
        }
      };
      fetchChat();
    }
  }, [paramChatId]);
  
  // Only handle navigation when shouldNavigate flag is set
  useEffect(() => {
    if (shouldNavigate && chatId && !paramChatId) {
      console.log("Navigating to chatId:", chatId);
      navigate(`/${chatId}`);
      setShouldNavigate(false); // Reset flag after navigation
      
      // Clear pending query data after successful navigation
      localStorage.removeItem('chatModalQuery');
      localStorage.removeItem('chatModalPending');
      pendingQueryProcessed.current = false;
    }
    scrollToBottom();
  }, [shouldNavigate, chatId, navigate, paramChatId]);
  
  console.log('messages', messages);
  console.log('chatName', chatName); // Log the chat name
  
  // Setup socket connection
  useEffect(() => {
    // Clean up any existing socket connection before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
  
    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server:", socketRef.current.id);
      
      // Process any pending query after socket is connected
      if (location.pathname === "/new" && !pendingQueryProcessed.current) {
        const pendingQuery = localStorage.getItem('chatModalQuery');
        const isPending = localStorage.getItem('chatModalPending') === 'true';
        
        if (pendingQuery && isPending) {
          pendingQueryProcessed.current = true;
          
          // Display message immediately
          const newUserMessage = {
            id: Date.now(),
            content: pendingQuery,
            role: "user",
            chatId: null,
            timestamp: new Date().toISOString(),
            sender: "user"
          };
          
          setMessages([newUserMessage]);
          messagesRef.current = [newUserMessage];
          
          // Submit the query after displaying it
          submitQueryDirectly(pendingQuery);
        }
      }
    });
  
    // Listening for chat started (first message)
    socketRef.current.on("chatStarted", ({ chatId, chatName, messages: newMessages }) => {
      // Set the chatId, chatName
      console.log("Chat started with ID:", chatId);
      console.log("Chat name:", chatName); // Log the generated chat name
      setChatId(chatId);
      setChatName(chatName); // Store the chat name
      
      // Get existing messages including any locally displayed user messages
      const existingMessages = [...messagesRef.current];
      
      // Prepare final message array by carefully merging
      // We want to preserve the display order but update with server IDs
      const finalMessages = [];
      
      // First check if we have user messages that should be preserved with their content
      const userMessages = existingMessages.filter(msg => msg.role === "user");
      
      // For each server message
      newMessages.forEach(serverMsg => {
        if (serverMsg.role === "user") {
          // For user messages from server, find matching local message by content
          const matchingUserMsg = userMessages.find(msg => msg.content === serverMsg.content);
          if (matchingUserMsg) {
            // Keep the local message's content but take the server ID
            finalMessages.push({
              ...matchingUserMsg,
              _id: serverMsg._id || serverMsg.id,
              chatId: chatId
            });
          } else {
            // No matching local message, use server message
            finalMessages.push(serverMsg);
          }
        } else {
          // For AI messages, just add them
          finalMessages.push(serverMsg);
        }
      });
      
      // Set the final messages
      setMessages(finalMessages);
      messagesRef.current = finalMessages;
            
      // Now set the flag to trigger navigation in the dedicated useEffect
      setShouldNavigate(true);
      
      setIsTyping(false);
    });
  
    // Modified messageReceived event handler
    socketRef.current.on("messageReceived", ({ chatId: receivedChatId, chatName: receivedChatName, messages: receivedMessages }) => {
      // Ensure we have a valid chatId from the response
      if (receivedChatId) {
        setChatId(receivedChatId);
      }
      
      // Update chat name if received
      if (receivedChatName) {
        setChatName(receivedChatName);
        console.log("Updated chat name:", receivedChatName);
      }
      
      // Get existing messages
      const existingMessages = [...messagesRef.current];
      
      // Function to check if we already have a particular message
      const hasMessage = (msg) => {
        return existingMessages.some(existing => 
          (existing._id && existing._id === msg._id) || 
          (existing.id && existing.id === msg.id) ||
          (existing.role === msg.role && existing.content === msg.content)
        );
      };
      
      // Build a new message array preserving user messages
      let newMessages = [...existingMessages];
      
      // Add any new messages from the server
      receivedMessages.forEach(msg => {
        if (!hasMessage(msg)) {
          newMessages.push(msg);
        }
      });
      
      // Update the messages state
      setMessages(newMessages);
      messagesRef.current = newMessages;
      
      setIsTyping(false);
    });
  
    socketRef.current.on("error", ({ message }) => {
      console.error(message);
      setIsTyping(false);
    });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [paramChatId, location.pathname]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Store current input value before clearing the input field
    const messageContent = inputValue;
    
    // Clear input field immediately for better UX
    setInputValue("");
  
    // Create user message object with the content
    const newUserMessage = {
      id: Date.now(), // Temporary ID
      content: messageContent, // Important: use stored message content
      role: "user",
      chatId: chatId, // Will be null initially for new chats
      timestamp: new Date().toISOString(),
      sender: "user"
    };
    
    // Push user message instantly to UI (optimistic update)
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages; // Update ref as well
    
    // Set typing indicator AFTER showing the message
    setIsTyping(true);
    
    // Now emit the socket event
    if (!chatId) {
      // Emit startChat event if chat not started yet
      socketRef.current.emit("startChat", { prompt: messageContent, userId: currentUser._id });
    } else {
      // Otherwise continue the chat
      socketRef.current.emit("sendMessage", { chatId, prompt: messageContent });
    }
    
    // Scroll to bottom after adding message
    setTimeout(scrollToBottom, 50);
  };
  
  // Ensure scrolling happens after messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
                <ChatMessage 
                  key={message.id || message._id} 
                  message={message} 
                />
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