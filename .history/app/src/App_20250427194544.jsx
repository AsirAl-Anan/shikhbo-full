import { useEffect, useState } from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from './pages/Auth/Auth';
import HomePage from './pages/Home';
import { useContext } from 'react';
import { AuthContext } from './context/UserContext';
import SneakersPage from './pages/QuestionBank';
import NewChatPage from './pages/NewChatPage';
function App() {

  const { currentUser } = useContext(AuthContext);
 
  // Create router with the modern createBrowserRouter syntax
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/questionbank",
      element: <SneakersPage />
    },
   
  
    {
      path: "/auth",
      element: <AuthPage />
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