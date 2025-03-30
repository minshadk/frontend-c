import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Loader, Image, FileText, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RegisterComplaint = () => {
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    userId: user.userId,
    coordinates: null,
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
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


    console.log(formData)

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
    useMapEvents({
      click(e) {
        setFormData((prevData) => ({ ...prevData, coordinates: e.latlng }));
        fetchPlaceName(e.latlng.lat, e.latlng.lng);
      },
    });
    return formData.coordinates ? <Marker position={formData.coordinates} /> : null;
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
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" /> Select Location
            </label>
            <MapContainer center={[10.8505, 76.2711]} zoom={13} className="h-64 w-full rounded-lg border">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker />
            </MapContainer>
            {formData.placeName && <p className="text-gray-600 mt-2">Selected Place: {formData.placeName}</p>}
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
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg" disabled={loading}>
            {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Submit Complaint'}
          </button>

          {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterComplaint;
