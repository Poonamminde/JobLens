import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // send/receive HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — redirect to /login on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
