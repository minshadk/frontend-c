import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8001/complaints')
        const formattedComplaints = response.data.complaints.map((c) => ({
          ...c,
          complaintImage: c.complaintImage || { url: '/placeholder.jpg' },
        }))
        console.log(formattedComplaints)
        setComplaints(formattedComplaints)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch complaints')
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  if (loading) return <p className="text-center mt-5">Loading complaints...</p>
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Complaints</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <Link
              to={`/admin/complaints/${complaint._id}`} // Ensure the leading slash "/"
              key={complaint._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={complaint.complaintImage.url || '/placeholder.jpg'}
                alt="Complaint"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold">{complaint.title}</h3>
              <p
                className={`mt-2 px-2 py-1 rounded-md text-white ${
                  complaint.status === 'pending'
                    ? 'bg-red-500'
                    : complaint.status === 'In Progress'
                    ? 'bg-yellow-500'
                    : complaint.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                {complaint.status}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No complaints found.
          </p>
        )}
      </div>
    </div>
  )
}

export default ManageComplaints
