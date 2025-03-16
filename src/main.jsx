import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'

import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import AddWorker from './pages/admin/AddWorker'
import ManageWorker from './pages/admin/ManageWorker'
import ManageComplaints from './pages/admin/ManageComplaints'
import ComplaintDetails from './pages/ComplaintDetails'

import ManageWork from './pages/worker/ManageWork'
// import ComplaintDetails from './pages/worker/ComplaintDetails'
import ComplaintDetailsWorker from './pages/worker/ComplaintDetailsWorker'

import RegisterComplaint from './pages/user/RegisterComplaint'
import ComplaintStatus from './pages/user/ComplaintStatus'
import ComplaintDetailsUser from './pages/user/ComplaintDetailsUser'

import './index.css'
import { AuthContextProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="addWorker" element={<AddWorker />} />
            <Route path="manageWorker" element={<ManageWorker />} />
            <Route path="manageComplaints" element={<ManageComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
          </Route>
          {/* <Route path="/addWorker" element={<AddWorker />} /> */}

          {/* Worker Routes */}
          <Route path="/worker" element={<AdminLayout />}>
            {/* <Route path="home" element={<ManageWork />} /> */}
            <Route path="manageWork" element={<ManageWork />} />
            <Route path="work/:id" element={<ComplaintDetailsWorker />} />
          </Route>

          {/* Normal User Routes */}
          <Route path="/users" element={<UserLayout />}>
            <Route path="home" element={<Users />} />
            <Route path="registerComplaint" element={<RegisterComplaint />} />
            <Route path="complaintStatus" element={<ComplaintStatus />} />
            <Route path="ComplaintDetailsUser/:id" element={<ComplaintDetailsUser />} />
          </Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  </React.StrictMode>,
)
