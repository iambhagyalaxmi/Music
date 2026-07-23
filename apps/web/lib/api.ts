let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://music-api-k4lw.vercel.app';
}
export const API_URL = apiUrl;
