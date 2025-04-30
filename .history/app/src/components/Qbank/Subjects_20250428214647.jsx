import { NavLink } from "react-router-dom"

const SubjectCard = ({ title, subtitle, color, icon }) => {
    return (
      <div
        className={`rounded-lg p-6 h-48 flex flex-col justify-between ${color} transition-transform hover:scale-105 cursor-pointer`}
      >
        <div>
          <h3 className="text-white text-2xl font-bold">{title}</h3>
          <p className="text-white/90 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex justify-center items-center">{icon}</div>
      </div>
    )
  }
  
  const AcademicSection = () => {
    const subjects = [
      {
        title: "English",
        subtitle: "1st paper",
        color: "bg-gradient-to-br from-red-800 to-red-600",
        icon: <span className="text-red-200 text-8xl font-bold opacity-70">A</span>,
      },
      {
        title: "English",
        subtitle: "2nd paper",
        color: "bg-gradient-to-br from-red-700 to-red-500",
        icon: <span className="text-red-200 text-8xl font-bold opacity-70">a</span>,
      },
      {
        title: "Bangla",
        subtitle: "1st paper",
        color: "bg-gradient-to-br from-yellow-700 to-yellow-500",
        icon: <span className="text-yellow-200 text-8xl font-bold opacity-70">অ</span>,
      },
      {
        title: "Bangla",
        subtitle: "2nd paper",
        color: "bg-gradient-to-br from-amber-600 to-amber-400",
        icon: <span className="text-amber-200 text-8xl font-bold opacity-70">আ</span>,
      },
      {
        title: "ICT",
        subtitle: "",
        color: "bg-gradient-to-br from-indigo-900 to-indigo-800",
        icon: (
          <div className="w-20 h-16 relative">
            <div className="absolute w-16 h-10 bg-indigo-300 opacity-70 rounded-sm"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-300 opacity-70"></div>
            <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-indigo-300 opacity-70 rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-indigo-300 opacity-70 rounded-full"></div>
          </div>
        ),
      },
      {
        title: "Physics",
        subtitle: "1st paper",
        color: "bg-gradient-to-br from-blue-900 to-blue-700",
        icon: (
          <div className="w-16 h-16 flex justify-center items-end">
            <div className="w-12 h-1 bg-blue-200 relative">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute bottom-0 w-1 h-8 bg-blue-200 rounded-full"
                  style={{ left: `${i * 25}%` }}
                ></div>
              ))}
              <div className="absolute -right-4 bottom-0 w-4 h-4 rounded-full border-2 border-blue-200"></div>
            </div>
          </div>
        ),
      },
      {
        title: "Physics",
        subtitle: "2nd paper",
        color: "bg-gradient-to-br from-blue-700 to-blue-500",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-12 h-8 bg-blue-200 opacity-70 rounded-md"></div>
          </div>
        ),
      },
      {
        title: "Chemistry",
        subtitle: "1st paper",
        color: "bg-gradient-to-br from-purple-900 to-purple-700",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-8 h-12 bg-purple-200 opacity-70 rounded-b-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-purple-200 opacity-70"></div>
            </div>
          </div>
        ),
      },
      {
        title: "Chemistry",
        subtitle: "2nd paper",
        color: "bg-gradient-to-br from-purple-800 to-purple-600",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-8 h-10 bg-purple-200 opacity-70 rounded-md"></div>
            <div className="w-4 h-6 bg-purple-200 opacity-70 rounded-md ml-1"></div>
          </div>
        ),
      },
      {
        title: "Higher Math",
        subtitle: "1st paper",
        color: "bg-gradient-to-br from-amber-800 to-amber-600",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-12 h-8 bg-amber-200 opacity-70 transform rotate-12"></div>
            <div className="w-10 h-1 bg-amber-200 opacity-70 absolute transform rotate-45"></div>
          </div>
        ),
      },
      {
        title: "Higher Math",
        subtitle: "2nd paper",
        color: "bg-gradient-to-br from-orange-700 to-orange-500",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-10 h-6 bg-orange-200 opacity-70 rounded-sm"></div>
          </div>
        ),
      },
      {
        title: "Biology",
        subtitle: "1st paper",
        color: "bg-gradient-to-br from-green-900 to-green-700",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-8 h-10 bg-green-200 opacity-70 rounded-full"></div>
          </div>
        ),
      },
      {
        title: "Biology",
        subtitle: "2nd paper",
        color: "bg-gradient-to-br from-green-800 to-green-600",
        icon: (
          <div className="w-16 h-16 flex justify-center items-center">
            <div className="w-10 h-8 bg-green-200 opacity-70 rounded-full"></div>
          </div>
        ),
      },
    ]
  
    return (
      <div className="bg-gray-900 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold">ACADEMIC</h1>
            <p className="text-white/80 text-xl">Subject Wise Question Bank</p>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject, index) => (
                <NavLink to={`/subjects/${(subject.title + subject.subtitle).trim().replace(/[-\s]+/g, '').toLowerCase()}`} key={index}>

<SubjectCard
                key={index}
                title={subject.title}
                subtitle={subject.subtitle}
                color={subject.color}
                icon={subject.icon}
              />
                </NavLink>
              
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default AcademicSection
  