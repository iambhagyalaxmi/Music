import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';

let ioInstance: Server | null = null;

export const initializeMessagesSocket = (io: Server) => {
  ioInstance = io;

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Missing token'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    
    // Join a private room for this user to receive DMs
    socket.join(`user-${userId}`);

    // Broadcast online status
    socket.broadcast.emit('dm:online', { userId });

    socket.on('dm:typing', (data: { targetUserId: string, isTyping: boolean }) => {
      io.to(`user-${data.targetUserId}`).emit('dm:typing', {
        userId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      // Check if user has other active sockets
      io.in(`user-${userId}`).fetchSockets().then(sockets => {
        if (sockets.length === 0) {
          socket.broadcast.emit('dm:offline', { userId });
        }
      });
    });
  });
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(`user-${userId}`).emit(event, data);
  } else {
    console.warn(`Attempted to emit ${event} to user-${userId} but Socket.IO is not initialized.`);
  }
};
