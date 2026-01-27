import { BookmarkProvider } from '@/context/BookmarkContext';
import { loadInterstitial, showInterstitialIfReady } from '@/hooks/useAds';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  useEffect(() => {
    loadInterstitial();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        showInterstitialIfReady();
      }
    });
    return () => sub.remove();
  }, []);
  useNotificationListener();
  return (
    <BookmarkProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </BookmarkProvider>
  );
}
