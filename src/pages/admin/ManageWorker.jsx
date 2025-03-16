import { useEffect, useState } from "react";
import axios from "axios";

const ManageWorker = () => {
  const [workers, setWorkers] = useState([]);
  const BASE_URL = "http://localhost:8001";
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/workers`);
        setWorkers(response.data.workers);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    
    try {
      await axios.delete(`${BASE_URL}/user/workers/${id}`);
      setWorkers(workers.filter(worker => worker._id !== id)); 
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Workers</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {workers.length > 0 ? (
            workers.map(worker => (
              <tr key={worker._id} className="text-center">
                <td className="border p-2">{worker.userName}</td>
                <td className="border p-2">{worker.phoneNumber}</td>
                <td className="border p-2">{worker.department || "N/A"}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => handleDelete(worker._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center">No workers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageWorker;
