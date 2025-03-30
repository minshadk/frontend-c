import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Trash2, User, Phone, Briefcase, AlertCircle } from "lucide-react"; // Icons for table and actions

const ManageWorker = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = "http://localhost:8001";

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/workers`);
        console.log("Workers data:", response.data); // Debugging line
        setWorkers(response.data.workers);
      } catch (error) {
        setError("Failed to fetch workers.");
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;

    try {
      await axios.delete(`${BASE_URL}/user/user/${id}`);
      setWorkers(workers.filter((worker) => worker._id !== id));
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Workers</h2>
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
              {workers.length > 0 ? (
                workers.map((worker) => (
                  <tr
                    key={worker._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 border-t text-gray-700">{worker.userName}</td>
                    <td className="p-4 border-t text-gray-700">{worker.phoneNumber}</td>
                    <td className="p-4 border-t text-gray-700">
                      {worker.department || "N/A"}
                    </td>
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
                    No workers found.
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