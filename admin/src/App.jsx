import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AdminPanel from './Pages/Admin';
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AdminPanel />
    }
  ])
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
