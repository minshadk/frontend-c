import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Scrollable Content Area */}
        <main className="p-6 flex-1 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
