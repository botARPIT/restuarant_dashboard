import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface CachedPage {
  pathname: string;
  timestamp: number;
  data: any;
  scrollPosition: number;
}

interface PageCacheContextType {
  getCachedPage: (pathname: string) => CachedPage | null;
  setCachedPage: (pathname: string, data: any) => void;
  clearCache: () => void;
  clearOldCache: (maxAge: number) => void;
  isPageCached: (pathname: string) => boolean;
  getCacheSize: () => number;
  restoreScrollPosition: (pathname: string) => void;
  saveScrollPosition: (pathname: string, position: number) => void;
}

const PageCacheContext = createContext<PageCacheContextType | undefined>(undefined);

export const usePageCache = () => {
  const context = useContext(PageCacheContext);
  if (context === undefined) {
    throw new Error('usePageCache must be used within a PageCacheProvider');
  }
  return context;
};

interface PageCacheProviderProps {
  children: ReactNode;
  maxCacheSize?: number;
  maxCacheAge?: number; // in milliseconds
}

export const PageCacheProvider: React.FC<PageCacheProviderProps> = ({ 
  children, 
  maxCacheSize = 20, // Maximum number of cached pages
  maxCacheAge = 30 * 60 * 1000 // 30 minutes default
}) => {
  const [cache, setCache] = useState<Map<string, CachedPage>>(new Map());
  const location = useLocation();

  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('pageCache');
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        const cacheMap = new Map(Object.entries(parsedCache));
        
        // Filter out expired cache entries
        const now = Date.now();
        const validCache = new Map();
        
        for (const [key, value] of cacheMap.entries()) {
          if (now - (value as CachedPage).timestamp < maxCacheAge) {
            validCache.set(key, value);
          }
        }
        
        setCache(validCache);
      }
    } catch (error) {
      console.warn('Failed to load page cache from localStorage:', error);
    }
  }, [maxCacheAge]);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    try {
      const cacheObject = Object.fromEntries(cache);
      localStorage.setItem('pageCache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save page cache to localStorage:', error);
    }
  }, [cache]);

  // Clean up old cache entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      clearOldCache(maxCacheAge);
    }, 5 * 60 * 1000); // Clean every 5 minutes

    return () => clearInterval(interval);
  }, [maxCacheAge]);

  const getCachedPage = (pathname: string): CachedPage | null => {
    const cached = cache.get(pathname);
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > maxCacheAge) {
      cache.delete(pathname);
      return null;
    }
    
    return cached;
  };

  const setCachedPage = (pathname: string, data: any) => {
    const newCache = new Map(cache);
    
    // If cache is full, remove oldest entry
    if (newCache.size >= maxCacheSize) {
      const oldestKey = Array.from(newCache.keys())[0];
      newCache.delete(oldestKey);
    }
    
    newCache.set(pathname, {
      pathname,
      timestamp: Date.now(),
      data,
      scrollPosition: 0
    });
    
    setCache(newCache);
  };

  const clearCache = () => {
    setCache(new Map());
    localStorage.removeItem('pageCache');
  };

  const clearOldCache = (maxAge: number) => {
    const now = Date.now();
    const newCache = new Map();
    
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp < maxAge) {
        newCache.set(key, value);
      }
    }
    
    if (newCache.size !== cache.size) {
      setCache(newCache);
    }
  };

  const isPageCached = (pathname: string): boolean => {
    return cache.has(pathname) && getCachedPage(pathname) !== null;
  };

  const getCacheSize = (): number => {
    return cache.size;
  };

  const restoreScrollPosition = (pathname: string) => {
    const cached = getCachedPage(pathname);
    if (cached && cached.scrollPosition > 0) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo(0, cached.scrollPosition);
      }, 100);
    }
  };

  const saveScrollPosition = (pathname: string, position: number) => {
    const cached = cache.get(pathname);
    if (cached) {
      const newCache = new Map(cache);
      newCache.set(pathname, {
        ...cached,
        scrollPosition: position
      });
      setCache(newCache);
    }
  };

  // Auto-save scroll position when leaving a page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(location.pathname, window.scrollY);
    };

    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        saveScrollPosition(location.pathname, window.scrollY);
      }, 100);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const value: PageCacheContextType = {
    getCachedPage,
    setCachedPage,
    clearCache,
    clearOldCache,
    isPageCached,
    getCacheSize,
    restoreScrollPosition,
    saveScrollPosition
  };

  return (
    <PageCacheContext.Provider value={value}>
      {children}
    </PageCacheContext.Provider>
  );
};