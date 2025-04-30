"use client"

import { useState, useEffect, useRef } from "react"

const ChatModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const modalRef = useRef(null)
  const inputRef = useRef(null)

  const newsItems = [
    "Trump reassures markets by not firing Fed Chair Powell",
    "Elon Musk to focus more on Tesla amid profit drop",
    "Pope Francis' body lies in state at St. Peter's Basilica",
    "IMF downgrades global growth forecast due to Trump's tariffs",
  ]

  const quickWords = ["i", "the", "i'm"]

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    // Focus the input
    if (inputRef.current) {
      inputRef.current.focus()
    }

    return () => clearTimeout(timer)
  }, [])

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Match transition duration
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`w-full h-[90vh] bg-black rounded-t-3xl p-4 transform transition-transform duration-300 ease-out ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Header */}
      
      </div>
    </div>
  )
}

export default ChatModal
