import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../hooks/useAuthContext'

const FeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuthContext()

  useEffect(() => {
    if (!user?.userId) return

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/feedback/byUser/${user.userId}`,
        )
        setFeedbacks(response.data.feedbacks)
      } catch (err) {
        setError('Failed to load feedbacks.')
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [user?.userId])

  if (loading) return <p className="text-center mt-5">Loading feedbacks...</p>
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Your Feedbacks
      </h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center">No feedbacks submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-4 bg-gray-100 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {feedback.complaintId?.title || 'Complaint'}
              </h3>
              <p className="text-gray-700">{feedback.description}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-semibold text-gray-600 mr-2">
                  Satisfaction Level: {feedback.satisfactionLevel}
                </span>
                {/* {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-4 w-4 mx-0.5 inline-block rounded-full ${
                      index < parseInt(feedback.satisfactionLevel)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  ></span>
                ))} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FeedBacks
