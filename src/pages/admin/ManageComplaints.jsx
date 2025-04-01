import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader, AlertCircle, Clock, CheckCircle, XCircle, Search ,MapPin} from 'lucide-react';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8001/complaints');
        const formattedComplaints = response.data.complaints.map((c) => ({
          ...c,
          complaintImage: c.complaintImage || { url: '/placeholder.jpg' },
        }));
        setComplaints(formattedComplaints);
        setFilteredComplaints(formattedComplaints);
      } catch (err) {
        setError('Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(complaint => 
        complaint.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComplaints(filtered);
    }
  }, [searchTerm, complaints]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
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
          Manage Complaints
        </h2>
        
        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
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

                {/* Complaint Location */}
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {complaint.address || 'Location not specified'}
                </p>

                {/* Complaint Status */}
                <div className="flex items-center space-x-2">
                  {complaint.status === 'pending' ? (
                    <Clock className="h-5 w-5 text-red-500" />
                  ) : complaint.status === 'in progress' ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : complaint.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      complaint.status === 'pending'
                        ? 'text-red-600'
                        : complaint.status === 'in progress'
                        ? 'text-yellow-600'
                        : complaint.status === 'completed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center col-span-3 py-10">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                {searchTerm.trim() ? 
                  `No complaints found matching "${searchTerm}"` : 
                  'No complaints found.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageComplaints;