import axios from "axios";

// Base URL (Hardcoded for now as per previous usage, but env var is better practice)
const API_BASE_URL = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const ModelAPI = {
  /**
   * Uploads an image for detection and analysis.
   * @param {File} file - The image file to upload.
   * @returns {Promise<Object>} - The detection results.
   */
  detect: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/detect", formData);

    if (!response.data.success) {
      throw new Error(response.data.error || "Detection failed");
    }
    return response.data.resultData;
  },

  /**
   * Fetches the latest result if needed.
   */
  getLatestResult: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/result`);
    return response.data;
  }
};
