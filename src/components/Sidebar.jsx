import { Link } from 'react-router-dom';
import { Home, Users, Settings, MessageCircle, Wrench } from 'lucide-react'; // Use Wrench instead of Tool
import { useAuthContext } from '../hooks/useAuthContext';

const Sidebar = () => {
  const { user } = useAuthContext();

  if (!user) return <div>Loading...</div>;

  let navItems = [];
  if (user.userType === 'admin') {
    navItems = [
      {
        name: 'Dashboard',
        to: '/admin/manageComplaints',
        icon: <Home size={20} className="text-blue-400" />,
      },
      {
        name: 'Add Officer',
        to: '/admin/addWorker',
        icon: <Users size={20} className="text-green-400" />,
      },
      {
        name: 'Manage Officers',
        to: '/admin/manageWorker',
        icon: <Settings size={20} className="text-yellow-400" />,
      },
      {
        name: 'Feedbacks',
        to: '/admin/allfeedBacks',
        icon: <MessageCircle size={20} className="text-purple-400" />,
      },
    ];
  } else if (user.userType === 'worker') {
    navItems = [
      { name: 'Home', to: '/worker/manageWork', icon: <Home size={20} className="text-blue-400" /> },
      {
        name: 'Department Works',
        to: '/worker/alldepartmentWorks',
        icon: <Wrench size={20} className="text-green-400" />, // Replaced Tool with Wrench
      },
      {
        name: 'FeedBacks',
        to: '/worker/feedBackByWorker',
        icon: <MessageCircle size={20} className="text-purple-400" />,
      },
    ];
  } else {
    navItems = [{ name: 'Home', to: '/users/home', icon: <Home size={20} className="text-blue-400" /> }];
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen p-5 fixed top-0 left-0 overflow-y-auto shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-gray-200">
        {user.userType === 'admin'
          ? 'Admin Panel'
          : user.userType === 'worker'
          ? 'Officer Panel'
          : 'User Panel'}
      </h2>
      <nav>
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {item.icon} <span className="text-gray-200">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;