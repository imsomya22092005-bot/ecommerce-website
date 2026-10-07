const rawUrl = import.meta.env.VITE_API_URL;

const API_URL =
  rawUrl && rawUrl.trim() !== ""
    ? rawUrl.trim().replace(/\/+$/, "")
    : "https://ecommerce-backend-ip3m.onrender.com";

export default API_URL;
