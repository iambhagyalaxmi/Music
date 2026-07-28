import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || 'ca41b0bec72e00fae873';
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2';
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
