import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader, AlertCircle, Clock, CheckCircle, XCircle, Search, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icons for different statuses
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const statusIcons = {
  pending: createCustomIcon('red'),
  'in progress': createCustomIcon('orange'),
  completed: createCustomIcon('green'),
  default: createCustomIcon('blue')
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'pending': return <Clock className="h-4 w-4 text-red-500" />;
    case 'in progress': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    default: return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'pending': return 'bg-red-100 text-red-800';
    case 'in progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMarkerIcon = (status) => {
  return statusIcons[status] || statusIcons.default;
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapView, setMapView] = useState(false);
  const [center, setCenter] = useState([10.8505, 76.2711]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8001/complaints');
        const formattedComplaints = response.data.complaints.map((c) => ({
          ...c,
          complaintImage: c.complaintImage || { url: '/placeholder.jpg' },
          coordinates: c.latitude && c.longitude ? [c.latitude, c.longitude] : null
        }));
        setComplaints(formattedComplaints);
        setFilteredComplaints(formattedComplaints);
        
        if (formattedComplaints.length > 0 && formattedComplaints[0].coordinates) {
          setCenter(formattedComplaints[0].coordinates);
        }
      } catch (err) {
        setError('Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(complaint => 
        complaint.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComplaints(filtered);
    }
  }, [searchTerm, complaints]);

  if (loading) return <Loader className="animate-spin h-8 w-8 text-blue-500 mx-auto mt-32" />;
  if (error) return <AlertCircle className="h-6 w-6 text-red-500 mx-auto mt-32" />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Manage Complaints</h2>
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setMapView(!mapView)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mapView ? 'List View' : 'Map View'}
            </button>
          </div>
        </div>

        {mapView ? (
          <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredComplaints.filter(c => c.coordinates).map((complaint) => (
                <Marker
                  key={complaint._id}
                  position={complaint.coordinates}
                  icon={getMarkerIcon(complaint.status)}
                >
                  <Popup>
                    <div className="w-64">
                      <img
                        src={complaint.complaintImage.url}
                        alt="Complaint"
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="p-3">
                        <h3 className="font-bold text-gray-800 truncate">{complaint.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {complaint.address || 'No location'}
                        </p>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1">{complaint.status}</span>
                        </div>
                        <Link
                          to={`/admin/complaints/${complaint._id}`}
                          className="mt-2 block text-center text-sm text-blue-600 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <Link
                  to={`/admin/complaints/${complaint._id}`}
                  key={complaint._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <img
                    src={complaint.complaintImage.url}
                    alt="Complaint"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{complaint.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {complaint.address || 'Location not specified'}
                    </p>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  {searchTerm.trim() ? `No complaints matching "${searchTerm}"` : 'No complaints found'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;