import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader, Smile, Frown, Meh, Filter, User, AlertCircle } from 'lucide-react'; // Icons for feedback and loading

const AllFeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/feedback`);
        setFeedbacks(response.data.feedbacks);
        setFilteredFeedbacks(response.data.feedbacks);
      } catch (err) {
        setError('Failed to load feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeedbacks();
  }, [user?.role]);

  // Filter feedback based on satisfaction level
  useEffect(() => {
    if (filter === 'all') {
      setFilteredFeedbacks(feedbacks);
    } else {
      setFilteredFeedbacks(
        feedbacks.filter((feedback) => feedback.satisfactionLevel === filter),
      );
    }
  }, [filter, feedbacks]);

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
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          All Feedbacks
        </h2>

        {/* Filter Dropdown */}
        <div className="mb-6 flex justify-end">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="Very Bad">Very Bad</option>
              <option value="Bad">Bad</option>
              <option value="Satisfied">Satisfied</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
            </select>
          </div>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <p className="text-gray-600 text-center">No feedbacks available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() =>
                  navigate(`/admin/complaints/${feedback.complaintId?._id}`)
                }
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feedback.complaintId?.title || 'No Title'}
                </h3>
                <p className="text-gray-600 mb-4">{feedback.description}</p>

                {/* Satisfaction Level */}
                <div className="flex items-center space-x-2 mb-4">
                  {feedback.satisfactionLevel === 'Very Good' ||
                  feedback.satisfactionLevel === 'Good' ? (
                    <Smile className="h-5 w-5 text-green-500" />
                  ) : feedback.satisfactionLevel === 'Satisfied' ? (
                    <Meh className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Frown className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-700">
                    {feedback.satisfactionLevel}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-blue-500" />
                  <span>{feedback.user?.userName || 'Unknown'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFeedBacks;