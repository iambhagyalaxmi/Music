import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let globalSocket: Socket | null = null;

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);

  useEffect(() => {
    // Only initialize once globally
    if (globalSocket) {
      setSocket(globalSocket);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const newSocket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO Connected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO Connection Error:', err.message);
    });

    globalSocket = newSocket;
    setSocket(newSocket);

    return () => {
      // We don't disconnect on unmount to reuse the connection across components
      // It disconnects naturally when the window is closed
    };
  }, []);

  return socket;
};
