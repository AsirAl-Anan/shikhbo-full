import { useState, useEffect, useRef } from "react"
import { NavLink } from "react-router-dom"
import { ShikhboIcon } from "../../assets/ShihkboLogo"
import instance from "../../utils/axios.js"
import { AuthContext } from "../../context/UserContext.jsx"
import { useContext } from "react"
import { io } from "socket.io-client"
import { toast, Slide } from "react-toastify"
const Sidebar = ({ isSidebarOpen, isMobile, toggleSidebar, currentUser }) => {
  const { logout } = useContext(AuthContext)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const settingsDropdownRef = useRef(null)
  const [chatHistory, setChatHistory] = useState([])
  const socketRef = useRef(null)
  const SOCKET_URL = "http://localhost:8000"
  
  // Connect to socket when component mounts
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    })

    socketRef.current.on("chatStarted", ({ chatId, chatName }) => {
      // When a new chat is started, add it to the chat history
      setChatHistory(prevChats => [
        { _id: chatId, chatName: chatName || "New Chat", createdAt: new Date() },
        ...prevChats
      ])
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])
  const showNewFeatureAlert = () => { 
    toast.info('This feature is coming soon, stay tuned!', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    
      progress: 1,
      theme: "dark",
      transition: Slide,
      });
  }
  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await instance.get('/ai/chat/getAllchat')
        // Sort chats by creation date, newest first
        const sortedChats = response.data.chats.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        setChatHistory(sortedChats)
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }
  
    fetchChatHistory()
  }, [])
  
 

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Function to truncate long chat names
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "Untitled Chat"
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
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
    <div className={`w-64 flex flex-col h-full ${(!isSidebarOpen && !isMobile) ? 'invisible' : 'visible'}`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
        <NavLink to={'/'} className="flex items-center space-x-2">
          <ShikhboIcon className="h-8 w-8"/>
          <h1 className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-purple-600 to-pink-500">Shikhbo</h1>
        </NavLink>
        {/* Close sidebar button - mobile only */}
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
  
      {/* Navigation - Make this scrollable */}
      <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Services */}
        <div className="space-y-2">
          {/* Learn - Active */}
          <NavLink to="/" className={({isActive}) => 
            isActive 
              ? "flex items-center space-x-2 p-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
              : "flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
          }>
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>Learn</span>
          </NavLink>
          
          {/* Question Bank */}
          <NavLink to="/subjects" className={({isActive}) => 
            isActive 
              ? "flex items-center space-x-2 p-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
              : "flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
          }>
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Question Bank</span>
          </NavLink>
          
          {/* Exam Generator & Evaluator with Coming Soon Badge */}
          <NavLink onClick={()=>showNewFeatureAlert()}    className={ "flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"}>
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="flex items-center">
              Exam Generator
              <span className="ml-2  px-1 py-0.5 rounded-sm bg-pink-500 text-white font-medium text-opacity-90 text-xs">soon</span>
            </span>
          </NavLink>
          
          {/* Productive Study Planner with Coming Soon Badge */}
          <NavLink onClick={()=>showNewFeatureAlert()}   className={ "flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
          }>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="flex items-center">
              Study Planner
              <span className="ml-2  px-1 py-0.5 rounded-sm bg-pink-500 text-white font-medium text-opacity-90 text-xs">soon</span>
            </span>
          </NavLink>
  
          {/* Inbox with Coming Soon Badge */}
          <NavLink  onClick={()=>showNewFeatureAlert()} className={"flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
          }>
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="flex items-center">
              Inbox
              <span className="ml-2  px-1 py-0.5 rounded-sm bg-pink-500 text-white font-medium text-opacity-90 text-xs">soon</span>
            </span>
          </NavLink>
        </div>
  
        {/* Chat History */}
        <div>
          <h3 className="text-xs text-gray-500 font-semibold mb-2">CHAT HISTORY</h3>
          <div className="space-y-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <NavLink 
                  key={chat._id} 
                  to={`/${chat._id}`}
                  className={({isActive}) => 
                    isActive 
                      ? "block text-sm text-white font-medium truncate"
                      : "block text-sm text-gray-300 hover:text-white truncate"
                  }
                  title={chat.chatName || "Untitled Chat"}
                >
                  {truncateText(chat.chatName)}
                </NavLink>
              ))
            ) : (
              <p className="text-sm text-gray-500">No chat history</p>
            )}
          </div>
        </div>
      </nav>
  
      {/* New Chat Button */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <NavLink to="/new" className="w-full bg-purple-600 text-white rounded-md py-2 px-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </NavLink>
      </div>
            
      {/* User Profile */}
      <div className="p-4 border-t border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img className="rounded-full" src={currentUser?.avatar} alt="" />
          </div>
          <span className="text-sm text-gray-300 truncate">{currentUser?.username || "User"}</span>
        </div>
        <div className="relative" ref={settingsDropdownRef}>
          <button onClick={toggleSettingsDropdown}>
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          {/* Settings Dropdown */}
          {showSettingsDropdown && (
            <div className="absolute bottom-10 right-0 w-36 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
              <div className="py-1">
               
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Sidebar