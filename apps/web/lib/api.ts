export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://music-api-k4lw.vercel.app' 
    : 'http://localhost:4000');
