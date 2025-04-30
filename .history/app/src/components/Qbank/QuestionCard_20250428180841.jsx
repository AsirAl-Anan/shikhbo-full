import ColorSelector from "./ColorSelector"
import QuickAddButton from "./QuickAddButton"
import { NavLink } from "react-router-dom"
const stem = [
 " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit."
]
export default function QuestionCard({ question }) {
  return (
    <div className="group my-[20px]">
      <div className="relative mb-2 bg-gray-700 rounded-lg overflow-hidden">
        <div className="w-full ">{stem[0]}</div>
 
        {question.badge && (
          <div className="absolute top- left-4 uppercase text-xs font-bold tracking-wider text-white bg-gray-900 bg-opacity-70 px-2 py-1 rounded">
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
        See Solution
        </NavLink>
        <QuickAddButton />
      </div>
    </div>
  )
}
