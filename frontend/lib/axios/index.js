import axios from 'axios';
// import {auth} from "@/features/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // This sets the base Spring Boot URL for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// this is code i copied over from my existing project
// we do not currently need any auth-related re-routing
// since we're just testing the connection
// so i've commented half of it out in case we need it later

// api.interceptors.request.use(
//   async (config) => {
//     const session = await auth();

//     if (session?.user?.jwtToken) {
//       config.headers.Authorization = `${session.user.jwtToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api
