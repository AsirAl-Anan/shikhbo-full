import React from "react";
////////// new chat components //////////
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

export function InputArea({ 
  inputValue, 
  setInputValue, 
  handleSendMessage,
  handleImageSelect,
  selectedImage,
  imagePreview,
  handleRemoveImage,
  fileInputRef
}) {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height with a maximum limit
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  // Handle file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form onSubmit={handleSendMessage} className="relative">
      <div className="rounded-lg bg-gray-800 p-2">
        {/* Image preview section */}
        {imagePreview && (
          <div className="mb-2 relative">
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Selected image" 
                className="rounded-md max-h-40 max-w-full"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="w-full bg-[#303030] rounded-3xl outline-none resize-none p-4"
          style={{
            minHeight: '42px',
            maxHeight: '150px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#6b7280 transparent',
            overflowY: 'auto'
          }}
          placeholder="Ask anything"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage(e)
            }
          }}
        />

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageSelect}
        />

        <div className="flex items-center justify-between mt-2 px-2">
          

          <div className="flex space-x-2">
            <button type="button" className="p-2 rounded-full hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            <button 
              type="submit" 
              className="p-2 rounded-full hover:bg-gray-700"
              disabled={!inputValue.trim() && !selectedImage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${(!inputValue.trim() && !selectedImage) ? 'text-gray-500' : 'text-white'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}