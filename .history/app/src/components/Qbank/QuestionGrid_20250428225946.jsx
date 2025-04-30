import QuestionCard from "./QuestionCard"
import { useState, useEffect } from "react"
export default function QuestionGrid() {
  const getQuestions = async () => {
    const [questions, setQuestions] = useState([])
    const res =await axios.get('/admin/cq')
     setQuestions(res.data)
     }
     useEffect(() => {
       getQuestions()
     }, [])
  const questions = [
    {
      id: 1,
      title: "Newton's Second Law",
      marks: 5,
      topics: [
        { name: "Physics", color: "#E8D0B8" },
        { name: "Mechanics", color: "#B3B8A6" },
        { name: "Laws of Motion", color: "#2A3244" },
      ],
      image: "/placeholder.svg?height=300&width=300",
      badge: "IMPORTANT",
    },
    {
      id: 2,
      title: "Mendel's Laws of Inheritance",
      marks: 6,
      topics: [
        { name: "Biology", color: "#FFFFFF" },
        { name: "Genetics", color: "#D2B48C" },
        { name: "Inheritance", color: "#2A3244" },
      ],
      image: "/placeholder.svg?height=300&width=300",
      badge: "NEW",
    },
    {
      id: 3,
      title: "Fundamental Theorem of Calculus",
      marks: 8,
      topics: [
        { name: "Mathematics", color: "#F5F5DC" },
        { name: "Calculus", color: "#808080" },
        { name: "Integration", color: "#000000" },
      ],
      image: "/placeholder.svg?height=300&width=300",
      badge: "",
    },
    {
      id: 4,
      title: "Photosynthesis Process",
      marks: 4,
      topics: [
        { name: "Biology", color: "#FFFFFF" },
        { name: "Plant Physiology", color: "#808080" },
        { name: "Photosynthesis", color: "#000000" },
      ],
      image: "/placeholder.svg?height=300&width=300",
      badge: "",
    },
  ]

  return (
    <div className="">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question}  />
      ))}
    </div>
  )
}
