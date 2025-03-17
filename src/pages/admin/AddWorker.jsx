import React, { useState } from 'react'
import axios from 'axios'

const AddWorker = () => {
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    department: '',
    password: '',
    userType: 'worker',
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const departments = ['PWD', 'KSEB', 'KWA']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
    setErrorMessage('')
  }

  const validateForm = () => {
    let valid = true
    let newErrors = {}

    if (!formData.userName.trim()) {
      newErrors.userName = 'Worker name is required.'
      valid = false
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.'
      valid = false
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.'
      valid = false
    }

    if (!formData.department) {
      newErrors.department = 'Department is required.'
      valid = false
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.'
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:8001/user/signup',
        formData,
      )
      setSuccessMessage(response.data.message || 'Worker added successfully!')
      setFormData({
        userName: '',
        phoneNumber: '',
        department: '',
        password: '',
      })
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to add worker.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Add Worker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Worker Name</label>
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
          <label className="block font-medium">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm">{errors.department}</p>
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Worker'}
        </button>

        {successMessage && (
          <p className="text-green-500 text-sm text-center mt-2">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  )
}

export default AddWorker
