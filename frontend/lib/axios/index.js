import axios from 'axios';

const backendUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL;
console.log('backendUrl:', backendUrl);

const api = axios.create({
  baseURL: backendUrl, // This sets the base Spring Boot URL for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api
