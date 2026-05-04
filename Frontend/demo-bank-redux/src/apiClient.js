import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://nova-bank-4ge0.onrender.com',
});

export function getStoredAccessToken() {
  const storageKeys = ["userInfo", "auth", "session"];
  const storageAreas = [localStorage, sessionStorage];

  for (const storage of storageAreas) {
    for (const key of storageKeys) {
      try {
        const value = JSON.parse(storage.getItem(key) || "null");
        const token = value?.access_token || value?.token || value?.jwt;
        if (token) {
          return token;
        }
      } catch (error) {
        storage.removeItem(key);
      }
    }
  }

  return null;
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("userInfo");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
