import React from "react"
import { useState } from "react";
import ChatInput from "./Chat/ChatInput"
import ChatModal from "./Chat/ChatModal"

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
            <NavLink>

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