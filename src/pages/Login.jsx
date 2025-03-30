import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { Loader, User, Lock, AlertCircle, CheckCircle } from 'lucide-react'; // Icons for form fields and messages

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    userName: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setLoginError('');
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { userName: '', password: '' };

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post(
          'http://localhost:8001/user/login',
          formData,
        );

        console.log('Login response:', response.data);

        if (
          !response.data ||
          !response.data.data ||
          !response.data.data.userData
        ) {
          throw new Error('Invalid response from server');
        }

        const { token, userType } = response.data.data.userData;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);

        dispatch({ type: 'LOGIN', payload: response.data.data.userData });

        setSuccessMessage(response.data.message || 'Login successful!');
        setLoginError('');
        setFormData({ userName: '', password: '' });

        setTimeout(() => {
          if (userType === 'admin') {
            navigate('/admin/manageComplaints');
          } else if (userType === 'worker') {
            navigate('/worker/manageWork');
          } else {
            navigate('/users/registerComplaint');
          }
        }, 1000);
      } catch (error) {
        console.error('Login error:', error);
        setSuccessMessage('');
        setLoginError(
          error.response?.data?.message || 'Invalid username or password',
        );
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Username
              </span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.userName}
              </p>
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
      

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              'Login'
            )}
          </button>

          {/* Error and Success Messages */}
          {loginError && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-500 text-sm">{loginError}</p>
            </div>
          )}
          {successMessage && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-500 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Signup Link */}
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signUp"
              className="text-blue-500 hover:text-blue-600"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;