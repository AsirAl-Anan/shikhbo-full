"use client"

import { useState, useEffect, useRef } from "react"
import ChatInput from "../components/Chat/ChatInput"
import ChatModal from "../components/Chat/ChatModal"
import { ShikhboIcon } from "../assets/ShihkboLogo"
import { useContext } from "react"
import { AuthContext } from "../context/UserContext"

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const settingsDropdownRef = useRef(null)
  const {currentUser, logout} = useContext(AuthContext)
  useEffect(()=>{
     if(!currentUser){
       window.location.href = '/auth'
     }
   },[currentUser])

  console.log(currentUser)
  
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "What can Artificial Intelligence." },
    { id: 2, title: "Generate a script for a 30-second comment..." },
    { id: 3, title: "What stages does the audit include?" },
    { id: 4, title: "Write a script for a training video on how to u..." },
    { id: 5, title: "Generate a summary of our company's missio..." },
    { id: 6, title: "How can I reduce stress at work in the office lo..." },
    { id: 7, title: "TalkTech Nexus : Where Ideas Spark and Con..." },
    { id: 8, title: "Tell me what is Artificial Intelligence" },
  ])
 
  const pinnedChats = [
    { id: 1, title: "Generate a script for a 30-second comment..." },
    { id: 2, title: "Tell me what is Artificial Intelligence" },
  ]

  
  const automations = [
    {
      id: 1,
      title: "Teach me a topic",
      description: "Explains any topic in a personalized way.",
      icon: "book-open",
    },
    {
      id: 2,
      title: "Solve a problem",
      description: "Step-by-step solution for any question.",
      icon: "pencil-ruler",
    },
    {
      id: 3,
      title: "Generate a custom exam",
      description: "Based on your syllabus and learning goals.",
      icon: "file-plus",
    },
    {
      id: 4,
      title: "Evaluate my answers",
      description: "AI-based assessment with detailed feedback.",
      icon: "check-circle",
    },
    {
      id: 5,
      title: "Organize my study schedule",
      description: "Manage your time and goals like Notion.",
      icon: "calendar",
    },
    {
      id: 6,
      title: "Team study space",
      description: "Collaborate, share notes, and grow together.",
      icon: "users",
    },
  ];
  
  // Check screen size on mount and when resized
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
 
    // Initial check
    checkScreenSize()
   
    // Add resize listener
    window.addEventListener('resize', checkScreenSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
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

  useEffect(()=>{
    if(currentUser === null){
      window.location.href = "/auth"
    }
  },[currentUser])

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }
  
  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown)
  }

  const handleLogout = async () => {
    // Implement logout functionality here
   try {
   await logout()
   } catch (error) {
     console.error("Error logging out:", error)
    
   }
    // Example: auth.signOut().then(() => window.location.href = "/auth")
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const ShowGreeting =() =>{
    const currentHour = new Date().getHours()
    if (currentHour > 6 && currentHour < 12) {
      return "Good Morning!"
    } else if (currentHour < 18 && currentHour > 12) {
      return "Good Afternoon!"
    } else if(  currentHour < 6) {
      return "Hello Night Owl!"
    } else {
      return "Good Night!"
    }
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
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
            <div className="flex items-center space-x-2">
              <ShikhboIcon className="h-8 w-8"/>
              <h1 className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-purple-600 to-pink-500">ShikhZy</h1>
            </div>
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
              <a href="#" className="flex items-center space-x-2 p-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
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
              </a>
              
              {/* Question Bank */}
              <a href="#" className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
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
              </a>
              
              {/* Exam Generator & Evaluator */}
              <a href="#" className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
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
                <span>Exam Generator & Evaluator</span>
              </a>
              
              {/* Productive Study Planner */}
              <a href="#" className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
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
                <span>Productive Study Planner</span>
              </a>

              <a href="#" className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md">
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
                <span>Inbox</span>
              </a>
            </div>

            {/* Pinned */}
            <div>
              <h3 className="text-xs text-gray-500 font-semibold mb-2">PINNED</h3>
              <div className="space-y-2">
                {pinnedChats.map((chat) => (
                  <a key={chat.id} href="#" className="block text-sm text-gray-300 hover:text-white">
                    {chat.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Chat History */}
            <div>
              <h3 className="text-xs text-gray-500 font-semibold mb-2">CHAT HISTORY</h3>
              <div className="space-y-2">
                {chatHistory.slice(0, 6).map((chat) => (
                  <a key={chat.id} href="#" className="block text-sm text-gray-300 hover:text-white">
                    {chat.title}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* New Chat Button */}
          <div className="p-4 border-t border-gray-800 flex-shrink-0">
            <button className="w-full bg-purple-600 text-white rounded-md py-2 px-4 flex items-center justify-center">
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
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full  flex items-center justify-center">
               <img className="rounded-full" src={currentUser?.avatar} alt="" />
              </div>
              <span className="text-sm">New chat</span>
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
                    <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                      Settings
                    </a>
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

      {/* Main Content - Expands to fill space when sidebar is closed */}
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
              <h1 className="text-xl md:text-2xl font-bold">{ShowGreeting()}</h1>
              <p className="text-gray-400">{currentUser?.username || "User"}</p>
            </div>
          </div>
          <button className="bg-purple-600 text-white rounded-md py-2 px-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Automation */}
          <section className="px-4 md:px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {automations.map((automation) => (
                <div 
                  key={automation.id} 
                  className="bg-gradient-to-br from-black via-purple-900 to-green-700 rounded-lg p-4 transition-all duration-300 ease-in-out hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:h-6 md:w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {automation.icon === "book-open" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      )}
                      {automation.icon === "pencil-ruler" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      )}
                      {automation.icon === "file-plus" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      )}
                      {automation.icon === "check-circle" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      )}
                      {automation.icon === "calendar" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      )}
                      {automation.icon === "users" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      )}
                      {automation.icon === "activity" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      )}
                      {automation.icon === "shopping-cart" && (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      )}
                    </svg>
                    <h3 className="font-medium text-sm md:text-base">{automation.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm opacity-80 mb-4">{automation.description}</p>
                  <button className="bg-black bg-opacity-20 text-white rounded px-3 py-1 text-xs md:text-sm hover:bg-opacity-30 transition-all">Generate</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-800 bg-black">
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <ChatModal onClose={closeModal} />}
    </div>
  )
}

export default HomePage