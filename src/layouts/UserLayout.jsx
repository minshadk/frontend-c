import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const UserLayout = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default UserLayout
