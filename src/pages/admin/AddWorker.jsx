import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, User, Phone, Briefcase, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const AddWorker = () => {
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    department: '',
    password: '',
    userType: 'worker', // Explicitly set to 'worker'
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8001/departments');
        const fetchedDepartments = Array.isArray(response.data) 
          ? response.data 
          : response.data.departments || [];
        
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        setErrorMessage('Failed to load departments. Please try again later.');
      } finally {
        setFetchingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setErrorMessage('');
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Worker name is required.';
      valid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
      valid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Department is required.';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Create payload with worker-specific fields
      const workerData = {
        ...formData,
        department: formData.department, // Ensure department is included
        userType: 'worker' // Explicitly set userType
      };

      const response = await axios.post(
        'http://localhost:8001/user/signup',
        workerData
      );
      
      setSuccessMessage(response.data.message || 'Worker added successfully!');
      setFormData({
        userName: '',
        phoneNumber: '',
        department: '',
        password: '',
        userType: 'worker' // Reset with worker type
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add worker.';
      setErrorMessage(errorMsg.includes('duplicate') 
        ? 'Worker with this phone number already exists' 
        : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add Worker
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Worker Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Worker Name
              </span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter worker name"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.userName}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-500" />
                Phone Number
              </span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                Department
              </span>
            </label>
            {fetchingDepartments ? (
              <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                <Loader className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option 
                      key={typeof dept === 'string' ? dept : dept._id} 
                      value={typeof dept === 'string' ? dept : dept.name}
                    >
                      {typeof dept === 'string' ? dept : dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.department}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-500" />
                Password
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={loading || fetchingDepartments}
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Add Worker'
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

export default AddWorker;