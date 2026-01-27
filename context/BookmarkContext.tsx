import { Devotion } from '@/constants/devotions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

type BookmarkContextType = {
  bookmarks: Devotion[];
  addBookmark: (d: Devotion) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
};

export const BookmarkContext = createContext<BookmarkContextType>(
  {} as BookmarkContextType,
);

const KEY = 'BOOKMARKS';

export const BookmarkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookmarks, setBookmarks] = useState<Devotion[]>([]);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem(KEY);
      if (data) setBookmarks(JSON.parse(data));
    })();
  }, []);

  const persist = async (items: Devotion[]) => {
    setBookmarks(items);
    await AsyncStorage.setItem(KEY, JSON.stringify(items));
  };

  const addBookmark = async (devotion: Devotion) => {
    setBookmarks((prev) => {
      if (prev.some((d) => d.id === devotion.id)) return prev;
      const updated = [...prev, devotion];
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = async (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (id: string) => bookmarks.some((d) => d.id === id);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
