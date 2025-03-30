import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader, 
  Briefcase, 
  CheckCircle, 
  AlertCircle,
  Plus
} from 'lucide-react';

const CreateDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8001/departments');
        // Handle array response directly
        const fetchedDepartments = Array.isArray(response.data) 
          ? response.data 
          : response.data.departments || [];
        
        setDepartments(fetchedDepartments);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to fetch departments.');
      } finally {
        setFetching(false);
      }
    };

    fetchDepartments();
  }, []);

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!departmentName.trim()) {
      newErrors.departmentName = 'Department name is required.';
      valid = false;
    } else if (departments.some(dept => 
      dept.name ? 
        dept.name.toLowerCase() === departmentName.trim().toLowerCase() :
        dept.toLowerCase() === departmentName.trim().toLowerCase()
    )) {
      newErrors.departmentName = 'Department already exists.';
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
      const response = await axios.post(
        'http://localhost:8001/departments/create',
        { name: departmentName }
      );
      
      // Extract the department from the response
      const responseData = response.data;
      let newDepartment;
      
      if (responseData.department) {
        // If response has a department field
        newDepartment = responseData.department;
      } else if (responseData.user) {
        // If response has a user field with department info
        newDepartment = responseData.user.department || departmentName;
      } else {
        // Fallback to the department name we sent
        newDepartment = departmentName;
      }
      
      setSuccessMessage(responseData.message || `Department "${departmentName}" created successfully!`);
      setDepartments([...departments, newDepartment]);
      setDepartmentName('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create department.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Manage Departments
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <span className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                Department Name
              </span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={departmentName}
                onChange={(e) => {
                  setDepartmentName(e.target.value);
                  setErrors({...errors, departmentName: ''});
                  setErrorMessage('');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter department name"
              />
            </div>
            {errors.departmentName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.departmentName}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={loading || fetching}
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Create Department
              </>
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

        {/* Existing Departments List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
            Existing Departments ({departments.length})
          </h3>
          
          {fetching ? (
            <div className="flex justify-center py-4">
              <Loader className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : departments.length > 0 ? (
            <ul className="space-y-2">
              {departments.map((dept, index) => {
                // Determine what to display based on the department format
                const displayName = typeof dept === 'string' 
                  ? dept 
                  : dept.name || dept.department || `Department ${index + 1}`;
                
                return (
                  <li 
                    key={typeof dept === 'string' ? dept : dept._id || index} 
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-700">
                      {displayName}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No departments created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;