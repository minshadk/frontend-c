import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-lg font-semibold">Civic Fix</h1>

      {user?.userType === 'user' && (
        <div className="flex gap-4 items-center">
          <div className="flex justify-center gap-4 items-center flex-grow">
            <Link
              to="/users/complaintStatus"
              className="px-4 py-2 rounded-md text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Complaint Status
            </Link>
            <Link
              to="/users/registerComplaint"
              className="px-4 py-2 rounded-md text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register Complaint
            </Link>
            <Link
              to="/users/feedBacks"
              className="px-4 py-2 rounded-md text-white hover:text-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Feedbacks
            </Link>
          </div>
        </div>
      )}
      <div className="flex gap-4 items-center">
        {user && (
          <>
            <span className="font-semibold text-gray-200">
              {user?.userName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
