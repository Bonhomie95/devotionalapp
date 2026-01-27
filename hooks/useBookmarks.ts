import { BookmarkContext } from '@/context/BookmarkContext';
import { useContext } from 'react';

const KEY = 'BOOKMARKS';

export const useBookmarks = () => useContext(BookmarkContext);
