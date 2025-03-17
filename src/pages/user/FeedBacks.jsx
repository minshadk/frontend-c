import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Loader, Smile, Frown, Meh, AlertCircle, FileText } from 'lucide-react'; // Icons for feedback and loading

const FeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user?.userId) return;

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/feedback/byUser/${user.userId}`,
        );
        setFeedbacks(response.data.feedbacks);
      } catch (err) {
        setError('Failed to load feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user?.userId]);

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
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Feedbacks
        </h2>
        {feedbacks.length === 0 ? (
          <p className="text-gray-600 text-center">No feedbacks submitted yet.</p>
        ) : (
          <div className="space-y-6">
            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {feedback.complaintId?.title || 'Complaint'}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{feedback.description}</p>
                <div className="flex items-center space-x-2">
                  {feedback.satisfactionLevel === 'Very Good' ||
                  feedback.satisfactionLevel === 'Good' ? (
                    <Smile className="h-5 w-5 text-green-500" />
                  ) : feedback.satisfactionLevel === 'Satisfied' ? (
                    <Meh className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Frown className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-600">
                    Satisfaction Level: {feedback.satisfactionLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedBacks;