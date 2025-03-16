import { useState } from 'react'
import axios from 'axios'

import { useAuthContext } from '../../hooks/useAuthContext'

const RegisterComplaint = () => {
  const { user } = useAuthContext()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    place: '',
    // department: '',
    image: null,
    userId: user.userId,
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const departments = ['HR', 'Engineering', 'Sales', 'Marketing', 'Support']

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
    setErrorMessage('')
  }

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] })
    setErrors({ ...errors, image: '' })
  }

  // Form Validation
  const validateForm = () => {
    let valid = true
    let newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.'
      valid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.'
      valid = false
    }

    if (!formData.place.trim()) {
      newErrors.place = 'Place is required.'
      valid = false
    }

    // if (!formData.department) {
    //   newErrors.department = 'Department is required.'
    //   valid = false
    // }

    if (!formData.image) {
      newErrors.image = 'Image is required.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const complaintData = new FormData()
    complaintData.append('title', formData.title)
    complaintData.append('description', formData.description)
    complaintData.append('address', formData.place)
    complaintData.append('department', formData.department)
    complaintData.append('image', formData.image)
    complaintData.append('userId', formData.userId)

    try {
      const response = await axios.post(
        'http://localhost:8001/complaints/create',
        complaintData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )

      setSuccessMessage(
        response.data.message || 'Complaint registered successfully!',
      )
      setFormData({
        title: '',
        description: '',
        place: '',
        department: '',
        image: null,
      })
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to register complaint.',
      )
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Register Complaint
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Place */}
        <div>
          <label className="block font-medium">Place</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.place && (
            <p className="text-red-500 text-sm">{errors.place}</p>
          )}
        </div>

        {/* Department Dropdown */}
        {/* <div>
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
        </div> */}

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit Complaint
        </button>

        {/* Messages */}
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

export default RegisterComplaint
