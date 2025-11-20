// API Configuration
export const API_BASE_URL = 
  import.meta?.env?.VITE_API_BASE || 
  "https://atraski-backend-jizez.ondigitalocean.app/";

// Ensure trailing slash
export const API_BASE = API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/';
