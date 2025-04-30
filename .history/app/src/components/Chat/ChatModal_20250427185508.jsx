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
   
  )
}

export default ChatModal
