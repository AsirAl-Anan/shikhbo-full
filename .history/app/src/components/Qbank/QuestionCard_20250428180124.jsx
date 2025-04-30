import ColorSelector from "./ColorSelector"
import QuickAddButton from "./QuickAddButton"
import { NavLink } from "react-router-dom"
const stem = [
  Loren
]
export default function QuestionCard({ question }) {
  return (
    <div className="group">
      <div className="relative mb-2 bg-gray-500 rounded-lg overflow-hidden">
        <div className="w-full h-64"></div>

        {question.badge && (
          <div className="absolute top-4 left-4 uppercase text-xs font-bold tracking-wider text-white bg-gray-900 bg-opacity-70 px-2 py-1 rounded">
            {question.badge}
          </div>
        )}
      </div>

      <div className="mb-1">
        <h3 className="font-medium text-lg text-white">{question.title}</h3>
        {question.title === "Newton's Second Law" && (
          <p className="text-sm text-gray-400">Force, Mass, and Acceleration relationship</p>
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
          Start Solving
        </NavLink>
        <QuickAddButton />
      </div>
    </div>
  )
}
