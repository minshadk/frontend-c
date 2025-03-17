import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Loader, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'; // Icons for status and loading

const AllDepartmentWorks = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !user.department) {
      setError('No department assigned to the user.');
      setLoading(false);
      return;
    }

    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8001/complaints');
        const filteredComplaints = response.data.complaints
          .filter((c) => c.department === user.department) // Filter by user's department
          .map((c) => ({
            ...c,
            complaintImage: c.complaintImage || { url: '/placeholder.jpg' },
          }));

        setComplaints(filteredComplaints);
      } catch (err) {
        setError('Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-blue-500" /> {/* Loading spinner */}
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-red-500 text-lg ml-2">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Department Complaints
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <Link
                to={`/admin/complaints/${complaint._id}`}
                key={complaint._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Complaint Image */}
                <img
                  src={complaint.complaintImage.url || '/placeholder.jpg'}
                  alt="Complaint"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                {/* Complaint Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {complaint.title}
                </h3>

                {/* Complaint Status */}
                <div className="flex items-center space-x-2">
                  {complaint.status === 'pending' ? (
                    <Clock className="h-5 w-5 text-red-500" />
                  ) : complaint.status === 'In Progress' ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : complaint.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      complaint.status === 'pending'
                        ? 'text-red-600'
                        : complaint.status === 'In Progress'
                        ? 'text-yellow-600'
                        : complaint.status === 'completed'
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-600">
              No complaints found for your department.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDepartmentWorks;