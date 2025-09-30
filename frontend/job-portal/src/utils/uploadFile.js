import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
  API_PATHS.UPLOAD.FILE,  // شغال دلوقتي
  formData,
  {
    headers: { "Content-Type": "multipart/form-data" },
  }
);

  

    // رجّع اللينك اللي السيرفر بيرجعه
    return response.data?.fileUrl || response.data?.url;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

export default uploadFile;
