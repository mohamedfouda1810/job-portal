
import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Clock, DollarSign, Download, Edit3, Filter, Grid,  List, Mail, MapPin, Save, Search, Trash2, Users, X } from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import { Link } from "react-router-dom";
 
 
  
import Navbar from "../../components/layout/Navbar";
 

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
  
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    resume: user?.resume || '',
  })

 const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, resume: false });
  const [saving, setSaving] = useState(false);

    const handleInputChange = (field, value) => {
     setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


// --- Upload Image ---
const handleImageUpload = async (file, type) => {
  const uploadKey = type === 'avatar' ? 'avatar' : 'cover';

  setUploading((prev) => ({
    ...prev,
    [uploadKey]: true,
  }));

  try {
    console.log(`Starting ${type} upload...`);
    const imgUploadRes = await uploadImage(file);
    console.log('Upload response:', imgUploadRes);

    let imageUrl = '';
    if (typeof imgUploadRes === 'string') {
      imageUrl = imgUploadRes;
    } else if (imgUploadRes && typeof imgUploadRes === 'object') {
      imageUrl = imgUploadRes.imageUrl || imgUploadRes.url || '';
    }

    if (!imageUrl) throw new Error('No image URL returned from upload');

    const field = type === 'avatar' ? 'avatar' : 'cover';
    handleInputChange(field, imageUrl);

    toast.success(`${type === 'avatar' ? 'Avatar' : 'Cover'} uploaded successfully!`);
  } catch (error) {
    console.error('Image upload failed:', error);
    toast.error(`Failed to upload ${type}: ${error.message}`);

    const field = type === 'avatar' ? 'avatar' : 'cover';
    handleInputChange(field, profiledata[field] || '');
  } finally {
    setUploading((prev) => ({
      ...prev,
      [uploadKey]: false,
    }));
  }
};

// --- Image Change ---
const handleImageChange = (e, type) => {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }

    console.log(`Selected ${type} file:`, {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const previewUrl = URL.createObjectURL(file);
    const field = type === 'avatar' ? 'avatar' : 'cover';

    handleInputChange(field, previewUrl);
    handleImageUpload(file, type);
  }
};

// --- Save Profile ---
const handleSave = async () => {
  setSaving(true);

  console.log('Saving user profile data:', formData);

  try {
   const dataToSend = {
  name: formData.name,
  avatar: formData.avatar,
  resume: formData.resume, // Add this line
};

    console.log('Data being sent to API:', dataToSend);

    const response = await axiosInstance.put(
      API_PATHS.AUTH.UPDATE_PROFILE,
      dataToSend
    );

    console.log('API Response:', response);

    if (response.status === 200) {
      toast.success('Profile Updated Successfully!');

      const updatedData = {
        name: response.data.name || formData.name,
        email: formData.email, // ثابت
        avatar: response.data.avatar || formData.avatar,
        cover: response.data.cover || formData.cover,
         resume: response.data.resume || formData.resume, 
      };

      setProfileData(updatedData);
      updateUser(updatedData);
    
    }
  } catch (error) {
    console.error('Profile update failed:', error);
    console.error('Error response:', error.response?.data);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to update profile';
    toast.error(errorMessage);
  } finally {
    setSaving(false);
  }
};

// Add this function to handle file uploads (not just images)
const handleFileUpload = async (file, type) => {
  const uploadKey = type === 'resume' ? 'resume' : 'file';
  
  setUploading((prev) => ({
    ...prev,
    [uploadKey]: true,
  }));

  try {
    console.log(`Starting ${type} upload...`);
    
    // Use your upload function (you might need to modify this for non-images)
    const uploadRes = await uploadImage(file); // or create a separate uploadFile function
    console.log('Upload response:', uploadRes);
    
    let fileUrl = '';
    if (typeof uploadRes === 'string') {
      fileUrl = uploadRes;
    } else if (uploadRes && typeof uploadRes === 'object') {
      fileUrl = uploadRes.imageUrl || uploadRes.url || uploadRes.fileUrl || '';
    }
    
    if (!fileUrl) throw new Error('No file URL returned from upload');
    
    handleInputChange(type, fileUrl);
    toast.success(`${type === 'resume' ? 'Resume' : 'File'} uploaded successfully!`);
    
  } catch (error) {
    console.error('File upload failed:', error);
    toast.error(`Failed to upload ${type}: ${error.message}`);
    
    // Reset to previous state on error
    handleInputChange(type, profileData[type] || '');
    
  } finally {
    setUploading((prev) => ({
      ...prev,
      [uploadKey]: false,
    }));
  }
  };
  // Add this function to handle file selection (separate from image handler)
const handleFileChange = (e, type) => {
  const file = e.target.files[0];
  if (file) {
    // For resume, allow PDF, DOC, DOCX files
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (type === 'resume' && !allowedTypes.includes(file.type)) {
      toast.error('Please select a valid resume file (PDF, DOC, or DOCX)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit for resumes
      toast.error('File size should not exceed 10MB');
      return;
    }

    console.log(`Selected ${type} file:`, {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // For resume, we don't need preview URL
    handleFileUpload(file, type);
  }
};
  
  const handleCancel = () => {
    setFormData({ ...profileData });
  };

const DeleteResume = async () => {
  setSaving(true);
  try {
    console.log("Deleting resume:", user.resume || formData.resume);
    
    // For POST request, send data directly in the body (not wrapped in 'data')
    const response = await axiosInstance.post(
      API_PATHS.AUTH.DELETE_RESUME,
      { resumeUrl: user.resume || formData.resume } // Remove the 'data' wrapper
    );

    console.log('Delete response:', response);

    if (response.status === 200) {
      toast.success('Resume Deleted Successfully!');
      const updatedData = { ...profileData, resume: '' };
      setProfileData(updatedData);
      updateUser(updatedData);
      setFormData(updatedData);
    }
  } catch (error) {
    console.error('Resume deletion failed:', error);
    const errorMessage = error.response?.data?.message || 'Failed to delete resume';
    toast.error(errorMessage);
  } finally {
    setSaving(false);
  }
};
  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        resume: user.resume || "",
     
      };
      setProfileData(data);
      setFormData(data);
    }
  }, [user]);
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16 lg:m-20 ">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header  */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
              <h1 className="text-xl font-medium text-white ">Profile</h1>
            </div>

            <div className="p-8 ">
              <div className="space-y-6 ">
                <div className="flex items-center space-x-4 ">
                  <div className="relative">
                 <img
                  src={formData?.avatar || null}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                />

                    {uploading?.avatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div >
                    <label className="block">
                      <span className="sr-only"> Choose Image </span>
                      <input type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'avatar')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                      />
                    </label>
                  </div>
                </div>
                {/* name Input */}
                <div>
                  <label  className="block text-sm font-medium text-gray-700 mb-2">Full Name </label>
                  <input type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter Full Name "
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all "
                  />
                  
               
                </div>

                {/* Email Readonly */}
                <div>
                  <label  className="block text-sm font-medium text-gray-700 mb-2">Email Address </label>
                  <input type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                {/* Resume Readonly */}
       {/* Resume Upload/Display */}
{user?.resume ? (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-600">
        Current resume:{' '}
        <a 
          href={user?.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline cursor-pointer"
        >
          View Resume
        </a>
      </p>
      <button
        onClick={DeleteResume}
        disabled={saving}
        className="cursor-pointer disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </button>
    </div>
  </div>
) : (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Upload Resume
    </label>
    <div className="relative">
      <label className="block">
        <span className="sr-only">Choose Resume File</span>
        <input 
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e, 'resume')}
          disabled={uploading.resume}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
      {uploading.resume && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  </div>
)}
               



              </div>



              {/* {Action Buttons } */}
              <div className="flex justify-end space-x-4  mt-8 pt-6 border-t ">
                <Link 
                  onClick={handleCancel}
                  to='/find-jobs'
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 "
                >
                <X className="w-4 h-4 " />
                  <span >Cancel</span>
                </Link>
                
                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar || uploading.logo}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 "
                >
                  {saving ? (
                                        
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                  ) : (
                      <Save className="w-4 h-4 " />
                      
                  )}
                  <span>{ saving?'Saving...':'Save Changes '}</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
