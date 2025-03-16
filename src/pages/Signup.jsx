import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate() // Initialize navigate function
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    userName: '',
    phoneNumber: '',
    password: '',
  })

  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { userName: '', phoneNumber: '', password: '' }

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required'
      valid = false
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits'
      valid = false
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const response = await axios.post(
          'http://localhost:8001/user/signup',
          formData,
        )
        setSuccessMessage(response.data.message || 'Signup successful!')
        setFormData({ userName: '', phoneNumber: '', password: '' })

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (error) {
        setErrors(error.response?.data?.message || 'Signup failed. Try again.')
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Signup
          </button>
          {successMessage && (
            <p className="text-green-500 text-sm text-center">
              {successMessage}
            </p>
          )}

          <p className="text-center mt-4">
            have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
