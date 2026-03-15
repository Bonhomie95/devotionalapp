import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DEFAULT_THEME_ID, THEMES, Theme } from '@/constants/themes';

const KEY_THEME = 'APP_THEME_ID';

type ThemeContextValue = {
  theme: Theme;
  setThemeId: (id: string) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setThemeId: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    THEMES.find((t) => t.id === DEFAULT_THEME_ID) ?? THEMES[0],
  );

  useEffect(() => {
    AsyncStorage.getItem(KEY_THEME).then((saved) => {
      if (saved) {
        const found = THEMES.find((t) => t.id === saved);
        if (found) setTheme(found);
      }
    });
  }, []);

  const setThemeId = useCallback(async (id: string) => {
    const found = THEMES.find((t) => t.id === id);
    if (!found) return;
    setTheme(found);
    await AsyncStorage.setItem(KEY_THEME, id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
