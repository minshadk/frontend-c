import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthContext } from '../hooks/useAuthContext'
import {
  Loader,
  ArrowLeft,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Briefcase,
  HardHat,
} from 'lucide-react' // Icons for UI elements

const ComplaintDetails = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [departments] = useState(['PWD', 'KSEB', 'KWA'])
  const [workers, setWorkers] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedWorker, setSelectedWorker] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [workersFetched, setWorkersFetched] = useState(false)

  const fetchWorkers = async (department) => {
    if (!department) return
    try {
      const response = await axios.get('http://localhost:8001/user/workers')
      const filteredWorkers = response.data.workers.filter(
        (worker) => worker.department === department,
      )
      setWorkers(filteredWorkers)
      setWorkersFetched(true)
    } catch (err) {
      console.error('Failed to fetch workers:', err)
    }
  }

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/complaints/${id}`,
        )
        console.log(response.data.complaint)
        setComplaint(response.data.complaint)
        setSelectedDepartment(response.data.complaint.department)

        // If a worker is already assigned, set the selected worker
        if (response.data.complaint.assignedWorker) {
          setSelectedWorker(response.data.complaint.assignedWorker._id)
        }

        fetchWorkers(response.data.complaint.department) // Fetch workers when complaint loads
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch complaint details')
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [id])

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value
    setSelectedDepartment(newDepartment)
    setWorkersFetched(false)
    fetchWorkers(newDepartment)
  }

  const handleAssignWorker = async () => {
    if (!selectedWorker) return
    try {
      const response = await axios.patch(
        `http://localhost:8001/complaints/${id}`,
        { assignedWorker: selectedWorker, department: selectedDepartment },
      )
      setComplaint((prev) => ({
        ...prev,
        assignedWorker: workers.find((w) => w._id === selectedWorker),
      }))
    } catch (err) {
      console.error('Failed to assign worker:', err)
    }
  }

  const handlePickWork = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8001/complaints/${id}`,
        { assignedWorker: user.userId, department: user.department },
      )
      setComplaint((prev) => ({
        ...prev,
        assignedWorker: {
          _id: user._id,
          userName: user.userName,
          phoneNumber: user.phoneNumber,
        },
      }))
    } catch (err) {
      console.error('Failed to pick work:', err)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />{' '}
        {/* Loading spinner */}
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-red-500 text-lg ml-2">{error}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          onClick={() => navigate(-1)}
          className="text-blue-500 mb-4 inline-flex items-center cursor-pointer hover:text-blue-600 transition duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Link>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Complaint Image */}
          <img
            src={complaint.complaintImage?.url || '/placeholder.jpg'}
            alt="Complaint"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          {/* Complaint Title and Description */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {complaint.title}
          </h2>
          <p className="text-gray-600 mb-6">{complaint.description}</p>

          {/* Complaint Status */}
          <div className="flex items-center space-x-2 mb-6">
            <span
              className={`px-3 py-1 rounded-md text-white ${
                complaint.status === 'pending'
                  ? 'bg-yellow-500'
                  : complaint.status === 'completed'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            >
              {complaint.status}
            </span>
          </div>

          {/* Resolved Image */}
          {complaint.resolveImage?.url && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Resolved Image
              </h2>
              <img
                src={complaint.resolveImage?.url || '/placeholder.jpg'}
                alt="Resolved Complaint"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Assigned Worker Section */}
          {complaint.assignedWorker ? (
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Assigned Worker
              </h2>
              <div className="flex items-center space-x-4">
                <User className="h-6 w-6 text-blue-500" />
                <p className="text-gray-700">
                  {complaint.assignedWorker.userName}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <Phone className="h-6 w-6 text-blue-500" />
                <p className="text-gray-700">
                  {complaint.assignedWorker.phoneNumber}
                </p>
              </div>
            </div>
          ) : user.userType === 'admin' ? (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Assign Worker
              </h2>
              <div className="space-y-4">
                {/* Department Dropdown */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                      Select Department:
                    </span>
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Worker Dropdown */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <span className="flex items-center">
                      <HardHat className="h-5 w-5 mr-2 text-blue-500" />
                      Assign Worker:
                    </span>
                  </label>
                  <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a worker</option>
                    {workers.map((worker) => (
                      <option key={worker._id} value={worker._id}>
                        {worker.userName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign Worker Button */}
                <button
                  onClick={handleAssignWorker}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={!selectedWorker}
                >
                  Assign Worker
                </button>
              </div>
            </div>
          ) : user.userType === 'worker' ? (
            <div className="mt-6">
              <button
                onClick={handlePickWork}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
              >
                Pick Work
              </button>
            </div>
          ) : null}
          {complaint.userId && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner mt-5">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Assigned Worker
              </h2>
              <div className="flex items-center space-x-4">
                <User className="h-6 w-6 text-blue-500" />
                <p className="text-gray-700">
                  {complaint.userId.userName}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <Phone className="h-6 w-6 text-blue-500" />
                <p className="text-gray-700">
                  {complaint.userId.phoneNumber}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetails
