import { useState } from "react"
import { X } from "lucide-react"
import ColorSelector from "./ColorSelector"
import QuickAddButton from "./QuickAddButton"
import { NavLink } from "react-router-dom"

export default function QuestionCard({ question }) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="group my-5">
      <div className="relative mb-2 bg-gray-700 rounded-lg overflow-hidden">
        <div className="w-full mt-5 p-4">{question.stem}</div>
      </div>

      <div className="my-4">
        <div className="font-medium text-white"> A. {question.a.question} </div> 
        <div className="font-medium text-white"> B. {question.b.question} </div>
        <div className="font-medium text-white"> C. {question.c.question} </div>
        <div className="font-medium text-white"> D. {question.d.question} </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          className="bg-gray-800 text-white border border-gray-700 px-4 py-2 font-medium hover:bg-gray-700"
          onClick={() => setShowSolution(true)}
        >
          See Solution
        </button>
        {/* <QuickAddButton /> */}
      </div>

      {/* Solution Modal */}
      {showSolution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] relative">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setShowSolution(false)}
            >
              <X size={24} />
            </button>
            
            {/* Modal content */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <h3 className="text-xl font-bold text-white mb-4">Solution</h3>
              
              <div className="mb-6">
                <div className="text-white font-semibold mb-2">Question:</div>
                <div className="text-gray-300 mb-4">{question.stem}</div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="text-white font-semibold">A. {question.a.question}</div>
                  <div className="text-lg md:text-lg sm:text-base mt-2 text-gray-300">{question.a.answer}</div>
                </div>
                
                <div>
                  <div className="text-white font-semibold">B. {question.b.question}</div>
                  <div className="text-lg md:text-lg sm:text-base mt-2 text-gray-300">{question.b.answer}</div>
                </div>
                
                <div>
                  <div className="text-white font-semibold">C. {question.c.question}</div>
                  <div className="text-lg md:text-lg sm:text-base mt-2 text-gray-300">{question.c.answer}</div>
                </div>
                
                <div>
                  <div className="text-white font-semibold">D. {question.d.question}</div>
                  <div className="text-lg md:text-lg sm:text-base mt-2 text-gray-300">{question.d.answer}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}