import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const AllFeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/feedback`)
        setFeedbacks(response.data.feedbacks)
        setFilteredFeedbacks(response.data.feedbacks)
      } catch (err) {
        setError('Failed to load feedbacks.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllFeedbacks()
  }, [user?.role])

  // Filter feedback based on satisfaction level
  useEffect(() => {
    if (filter === 'all') {
      setFilteredFeedbacks(feedbacks)
    } else {
      setFilteredFeedbacks(
        feedbacks.filter((feedback) => feedback.satisfactionLevel === filter),
      )
    }
  }, [filter, feedbacks])

  if (loading) return <p className="text-center mt-5">Loading feedbacks...</p>
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        All Feedbacks
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md bg-gray-100"
        >
          <option value="all">All</option>
          <option value="Very Bad">Very Bad</option>
          <option value="Bad">Bad</option>
          <option value="Satisfied">Satisfied</option>
          <option value="Good">Good</option>
          <option value="Very Good">Very Good</option>
        </select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p className="text-gray-500 text-center">No feedbacks available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-4 bg-gray-50 shadow-md rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
              onClick={() =>
                navigate(`/admin/complaints/${feedback.complaintId?._id}`)
              }
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {feedback.complaintId?.title || 'No Title'}
              </h3>
              <p className="text-gray-700 mt-2">{feedback.description}</p>

              {/* Satisfaction Level */}
              <div className="mt-2">
                <span className="font-bold">Satisfaction:</span>{' '}
                <span className="text-blue-600">
                  {feedback.satisfactionLevel}
                </span>
              </div>

              {/* User Info */}
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-bold">User:</span>{' '}
                {feedback.user?.name || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllFeedBacks
