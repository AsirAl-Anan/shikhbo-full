import React from "react";

export function ChatMessage({ message }) {
  // Check if message is a single message object or an array of messages
  const messages = Array.isArray(message) ? message : [message];
  
  return (
    <>
      {messages.map((msg, index) => {
        const isUser = msg.sender === "user";
        
        // Fix: Use msg.content as fallback if msg.text is not available
        const messageText = msg.text || msg.content || "";
        
        return (
          <div key={msg._id || msg.id || index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
              {!isUser && (
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mb-2">
                  <span className="text-xs">AI</span>
                </div>
              )}
              <div className={`rounded-lg p-3 ${isUser ? "bg-gray-700" : "bg-gray-800"}`}>
                <p className="whitespace-pre-wrap">{messageText}</p>
                {msg.image && (
                  <img
                    src={msg.image || "/placeholder.svg"}
                    alt="Message attachment"
                    className="mt-2 rounded-md max-w-full h-auto"
                  />
                )}
              </div>
              {isUser && (
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mt-2 ml-auto">
                  <span className="text-xs">You</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}