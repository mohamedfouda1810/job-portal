import { API_PATHS } from "./apiPaths";
import axiosIntance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosIntance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ return only the image URL
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error while uploading the image", error);
    throw error;
  }
};

export default uploadImage;
