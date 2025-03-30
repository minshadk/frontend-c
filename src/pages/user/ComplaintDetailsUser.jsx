import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { 
  Loader, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Smile, 
  Frown,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';

const ComplaintDetailsUser = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({
    description: '',
    satisfactionLevel: 'Satisfied',
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [currentComplaintImageIndex, setCurrentComplaintImageIndex] = useState(0);
  const [currentResolvedImageIndex, setCurrentResolvedImageIndex] = useState(0);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/complaints/${id}`,
        );
        setComplaint(response.data.complaint);
      } catch (err) {
        setError('Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  // Helper function to get all images of a specific type
  const getImages = (type) => {
    if (type === 'complaint') {
      return [
        ...(complaint?.complaintImage ? [complaint.complaintImage] : []),
        ...(complaint?.images?.filter(img => img.type === 'complaint') || [])
      ].filter(Boolean);
    } else {
      return [
        ...(complaint?.resolveImage ? [complaint.resolveImage] : []),
        ...(complaint?.images?.filter(img => img.type === 'resolved') || [])
      ].filter(Boolean);
    }
  };

  const complaintImages = getImages('complaint');
  const resolvedImages = getImages('resolved');

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const submitFeedback = async () => {
    if (!user?.userId) {
      alert('You must be logged in to submit feedback.');
      return;
    }

    if (!feedback.description.trim()) {
      alert('Please provide feedback description.');
      return;
    }

    try {
      await axios.post('http://localhost:8001/feedback/create', {
        complaintId: id,
        user: user.userId,
        description: feedback.description,
        satisfactionLevel: feedback.satisfactionLevel,
      });

      setFeedbackSuccess('Feedback submitted successfully!');
      setFeedback({ description: '', satisfactionLevel: 'Satisfied' });
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    }
  };

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
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {complaint.title}
        </h2>
        <p className="text-gray-600 mb-6">{complaint.description}</p>

        {/* Complaint Images Section */}
        {complaintImages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Camera className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Complaint Images</h3>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg p-4">
              <div className="flex justify-center items-center">
                <img
                  src={complaintImages[currentComplaintImageIndex]?.url || '/placeholder.jpg'}
                  alt={`Complaint ${currentComplaintImageIndex + 1}`}
                  className="max-h-96 max-w-full object-contain rounded-lg"
                />
              </div>
              
              {complaintImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentComplaintImageIndex(prev => 
                      prev === 0 ? complaintImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrentComplaintImageIndex(prev => 
                      prev === complaintImages.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {complaintImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentComplaintImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${currentComplaintImageIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Status and Date */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {complaint.status === 'Resolved' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-md ${
                complaint.status === 'Resolved'
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

        {/* Resolved Images Section */}
        {resolvedImages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Resolved Images</h3>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg p-4">
              <div className="flex justify-center items-center">
                <img
                  src={resolvedImages[currentResolvedImageIndex]?.url || '/placeholder.jpg'}
                  alt={`Resolved ${currentResolvedImageIndex + 1}`}
                  className="max-h-96 max-w-full object-contain rounded-lg"
                />
              </div>
              
              {resolvedImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentResolvedImageIndex(prev => 
                      prev === 0 ? resolvedImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrentResolvedImageIndex(prev => 
                      prev === resolvedImages.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {resolvedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentResolvedImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${currentResolvedImageIndex === index ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Feedback Section (only if complaint is completed) */}
        {complaint.status === 'completed' && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Submit Feedback
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Feedback Description:</label>
              <textarea
                name="description"
                value={feedback.description}
                onChange={handleFeedbackChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Write your feedback..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Satisfaction Level:</label>
              <select
                name="satisfactionLevel"
                value={feedback.satisfactionLevel}
                onChange={handleFeedbackChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Very Bad">Very Bad</option>
                <option value="Bad">Bad</option>
                <option value="Satisfied">Satisfied</option>
                <option value="Good">Good</option>
                <option value="Very Good">Very Good</option>
              </select>
            </div>

            <button
              onClick={submitFeedback}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Feedback
            </button>

            {feedbackSuccess && (
              <div className="mt-4 flex items-center space-x-2">
                <Smile className="h-5 w-5 text-green-500" />
                <p className="text-green-600">{feedbackSuccess}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailsUser;