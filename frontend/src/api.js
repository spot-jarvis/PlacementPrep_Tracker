import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if needed
// For now, we'll assume the user is logged in via Django session
api.interceptors.request.use((config) => {
  // You can add logic here to get CSRF token from cookies if needed
  return config;
});

export default api;
