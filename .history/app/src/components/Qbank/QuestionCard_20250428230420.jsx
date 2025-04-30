import ColorSelector from "./ColorSelector"
import QuickAddButton from "./QuickAddButton"
import { NavLink } from "react-router-dom"


export default function QuestionCard({ question }) {
  return (
    <div className="group my-[20px]">
      <div className="relative mb-2 bg-gray-700 rounded-lg overflow-hidden">
        <div className="w-full mt-5 p-4">{question.stem}</div>
 
        
      </div>

     

      <div className="m">
        <div className="font-medium text-white"> A. {question.a.question} </div> 
        <div className="font-medium text-white"> B. {question.b.question} </div>
        <div className="font-medium text-white"> C. {question.c.question} </div>
        <div className="font-medium text-white"> D. {question.d.question} </div>
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
