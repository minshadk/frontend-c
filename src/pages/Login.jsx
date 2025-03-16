import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAuthContext } from '../hooks/useAuthContext';

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
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

          {loginError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {loginError}
            </p>
          )}

          {successMessage && (
            <p className="text-green-500 text-sm text-center mt-2">
              {successMessage}
            </p>
          )}

          {/* Link to Signup Page */}
          <p className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signUp" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;