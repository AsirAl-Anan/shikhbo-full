import { useEffect, useState } from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from './pages/Auth/Auth';
import HomePage from './pages/Home';
import HomeContent from './components/HomeContent';
import { useContext } from 'react';
import { AuthContext } from './context/UserContext';
import StudyMaterialsPage from './pages/QuestionBank';
import NewChatPage from './pages/NewChatPage';
// Admin imports
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/AdminDashboard';
import AddQuestion from './pages/Admin/AddQuestion';
import AddSubject from './pages/Admin/AddSubject';
import AcademicSection from './components/QBank/Subjects'; 

function App() {
  const { currentUser } = useContext(AuthContext);

  // Create router with the modern createBrowserRouter syntax
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      children: [
        { 
          path: "/", 
          element: <HomeContent /> 
        },
        { 
          path: "/new", 
          element: <NewChatPage /> 
        },
        
        {
          path: "/subjects",
          element: <AcademicSection />,
         
        },
        {
          path: "/:id",
          element: <NewChatPage />
        },
        {
          path: "/subjects/:id",
          element: <StudyMaterialsPage />
        }
      ]
    },
    { 
      path: "/auth", 
      element: <AuthPage /> 
    },
    // Admin routes
    {
      path: "/admin/login",
      element: <AdminLogin />
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "add-question",
          element: <AddQuestion />
        },
        {
          path: "add-subject",
          element: <AddSubject />
        }
      ]
    }
  ]);

  return (
    <div className="">
      <div className='bg-gray-950 text-gray-100'>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;