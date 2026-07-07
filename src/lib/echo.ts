import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setup Pusher on window object
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

export const initEcho = (token: string) => {
  if (typeof window === 'undefined') return null;
  
  return new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });
};
