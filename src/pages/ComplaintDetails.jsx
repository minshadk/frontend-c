import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ComplaintDetails = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  // const departments = ['PWD', 'KSEB', 'KWA']

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
      const filteredWorkers = response.data.workers.filter(worker => worker.department === department)
      setWorkers(filteredWorkers)
      setWorkersFetched(true)
    } catch (err) {
      console.error('Failed to fetch workers:', err)
    }
  }
  
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/complaints/${id}`)
        setComplaint(response.data.complaint)
        console.log(response.data.complaint)
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
    setWorkersFetched(false) // Allow refetching workers
    fetchWorkers(newDepartment) // Fetch workers immediately
  }

  const handleAssignWorker = async () => {
    if (!selectedWorker) return
    console.log(selectedWorker)
    try {
      const response = await axios.patch(`http://localhost:8001/complaints/${id}`, { assignedWorker: selectedWorker })
      console.log(response)
      setComplaint(prev => ({ ...prev, assignedWorker: workers.find(w => w._id === selectedWorker) }))
    } catch (err) {
      console.error('Failed to assign worker:', err)
    }
  }

  if (loading) return <p className="text-center mt-5">Loading details...</p>
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/admin/manageComplaints" className="text-blue-500 mb-4 inline-block">← Back to Complaints</Link>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <img src={complaint.complaintImage?.url || '/placeholder.jpg'} alt="Complaint" className="w-full h-60 object-cover rounded-md mb-4" />
        <h2 className="text-2xl font-bold mb-2">{complaint.title}</h2>
        <p className="text-gray-700 mb-4">{complaint.description}</p>
        <p className={`px-3 py-1 rounded-md text-white inline-block ${complaint.status === 'Pending' ? 'bg-yellow-500' : complaint.status === 'Resolved' ? 'bg-green-500' : 'bg-red-500'}`}>{complaint.status}</p>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 font-bold mb-2">Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="border rounded p-2 w-full mb-2"
          disabled={!!complaint.assignedWorker} // Disable if a worker is already assigned
        >
          <option value="">Select a department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <label className="block text-gray-700 font-bold mb-2">Assign Worker:</label>
        <select
          value={selectedWorker}
          onChange={(e) => setSelectedWorker(e.target.value)}
          className="border rounded p-2 w-full mb-2"
          disabled={workers.length === 0 || !!complaint.assignedWorker} // Disable if no workers or a worker is already assigned
        >
          <option value="">Select a worker</option>
          {workers.map(worker => (
            <option key={worker._id} value={worker._id}>{worker.userName}</option>
          ))}
        </select>
        <button
          onClick={handleAssignWorker}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!selectedWorker || !!complaint.assignedWorker} // Disable if no worker selected or a worker is already assigned
        >
          Assign Worker
        </button>
      </div>
      {complaint.assignedWorker && (
        <p className="mt-4 text-green-600">Assigned Worker: {complaint.assignedWorker.userName}</p>
      )}
    </div>
  )
}

export default ComplaintDetails