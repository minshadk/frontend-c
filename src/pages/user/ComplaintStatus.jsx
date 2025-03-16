import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link } from 'react-router-dom'

const ComplaintStatus = () => {
  const { user } = useAuthContext()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    fetchComplaints()
  }, [user])

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/complaints/byUserId/${user.userId}`,
      )
      setComplaints(response.data.complaints)
    } catch (err) {
      setError('Failed to load complaints.', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Your Complaints
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : complaints.length === 0 ? (
        <p className="text-center">No complaints found.</p>
      ) : (
        <div className="space-y-6">
          {complaints.map((complaint) => (
            <Link
              key={complaint._id}
              to={`/users/ComplaintDetailsUser/${complaint._id}`} // Corrected path
              className="block border rounded-lg p-5 shadow-md bg-gray-100 hover:bg-gray-200 transition"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {complaint.title}
              </h3>
              <p className="text-gray-700 mb-3">{complaint.description}</p>

              {complaint.complaintImage?.url && (
                <img
                  src={complaint.complaintImage.url}
                  alt="Complaint"
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}

              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-md ${
                    complaint.status === 'Resolved'
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {complaint.status}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ComplaintStatus
