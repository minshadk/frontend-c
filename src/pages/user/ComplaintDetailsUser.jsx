import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuthContext } from '../../hooks/useAuthContext'

const ComplaintDetailsUser = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState({
    description: '',
    satisfactionLevel: 'Satisfied',
  })
  const [feedbackSuccess, setFeedbackSuccess] = useState('')

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/complaints/${id}`,
        )
        console.log(response.data.complaint)
        setComplaint(response.data.complaint)
      } catch (err) {
        setError('Failed to load complaint details.')
      } finally {
        setLoading(false)
      }
    }

    fetchComplaint()
  }, [id])

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target
    setFeedback((prev) => ({ ...prev, [name]: value }))
  }

  const submitFeedback = async () => {
    if (!user?.userId) {
      alert('You must be logged in to submit feedback.')
      return
    }

    try {
      await axios.post('http://localhost:8001/feedback/create', {
        complaintId: id,
        user: user.userId,
        description: feedback.description,
        satisfactionLevel: feedback.satisfactionLevel,
      })

      setFeedbackSuccess('Feedback submitted successfully!')
      setFeedback({ description: '', satisfactionLevel: 'Satisfied' })
    } catch (err) {
      alert('Failed to submit feedback. Please try again.')
    }
  }

  if (loading)
    return <p className="text-center mt-5">Loading complaint details...</p>
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {complaint.title}
      </h2>
      <p className="text-gray-700">{complaint.description}</p>

      {/* Complaint Image */}
      {complaint.complaintImage?.url && (
        <img
          src={complaint.complaintImage.url}
          alt="Complaint"
          className="w-full h-60 object-cover rounded-lg mt-4"
        />
      )}

      <div className="flex justify-between items-center mt-4">
        <span
          className={`px-3 py-1 text-sm font-bold rounded-md ${
            complaint.status === 'Resolved'
              ? 'bg-green-500 text-white'
              : complaint.status === 'complete'
              ? 'bg-blue-500 text-white'
              : 'bg-yellow-500 text-white'
          }`}
        >
          {complaint.status}
        </span>
        <span className="text-sm text-gray-600">
          Created on: {new Date(complaint.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Resolved Image (if available) */}
      {complaint.resolveImage?.url && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-600">
            Resolved Image:
          </h3>
          <img
            src={complaint.resolveImage.url}
            alt="Resolved"
            className="w-full h-60 object-cover rounded-lg mt-2"
          />
        </div>
      )}

      {/* Feedback Section (only if complaint is complete) */}
      {complaint.status === 'completed' && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Submit Feedback</h3>

          <label className="block text-gray-700">Feedback Description:</label>
          <textarea
            name="description"
            value={feedback.description}
            onChange={handleFeedbackChange}
            className="w-full p-2 border rounded-md mb-3"
            rows="3"
            placeholder="Write your feedback..."
          />

          <label className="block text-gray-700">Satisfaction Level:</label>
          <select
            name="satisfactionLevel"
            value={feedback.satisfactionLevel}
            onChange={handleFeedbackChange}
            className="w-full p-2 border rounded-md mb-3"
          >
            <option value="Very Bad">Very Bad</option>
            <option value="Bad">Bad</option>
            <option value="Satisfied">Satisfied</option>
            <option value="Good">Good</option>
            <option value="Very Good">Very Good</option>
          </select>

          <button
            onClick={submitFeedback}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Feedback
          </button>

          {feedbackSuccess && (
            <p className="text-green-600 mt-2">{feedbackSuccess}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ComplaintDetailsUser
