import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useNotificationListener = () => {
  const router = useRouter();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const id = response.notification.request.content.data?.id;

        // Navigate to devotion when tapped
        if (id) {
          router.push(`/devotional/${id}`);
        }

        console.log('Notification opened:', id);
      },
    );

    return () => sub.remove();
  }, []);
};
