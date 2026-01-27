import { Devotion } from '@/constants/devotions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY = 'BOOKMARKS';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Devotion[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const data = await AsyncStorage.getItem(KEY);
    if (data) setBookmarks(JSON.parse(data));
  };

  const saveBookmarks = async (items: Devotion[]) => {
    setBookmarks(items);
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  };

  const addBookmark = (devotion: Devotion) => {
    if (!bookmarks.find((d) => d.id === devotion.id)) {
      saveBookmarks([...bookmarks, devotion]);
    }
  };

  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter((d) => d.id !== id));
  };

  const isBookmarked = (id: string) => bookmarks.some((d) => d.id === id);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
};
