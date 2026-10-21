// Centralized API configuration for Chimera
// Defaults to the production Railway backend URL
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://chimeraai-production-844c.up.railway.app"
).replace(/\/$/, "");
