import { BookmarkProvider } from '@/context/BookmarkContext';
import { loadInterstitial } from '@/hooks/useAds';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

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
    // Pre-load the interstitial once at startup.
    // Individual screens decide when (and whether) to show it.
    loadInterstitial();
  }, []);

  useNotificationListener();

  return (
    <BookmarkProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </BookmarkProvider>
  );
}
