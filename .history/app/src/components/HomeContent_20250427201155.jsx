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

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  
  return (
    <></>
    
  )
}

export default HomeContent