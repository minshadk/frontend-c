import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';

const ComplaintDetailsWorker = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolveImage, setResolveImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/complaints/${id}`);
        setComplaint(response.data.complaint);
      } catch (err) {
        console.error('Error fetching complaint details:', err);
        setError('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const handleFileChange = (e) => {
    setResolveImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resolveImage) return alert('Please select an image first');

    const formData = new FormData();
    formData.append('image', resolveImage);

    try {
      setUploading(true);
      const response = await axios.patch(
        `http://localhost:8001/complaints/resolve-image/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setComplaint((prev) => ({ ...prev, resolveImage: response.data.resolveImage }));
      alert('Resolve image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading resolve image:', err);
      alert('Failed to upload resolve image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading complaint details...</p>;
  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>
      {complaint && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {complaint.complaintImage?.url && (
            <img
              src={complaint.complaintImage.url}
              alt="Complaint"
              className="w-full h-60 object-cover rounded-md mb-4"
            />
          )}

          <h3 className="text-xl font-semibold">{complaint.title}</h3>
          <p className="mt-2 text-gray-700">{complaint.description}</p>
          <p className="mt-2 text-gray-600">
            Status: <span className="font-semibold">{complaint.status}</span>
          </p>

          {complaint.userId && (
            <>
              <p className="mt-2 text-gray-600">
                Complainant Name: <span className="font-semibold">{complaint.userId.userName}</span>
              </p>
              <p className="mt-2 text-gray-600">
                Phone Number: <span className="font-semibold">{complaint.userId.phoneNumber}</span>
              </p>
            </>
          )}

          {/* Resolve Image Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Upload Resolve Image</label>
            <div className="flex items-center gap-2 mt-2">
              <input type="file" onChange={handleFileChange} className="hidden" id="upload" />
              <label
                htmlFor="upload"
                className="cursor-pointer flex items-center gap-2 bg-gray-200 p-2 rounded-md"
              >
                <FaUpload className="text-gray-600" /> Choose File
              </label>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Upload Resolve Image'}
            </button>
          </div>

          {/* Display Resolve Image if Uploaded */}
          {complaint.resolveImage && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Resolved Image:</h4>
              <img
                src={complaint.resolveImage.url}
                alt="Resolved"
                className="w-full h-60 object-cover rounded-md mt-2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailsWorker;