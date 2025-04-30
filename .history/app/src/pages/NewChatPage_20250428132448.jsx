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
  const [pendingMessages, setPendingMessages] = useState([]);
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
  
  // Function to add a message optimistically
  const addOptimisticMessage = (message) => {
    // Create a unique temporary ID
    const tempId = `temp-${Date.now()}`;
    
    // Create the message object with temporary ID
    const newMessage = {
      id: tempId,
      tempId: tempId, // Flag to identify this as a temporary message
      content: message,
      role: "user",
      chatId: chatId,
      timestamp: new Date().toISOString(),
      sender: "user",
      pending: true // Flag to identify pending state
    };
    
    // Save to localStorage for persistence
    const storedPendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
    localStorage.setItem('pendingMessages', JSON.stringify([...storedPendingMessages, newMessage]));
    
    // Update UI immediately
    setMessages(prevMessages => [...prevMessages, newMessage]);
    messagesRef.current = [...messagesRef.current, newMessage];
    
    // Also track in pending messages state
    setPendingMessages(prev => [...prev, newMessage]);
    
    return tempId; // Return the ID for later reference
  };
  
  // Function to clear a pending message after server response
  const clearPendingMessage = (tempId) => {
    // Remove from localStorage
    const storedPendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
    const updatedPendingMessages = storedPendingMessages.filter(msg => msg.tempId !== tempId);
    localStorage.setItem('pendingMessages', JSON.stringify(updatedPendingMessages));
    
    // Update pending messages state
    setPendingMessages(prev => prev.filter(msg => msg.tempId !== tempId));
  };
  
  // Load any pending messages on initial load
  useEffect(() => {
    const storedPendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
    
    if (storedPendingMessages.length > 0) {
      // If we have stored pending messages, restore them
      setPendingMessages(storedPendingMessages);
    }
  }, []);
  
  // Handle direct submission from ChatModal when arriving at /new
  useEffect(() => {
    if (location.pathname === "/new" && !pendingQueryProcessed.current) {
      const pendingQuery = localStorage.getItem('chatModalQuery');
      const isPending = localStorage.getItem('chatModalPending') === 'true';
      
      if (pendingQuery && isPending && socketRef.current && socketRef.current.connected) {
        pendingQueryProcessed.current = true; // Mark as processed to prevent duplicate submissions
        
        // Submit the query directly without showing in input field
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
    
    // Add message optimistically to UI immediately
    const tempId = addOptimisticMessage(query);
    
    setIsTyping(true);
    
    // Emit startChat event since this will always be a new chat
    socketRef.current.emit("startChat", { 
      prompt: query, 
      userId: currentUser._id,
      tempId: tempId // Send tempId to match responses
    });
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
  
  // Helper function to merge messages correctly
  const mergeMessages = (existingMessages, newMessages) => {
    const result = [...existingMessages];
    
    // Keep track of messages we've seen by ID
    const seenIds = new Set(existingMessages.map(msg => msg._id || msg.id));
    
    // Add any new messages that aren't already in the list
    newMessages.forEach(newMsg => {
      const msgId = newMsg._id || newMsg.id;
      
      if (!seenIds.has(msgId)) {
        result.push(newMsg);
        seenIds.add(msgId);
      }
    });
    
    // Sort by timestamp if needed
    return result.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  };
  
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
          
          // Submit the query directly
          submitQueryDirectly(pendingQuery);
        }
      }
    });
  
    // Listening for chat started (first message)
    socketRef.current.on("chatStarted", ({ chatId, chatName, messages: newMessages, tempId }) => {
      // Set the chatId, chatName, and messages
      console.log("Chat started with ID:", chatId);
      console.log("Chat name:", chatName); // Log the generated chat name
      setChatId(chatId);
      setChatName(chatName); // Store the chat name
      
      // Clear the pending message that triggered this response
      if (tempId) {
        clearPendingMessage(tempId);
      }
      
      // Merge messages, keeping any other pending messages
      const mergedMessages = mergeMessages(messagesRef.current, newMessages);
      setMessages(mergedMessages);
      messagesRef.current = mergedMessages;
      
      // Now set the flag to trigger navigation in the dedicated useEffect
      setShouldNavigate(true);
      
      setIsTyping(false);
    });
  
    // Modified messageReceived event handler
    socketRef.current.on("messageReceived", ({ chatId: receivedChatId, chatName: receivedChatName, messages: receivedMessages, tempId }) => {
      // Clear the pending message that triggered this response
      if (tempId) {
        clearPendingMessage(tempId);
      }
      
      // Ensure we have a valid chatId from the response
      if (receivedChatId) {
        setChatId(receivedChatId);
      }
      
      // Update chat name if received
      if (receivedChatName) {
        setChatName(receivedChatName);
        console.log("Updated chat name:", receivedChatName);
      }
      
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
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [paramChatId, location.pathname]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    // Add message optimistically to UI immediately
    const tempId = addOptimisticMessage(inputValue);
    
    setIsTyping(true);
    
    if (!chatId) {
      // Emit startChat event if chat not started yet
      socketRef.current.emit("startChat", { 
        prompt: inputValue, 
        userId: currentUser._id,
        tempId: tempId // Send tempId to match responses
      });
    } else {
      // Otherwise continue the chat
      socketRef.current.emit("sendMessage", { 
        chatId, 
        prompt: inputValue,
        tempId: tempId // Send tempId to match responses 
      });
    }
    
    setInputValue("");
  };
  
  const hasMessages = messages.length > 0;
}
  
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