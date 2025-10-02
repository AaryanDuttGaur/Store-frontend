// src/lib/api.js
const API_BASE_URL = typeof window !== 'undefined' 
  ? (window.ENV?.NEXT_PUBLIC_API_URL || 'https://store-backend-e1ed.onrender.com')
  : (process.env.NEXT_PUBLIC_API_URL || 'https://store-backend-e1ed.onrender.com');

export default API_BASE_URL;