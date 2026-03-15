import { BookmarkProvider } from '@/context/BookmarkContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { loadInterstitial } from '@/hooks/useAds';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import { topUpNotificationsIfNeeded } from '@/hooks/useNotifications';
import * as SystemUI from 'expo-system-ui';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Inner layout — runs inside ThemeProvider so it can sync the active theme
 * colour to the Android system navigation bar, making it blend seamlessly
 * with our tab bar instead of sitting on top of our content.
 */
function InnerLayout() {
  const { theme } = useTheme();

  useEffect(() => {
    loadInterstitial();
    topUpNotificationsIfNeeded();
  }, []);

  // Sync Android system navigation bar background to match our tab bar.
  // This prevents the phone's gesture / button bar from visually clashing.
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(theme.tabBar);
    }
  }, [theme]);

  useNotificationListener();

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="devotional/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <BookmarkProvider>
          <InnerLayout />
        </BookmarkProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
