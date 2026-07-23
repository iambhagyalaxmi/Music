import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '';
    pusherClient = new Pusher(key, {
      cluster,
    });
  }
  return pusherClient;
};

export const subscribeToRoom = (roomId: string) => {
  const pusher = getPusherClient();
  return pusher.subscribe(`room-${roomId}`);
};

export const unsubscribeFromRoom = (roomId: string) => {
  const pusher = getPusherClient();
  pusher.unsubscribe(`room-${roomId}`);
};
