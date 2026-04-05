import axios from 'axios'
import router from '@/router'
import Cookies from 'js-cookie'

/* ────────────────────────────────────────────────── */
/* 1️⃣  Khởi tạo instance                            */
/* ────────────────────────────────────────────────── */
const axiosIns = axios.create({
  // baseURL   : import.meta.env.VITE_API_BASE,  // tuỳ dự án
  // timeout   : 10000,
})

/* ────────────────────────────────────────────────── */
/* 2️⃣  Request‑interceptor: gắn Bearer token         */
/* ────────────────────────────────────────────────── */
axiosIns.interceptors.request.use(config => {
  const token = Cookies.get('auth-token')              // token JWT lưu thẳng dạng chuỗi

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`   // ⬅️  không JSON.parse
  }

  return config
})

/* ────────────────────────────────────────────────── */
/* 3️⃣  Response‑interceptor: bắt 401 & lỗi mạng      */
/* ────────────────────────────────────────────────── */
axiosIns.interceptors.response.use(
  response => response,

  error => {
    /* Có phản hồi từ server */
    if (error.response) {
      /* 401 → xoá dữ liệu, chuyển login */
      if (error.response?.status === 401) {
        Cookies.remove('auth-token')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('userData')
        localStorage.removeItem('userAbilities')

        router.push('/login')
        return Promise.reject(error)
      }
      if (error.response?.status === 404) {
        router.push({ name: 'not-authorized' }) // hoặc 404 page
      }

      /* Các mã lỗi khác (403, 500…) → đưa về caller */
      return Promise.reject(error)
    }

    /* Không có response: network/CORS/timeout */
    console.error('Network error:', error.message)
    // Tùy UX: bạn có thể hiển thị toast “Không thể kết nối máy chủ”
    return Promise.reject(error)
  },
)

export default axiosIns


// import axios from "axios";
// import router from "@/router";
// import Cookies from "js-cookie";

// const axiosIns = axios.create({
//   // You can add your headers here
//   // ================================
//   // baseURL: 'https://some-domain.com/api/',
//   // timeout: 1000,
//   // headers: {'X-Custom-Header': 'foobar'}
// });

// // ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
// axiosIns.interceptors.request.use((config) => {
//   // Retrieve token from localStorage
//   const token = Cookies.get("auth-token");

//   // If token is found
//   if (token) {
//     // Get request headers and if headers is undefined assign blank object
//     config.headers = config.headers || {};

//     // Set authorization header
//     // ℹ️ JSON.parse will convert token to string
//     config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : "";
//   }

//   // Return modified config
//   return config;
// });

// // ℹ️ Add response interceptor to handle 401 response
// axiosIns.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle error
//     if (error.response?.status === 401) {
//       // ℹ️ Logout user and redirect to login page
//       // Remove "userData" from localStorage
//       localStorage.removeItem("userData");

//       // Remove "accessToken" from localStorage
//       localStorage.removeItem("auth-token");
//       localStorage.removeItem("userAbilities");

//       // If 401 response returned from api
//       router.push("/login");
//     } else {
//       return Promise.reject(error);
//     }
//   }
// );

// export default axiosIns;
