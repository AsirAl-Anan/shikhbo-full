export function ChatMessage({ message }) {
    const isUser = message.role === "user"
  
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
          {!isUser && (
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mb-2">
              <span className="text-xs">AI</span>
            </div>
          )}
          <div className={`rounded-lg p-3 ${isUser ? "bg-gray-700" : "bg-gray-800"}`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.image && (
              <img
                src={message.image || "/placeholder.svg"}
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
    )
  }
  
 
  
  import React, { useState, useRef, useEffect } from 'react';

  export default function ChatInput() {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);
    
    // Auto-resize the textarea based on content
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Calculate new height with a maximum limit of 200px
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
      }
    }, [message]);
  
    const handleInputChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (message.trim()) {
        console.log('Sending message:', message);
        setMessage('');
      }
    };
  
    return (
      <div className="bg-gray-900 rounded-lg p-4 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex items-end">
          <div className="relative flex-grow">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              placeholder="Message Claude..."
              className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 pr-10 resize-none outline-none overflow-y-auto"
              style={{
                minHeight: '46px',
                maxHeight: '200px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#6b7280 transparent'
              }}
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <button 
                type="button" 
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2 ml-2">
            <button
              type="button"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            
            <button
              type="button"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </button>
            
            <button
              type="button"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>
            
            <button
              type="button"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
            
            <button
              type="submit"
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
  }