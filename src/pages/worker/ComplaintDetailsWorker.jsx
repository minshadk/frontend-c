import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FaUpload,
  FaCheckCircle,
  FaPhone,
  FaUser,
  FaInfoCircle,
} from 'react-icons/fa'
import { Loader, ArrowLeft } from 'lucide-react'

const ComplaintDetailsWorker = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolveImage, setResolveImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/complaints/${id}`,
        )
        setComplaint(response.data.complaint)
      } catch (err) {
        console.error('Error fetching complaint details:', err)
        setError('Failed to load complaint details')
      } finally {
        setLoading(false)
      }
    }

    fetchComplaintDetails()
  }, [id])

  const handleFileChange = (e) => {
    setResolveImage(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!resolveImage) return alert('Please select an image first')

    const formData = new FormData()
    formData.append('image', resolveImage)

    try {
      setUploading(true)
      const response = await axios.patch(
        `http://localhost:8001/complaints/resolve-image/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      setComplaint((prev) => ({
        ...prev,
        resolveImage: response.data.resolveImage,
      }))
      setResolveImage(null)
    } catch (err) {
      console.error('Error uploading resolve image:', err)
      alert('Failed to upload resolve image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <FaInfoCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!complaint) return null

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <Link
            onClick={() => navigate(-1)}
            className="text-blue-500 mb-4 inline-flex items-center cursor-pointer hover:text-blue-600 transition duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            Complaint Details
          </h2>

          {/* Complaint Image */}
          {complaint.complaintImage?.url && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Complaint Image
              </h3>
              <img
                src={complaint.complaintImage.url}
                alt="Complaint"
                className="w-full h-80 object-contain rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}

          {/* Complaint Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-600">Title:</div>
              <div className="w-2/3 text-gray-800 font-semibold">
                {complaint.title}
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-600">Address:</div>
              <div className="w-2/3 text-gray-800 font-semibold">
                {complaint.address}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-600">
                Description:
              </div>
              <div className="w-2/3 text-gray-800">{complaint.description}</div>
            </div>

            <div className="flex items-center">
              <div className="w-1/3 font-medium text-gray-600">Status:</div>
              <div className="w-2/3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    complaint.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : complaint.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>

          {/* Complainant Details */}
          {complaint.userId && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Complainant Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-1/3 font-medium text-gray-600">Name:</span>
                  <span className="w-2/3 text-gray-800">
                    {complaint.userId.userName}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium text-gray-600">
                    Phone:
                  </span>
                  <span className="w-2/3 text-gray-800 flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    {complaint.userId.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Resolved Image Section */}
          {complaint.resolveImage ? (
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" />
                Resolved Image
              </h3>
              <img
                src={complaint.resolveImage.url}
                alt="Resolved"
                className="w-full h-80 object-contain rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          ) : (
            /* Upload Section - Only shown if no resolve image exists */
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Upload Resolved Image
              </h3>
              <div className="flex flex-col items-center">
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center">
                  <FaUpload className="mr-2" />
                  Choose Image
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {resolveImage && (
                  <p className="mt-3 text-sm text-gray-600">
                    Selected: {resolveImage.name}
                  </p>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!resolveImage || uploading}
                  className={`mt-4 px-6 py-2 rounded-lg font-medium ${
                    !resolveImage
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition duration-300`}
                >
                  {uploading ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload Image'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetailsWorker
