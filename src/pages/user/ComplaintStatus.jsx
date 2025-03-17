import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import { Loader, CheckCircle, AlertCircle, Calendar } from 'lucide-react'; // Icons for status and date

const ComplaintStatus = () => {
  const { user } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/complaints/byUserId/${user.userId}`,
      );
      setComplaints(response.data.complaints);
    } catch (err) {
      setError('Failed to load complaints. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Complaints
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin h-8 w-8 text-blue-500" /> {/* Loading spinner */}
          </div>
        ) : error ? (
          <div className="flex justify-center items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : complaints.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No complaints found.</p>
        ) : (
          <div className="space-y-6">
            {complaints.map((complaint) => (
              <Link
                key={complaint._id}
                to={`/users/ComplaintDetailsUser/${complaint._id}`}
                className="block border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {complaint.title}
                </h3>
                <p className="text-gray-600 mb-4">{complaint.description}</p>

                {complaint.complaintImage?.url && (
                  <img
                    src={complaint.complaintImage.url}
                    alt="Complaint"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {complaint.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-md ${
                        complaint.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatus;