import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Loader, Image, MapPin, FileText, AlertCircle, CheckCircle } from 'lucide-react'; // Icons for form fields and messages

const RegisterComplaint = () => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    place: '',
    image: null,
    userId: user.userId,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setErrorMessage('');
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors({ ...errors, image: '' });
  };

  // Form Validation
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
      valid = false;
    }

    if (!formData.place.trim()) {
      newErrors.place = 'Place is required.';
      valid = false;
    }

    if (!formData.image) {
      newErrors.image = 'Image is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const complaintData = new FormData();
    complaintData.append('title', formData.title);
    complaintData.append('description', formData.description);
    complaintData.append('address', formData.place);
    complaintData.append('image', formData.image);
    complaintData.append('userId', formData.userId);

    try {
      const response = await axios.post(
        'http://localhost:8001/complaints/create',
        complaintData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      setSuccessMessage(
        response.data.message || 'Complaint registered successfully!',
      );
      setFormData({
        title: '',
        description: '',
        place: '',
        image: null,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to register complaint.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register Complaint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Title
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter complaint title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Description
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe your complaint"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Place Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Place
              </span>
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the place of complaint"
            />
            {errors.place && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.place}
              </p>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <Image className="h-5 w-5 mr-2 text-blue-500" />
                Upload Image
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.image}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Submit Complaint'
            )}
          </button>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-500 text-sm">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-500 text-sm">{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterComplaint;