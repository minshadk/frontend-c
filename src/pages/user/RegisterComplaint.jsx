import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Loader, Image, FileText, AlertCircle, CheckCircle, MapPin, Search, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RegisterComplaint = () => {
  const { user } = useAuthContext();
  const mapRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    userId: user.userId,
    coordinates: null,
    placeName: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
      valid = false;
    }

    if (!formData.coordinates) {
      newErrors.coordinates = 'Please select a location on the map.';
      valid = false;
    }

    if (!formData.image) {
      newErrors.image = 'Image is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const fetchPlaceName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      setFormData((prevData) => ({ ...prevData, placeName: response.data.display_name }));
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const complaintData = new FormData();
    complaintData.append('title', formData.title);
    complaintData.append('description', formData.description);
    complaintData.append('latitude', formData.coordinates.lat);
    complaintData.append('longitude', formData.coordinates.lng);
    complaintData.append('address', formData.placeName);
    complaintData.append('image', formData.image);
    complaintData.append('userId', formData.userId);

    try {
      const response = await axios.post('http://localhost:8001/complaints/create', complaintData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage(response.data.message || 'Complaint registered successfully!');
      setFormData({ title: '', description: '', image: null, coordinates: null, placeName: '' });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to register complaint.');
    } finally {
      setLoading(false);
    }
  };

  const LocationPicker = () => {
    const map = useMap();

    useEffect(() => {
      if (mapRef.current) return;
      mapRef.current = map;
    }, [map]);

    map.on('click', (e) => {
      setFormData((prevData) => ({ ...prevData, coordinates: e.latlng }));
      fetchPlaceName(e.latlng.lat, e.latlng.lng);
    });

    return formData.coordinates ? <Marker position={formData.coordinates} icon={markerIcon} /> : null;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newCoords = { lat: parseFloat(lat), lng: parseFloat(lon) };
        
        setFormData((prevData) => ({
          ...prevData,
          coordinates: newCoords,
          placeName: display_name,
        }));
        
        if (mapRef.current) {
          mapRef.current.flyTo(newCoords, 15);
        }
      } else {
        setErrorMessage('Location not found. Please try a different search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage('Failed to search location. Please try again.');
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        
        setFormData((prevData) => ({
          ...prevData,
          coordinates: newCoords,
        }));
        
        if (mapRef.current) {
          mapRef.current.flyTo(newCoords, 15);
        }
        
        fetchPlaceName(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setErrorMessage('Unable to retrieve your location');
        console.error('Geolocation error:', error);
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-10">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FileText className="h-5 w-5 mr-2 text-blue-500" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter complaint title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FileText className="h-5 w-5 mr-2 text-blue-500" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              placeholder="Describe your complaint"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" /> Select Location
              </label>
              <button
                type="button"
                onClick={handleLocateMe}
                className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                disabled={isLocating}
              >
                {isLocating ? (
                  <Loader className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4 mr-1" />
                )}
                My Location
              </button>
            </div>

            <div className="flex mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l-lg"
                placeholder="Search for a location..."
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-blue-500 text-white px-3 rounded-r-lg hover:bg-blue-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            <MapContainer
              center={[10.8505, 76.2711]}
              zoom={13}
              className="h-64 w-full rounded-lg border"
              whenCreated={(map) => (mapRef.current = map)}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker />
            </MapContainer>
            {formData.placeName && (
              <p className="text-gray-600 mt-2">Selected Place: {formData.placeName}</p>
            )}
            {errors.coordinates && <p className="text-red-500 text-sm mt-1">{errors.coordinates}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <Image className="h-5 w-5 mr-2 text-blue-500" /> Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Complaint'
            )}
          </button>

          {successMessage && (
            <div className="flex items-center text-green-500 text-sm mt-2">
              <CheckCircle className="h-4 w-4 mr-1" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterComplaint;