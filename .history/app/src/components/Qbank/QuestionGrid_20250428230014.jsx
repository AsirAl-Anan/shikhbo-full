import QuestionCard from "./QuestionCard"
import { useState, useEffect } from "react"
import instance from "../../utils/axios.js"
const axios = instance
export default function QuestionGrid() {
  const getQuestions = async () => {
    const [questions, setQuestions] = useState([])
    const res =await axios.get('/admin/cq')
     setQuestions(res.data)
     }
     useEffect(() => {
       getQuestions()
     }, [])
  

  return (
    <div className="">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question}  />
      ))}
    </div>
  )
}
