import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Trash2, User, Phone, Briefcase, AlertCircle, Search } from "lucide-react";

const ManageWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = "http://localhost:8001";

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/workers`);
        console.log("Workers data:", response.data);
        const formattedWorkers = response.data.workers.map(worker => ({
          ...worker,
          phoneNumber: worker.phoneNumber ? String(worker.phoneNumber) : "",
          department: worker.department || "N/A"
        }));
        setWorkers(formattedWorkers);
        setFilteredWorkers(formattedWorkers);
      } catch (error) {
        setError("Failed to fetch workers.");
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredWorkers(workers);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = workers.filter(worker => {
        const nameMatch = worker.userName?.toLowerCase().includes(searchLower) || false;
        const phoneMatch = worker.phoneNumber?.toLowerCase().includes(searchLower) || false;
        const deptMatch = worker.department?.toLowerCase().includes(searchLower) || false;
        return nameMatch || phoneMatch || deptMatch;
      });
      setFilteredWorkers(filtered);
    }
  }, [searchTerm, workers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;

    try {
      await axios.delete(`${BASE_URL}/user/user/${id}`);
      const updatedWorkers = workers.filter((worker) => worker._id !== id);
      setWorkers(updatedWorkers);
      setFilteredWorkers(updatedWorkers);
    } catch (error) {
      console.error("Error deleting worker:", error);
      setError("Failed to delete worker. Please try again.");
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
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Workers</h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search workers by name, phone, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
                <th className="p-4 text-left text-gray-700">
                  <span className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                    Department
                  </span>
                </th>
                <th className="p-4 text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr
                    key={worker._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 border-t text-gray-700">{worker.userName}</td>
                    <td className="p-4 border-t text-gray-700">{worker.phoneNumber}</td>
                    <td className="p-4 border-t text-gray-700">{worker.department}</td>
                    <td className="p-4 border-t">
                      <button
                        className="flex items-center text-red-500 hover:text-red-700 transition duration-200"
                        onClick={() => handleDelete(worker._id)}
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-600">
                    {searchTerm.trim() ? 
                      "No workers match your search criteria" : 
                      "No workers found"
                    }
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

export default ManageWorker;