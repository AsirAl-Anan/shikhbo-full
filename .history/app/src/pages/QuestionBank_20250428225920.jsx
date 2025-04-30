"use client"

import { useState } from "react"
import Breadcrumb from "../components/Qbank/Breadcrumb"
import CategoryTabs from "../components/Qbank/CategoryTabs"
import VersionFilter from "../components/Qbank/VersionFilter"
import QuestionGrid from "../components/Qbank/QuestionGrid"
import FilterDrawer from "../components/Qbank/FilterDrawer"
import { ArrowLeft } from "lucide-react"
import instance from "../utils/axios.js"
import { useEffect } from "react"
const axios = instance
import { useNavigate } from "react-router-dom"
export default function StudyMaterialsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
 
 const navigate = useNavigate()
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }
 const handleBack = () => { 
    navigate(-1)
  }



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="cursor-pointer font-bold text-gray-50 flex gap-2 mb-5" onClick={handleBack}> <ArrowLeft /> Back</div>

      <h1 className="text-3xl font-bold mt-2 mb-6">Study Materials</h1>

      {/* <CategoryTabs /> */}

      {/* <div className="flex justify-between items-center my-6">
        <button
          onClick={toggleFilter}
          className="flex items-center text-sm font-medium bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
        </button>
        <VersionFilter />
      </div> */}

      {/* <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} /> */}

      <div className="">
        <div className="">
          <QuestionGrid />
        </div>
       
      </div>
    </div>
  )
}
