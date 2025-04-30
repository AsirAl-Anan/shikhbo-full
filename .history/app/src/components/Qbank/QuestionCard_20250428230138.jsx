import ColorSelector from "./ColorSelector"
import QuickAddButton from "./QuickAddButton"
import { NavLink } from "react-router-dom"


export default function QuestionCard({ question }) {
  return (
    <div className="group my-[20px]">
      <div className="relative mb-2 bg-gray-700 rounded-lg overflow-hidden">
        <div className="w-full mt-5 p-4">{question.stem}</div>
 
        
      </div>

      <div className="mb-1">
        <h3 className="font-medium text-lg text-white">{question.title}</h3>
        {question.title === "Newton's Second Law" && (
          <p className="text-sm text-gray-400">a) {question.a}</p>
        )}
        {question.title === "Mendel's Laws of Inheritance" && (
          <p className="text-sm text-gray-400">Principles of Dominance and Segregation</p>
        )}
      </div>

      <div className="mb-3">
        <span className="font-medium text-white">{question.marks} Marks</span>
      </div>

      <div className="flex justify-between items-center">
        <NavLink className={"bg-gray-800 text-white border border-gray-700 px-4 py-2 font-medium hover:bg-gray-700"}>
        See Solution
        </NavLink>
        {/* <QuickAddButton /> */}
      </div>
    </div>
  )
}
