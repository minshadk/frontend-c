import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader,
  Trash2,
  User,
  Phone,
  AlertCircle,
  Search,
} from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = "http://localhost:8001";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/users`);
        // Ensure phoneNumber is always a string
        const formattedUsers = response.data.users.map(user => ({
          ...user,
          phoneNumber: user.phoneNumber ? String(user.phoneNumber) : ""
        }));
        setUsers(formattedUsers || []);
      } catch (error) {
        setError("Failed to fetch users.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };  

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${BASE_URL}/user/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const userName = user.userName?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const phoneNumber = user.phoneNumber?.toLowerCase() || "";
    
    return (
      userName.includes(searchLower) ||
      email.includes(searchLower) ||
      phoneNumber.includes(searchLower)
    );
  });

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
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Management</h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-gray-700">
                  <span className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    Name
                  </span>
                </th>
                <th className="p-4 text-left text-gray-700">
                  <span className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-500" />
                    Phone
                  </span>
                </th>
                <th className="p-4 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 border-t text-gray-700">
                      {user.userName || "N/A"}
                    </td>
                    <td className="p-4 border-t text-gray-700">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="p-4 border-t">
                      <button
                        className="flex items-center text-red-500 hover:text-red-700 transition duration-200"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 className="h-5 w-5 mr-1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-600">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;