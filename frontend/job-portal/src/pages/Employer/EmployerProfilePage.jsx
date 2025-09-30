import { useEffect, useState } from "react";
import { Building2, Download, Edit3, Mail, X } from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { getInitials } from "../../utils/helper";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";

import moment from "moment";
import StatusBadge from '../../components/StatusBadge';
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfileDetails from "./EditProfileDetails";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profiledata, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyLogo: user?.companyLogo || "",
    companyDescription: user?.companyDescription || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profiledata });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyLogo: user.companyLogo || "",
        companyDescription: user.companyDescription || "",
      };
      setProfileData(data);
      setFormData(data);
    }
  }, [user]);

  // Sync formData whenever profiledata changes
  useEffect(() => {
    setFormData({ ...profiledata });
  }, [profiledata]);

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file, type) => {
    // Map type to consistent upload state keys
    const uploadKey = type === 'avatar' ? 'avatar' : 'logo';
    
    setUploading((prev) => ({
      ...prev,
      [uploadKey]: true,
    }));

    try {
      console.log(`Starting ${type} upload...`);
      const imgUploadRes = await uploadImage(file);
      console.log('Upload response:', imgUploadRes);
      
      // Handle different response formats from uploadImage function
      let imageUrl = '';
      
      if (typeof imgUploadRes === 'string') {
        // If the response is directly a URL string
        imageUrl = imgUploadRes;
      } else if (imgUploadRes && typeof imgUploadRes === 'object') {
        // If the response is an object with imageUrl or url property
        imageUrl = imgUploadRes.imageUrl || imgUploadRes.url || '';
      }
      
      if (!imageUrl) {
        throw new Error('No image URL returned from upload');
      }
      
      // Update form data with the uploaded image URL
      const field = type === 'avatar' ? 'avatar' : 'companyLogo';
      handleInputChange(field, imageUrl);

      toast.success(`${type === 'avatar' ? 'Avatar' : 'Company logo'} uploaded successfully!`);
      
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error(`Failed to upload ${type === 'avatar' ? 'avatar' : 'company logo'}: ${error.message}`);
      
      // Reset to previous state on error
      const field = type === 'avatar' ? 'avatar' : 'companyLogo';
      handleInputChange(field, profiledata[field] || '');
      
    } finally {
      setUploading((prev) => ({ 
        ...prev, 
        [uploadKey]: false 
      }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }

      console.log(`Selected ${type} file:`, {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Create preview URL immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      const field = type === 'avatar' ? 'avatar' : 'companyLogo';
      
      // Set preview image immediately
      handleInputChange(field, previewUrl);

      // Upload the actual file
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    console.log('Saving profile data:', formData);

    try {
      // Prepare the data to send to backend
      const dataToSend = {
        name: formData.name,
        avatar: formData.avatar,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        companyLogo: formData.companyLogo,
      };

      console.log('Data being sent to API:', dataToSend);
      
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        dataToSend,
      );

      console.log('API Response:', response);

      if (response.status === 200) {
        toast.success("Profile Details Updated Successfully!");

        // Update both profiledata and user context with response data
        const updatedData = {
          name: response.data.name || formData.name,
          email: formData.email, // email doesn't change
          avatar: response.data.avatar || formData.avatar,
          companyName: response.data.companyName || formData.companyName,
          companyLogo: response.data.companyLogo || formData.companyLogo,
          companyDescription: response.data.companyDescription || formData.companyDescription,
        };

        setProfileData(updatedData);
        updateUser(updatedData);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('Canceling edit, resetting to:', profiledata);
    setFormData({ ...profiledata });
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
              <h1 className="text-xl font-medium text-white">
                Employer Profile
              </h1>
              <button
                onClick={() => setEditMode(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
            
            {/* Profile Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h2>
                  
                  {/* Avatar and Name */}
                  <div className="flex items-center space-x-4">
                    {profiledata.avatar && profiledata.avatar.trim() !== '' ? (
                      <img
                        src={profiledata.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-lg font-semibold">
                          {getInitials(profiledata.name)}
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profiledata.name || 'No name set'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{profiledata.email || 'No email set'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Company Information
                  </h2>
                  
                  {/* Company Logo and Name */}
                  <div className="flex items-center space-x-4">
                    {profiledata.companyLogo && profiledata.companyLogo.trim() !== '' ? (
                      <img
                        src={profiledata.companyLogo}
                        alt="Company Logo"
                        className="w-20 h-20 rounded-lg object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-green-100 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-green-600" />
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profiledata.companyName || 'No company name set'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span>Company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                  About Company
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
                  {profiledata.companyDescription || 'No company description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;