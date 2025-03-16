import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ComplaintDetailsUser = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

      {/* Status and Date */}
    </div>
  )
}

export default ComplaintDetailsUser
