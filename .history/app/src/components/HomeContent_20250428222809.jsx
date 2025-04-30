import React from "react"
import { useState } from "react";
import ChatInput from "./Chat/ChatInput"
import ChatModal from "./Chat/ChatModal"
import { NavLink } from "react-router-dom";
const HomeContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
    
  const automations = [
    {
      id: 1,
      title: "Teach me a topic",
      description: "Explains any topic in a personalized way.",
      to:"/new",
      icon: "book-open",
    },
    {
      id: 2,
      title: "Solve a problem",
      description: "Step-by-step solution for any question.",
      to:"/new",
      icon: "pencil-ruler",
    },
    
  ];

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <section className="flex-grow px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {automations.map((automation) => (
            <div 
              key={automation.id} 
              className="bg-gradient-to-br from-black via-purple-900 to-green-700 rounded-lg p-4 transition-all duration-300 ease-in-out hover:shadow-xl group relative overflow-hidden"
            >  
            <NavLink to={automation.to} className="flex flex-col h-full justify-between">
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
                <h3 className="font-medium text-sm md:text-base">{automation.title}</h3>{ automation.title === "Automation" &&    <span className="ml-2  px-1 py-0.5 rounded-sm bg-pink-500 text-white font-medium text-opacity-90 text-xs">soon</span>}
              </div>
              <p className="text-xs md:text-sm opacity-80 mb-4">{automation.description}</p>
              
            </NavLink>
             
            </div>
          ))}
        </div>
      </section>
      
      {/* Fixed chat input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 ml-0 md:ml-64 p-4 border-t border-gray-800 bg-black z-10">
        <ChatInput onClick={openModal} />
      </div>
      
      {isModalOpen && <ChatModal onClose={closeModal} />}
    </div>
  )
}

export default HomeContent