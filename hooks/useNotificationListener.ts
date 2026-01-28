import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export const useNotificationListener = () => {
  const router = useRouter();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const devotion = response.notification.request.content.data?.devotion;
        if (devotion) {
          await AsyncStorage.setItem(
            'OVERRIDE_DEVOTION',
            JSON.stringify(devotion),
          );
          router.replace('/');
        }
      },
    );

    return () => sub.remove();
  }, []);
};
