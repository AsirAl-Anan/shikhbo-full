import React from "react"

const Header = ({ toggleSidebar, currentUser }) => {
  const ShowGreeting = () => {
    const currentHour = new Date().getHours();
  
    if (currentHour >= 6 && currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon!";
    } else if (currentHour >= 18 || currentHour < 6) {
      return "Good Evening!";
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center">
        {/* Hamburger menu button */}
        <button onClick={toggleSidebar} className="mr-4 text-gray-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{ShowGreeting()}</h1>
          <p className="text-gray-400">{currentUser?.username || "User"}</p>
        </div>
      </div>
      
    </header>
  )
}

export default Header