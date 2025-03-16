import { Link } from "react-router-dom";
import { Home, Users, Settings } from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";

const Sidebar = () => {
  const { user } = useAuthContext();

  if (!user) return <div>Loading...</div>;

  let navItems = [];
  if (user.userType === "admin") {
    navItems = [
      { name: "Dashboard", to: "/admin/manageComplaints", icon: <Home size={20} /> },
      { name: "Add Worker", to: "/admin/addWorker   ", icon: <Users size={20} /> },
      { name: "Manage Workers", to: "/admin/manageWorker", icon: <Settings size={20} /> },
    ];
  } else if (user.userType === "worker") {
    navItems = [
      { name: "Home", to: "/worker/home", icon: <Home size={20} /> },
    ];
  } else {
    navItems = [
      { name: "Home", to: "/users/home", icon: <Home size={20} /> },
    ];
  }

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-6">
        {user.userType === "admin"
          ? "Admin Panel"
          : user.userType === "worker"
          ? "Worker Panel"
          : "User Panel"}
      </h2>
      <nav>
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700">
                {item.icon} {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;