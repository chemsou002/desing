import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { trpc } from '@/providers/trpc';

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  enrolledCourses: string[];
  courseProgress: Record<string, number>;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number) => void;
  addXp: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'electrohub_user';
const USERS_KEY = 'electrohub_users';
const APP_DATA_KEY = 'electrohub_app_data';

interface AppData {
  xp: number;
  enrolledCourses: string[];
  courseProgress: Record<string, number>;
}

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const getStoredUsers = (): Array<{ name: string; email: string; password: string }> => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getAppData = (): AppData => {
  const stored = localStorage.getItem(APP_DATA_KEY);
  return stored ? JSON.parse(stored) : { xp: 0, enrolledCourses: [], courseProgress: {} };
};

const storeUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const storeAppData = (data: AppData) => {
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use tRPC auth.me for OAuth authentication
  const { data: oauthUser, isLoading: oauthLoading } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  // Local state for the combined user
  const [localUser, setLocalUser] = useState<User | null>(getStoredUser);

  // Sync OAuth user with local state
  useEffect(() => {
    if (oauthUser) {
      const appData = getAppData();
      const user: User = {
        id: oauthUser.unionId,
        name: oauthUser.name || 'User',
        email: oauthUser.email || '',
        avatar: oauthUser.avatar || undefined,
        xp: appData.xp,
        enrolledCourses: appData.enrolledCourses,
        courseProgress: appData.courseProgress,
      };
      setLocalUser(user);
      storeUser(user);
    }
  }, [oauthUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const appData = getAppData();
      const user: User = {
        id: localUser?.id || crypto.randomUUID(),
        name: localUser?.name || found.name,
        email: found.email,
        xp: localUser?.xp || appData.xp || 0,
        enrolledCourses: localUser?.enrolledCourses || appData.enrolledCourses || [],
        courseProgress: localUser?.courseProgress || appData.courseProgress || {},
        avatar: localUser?.avatar,
      };
      setLocalUser(user);
      storeUser(user);
      return true;
    }
    return false;
  }, [localUser]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) {
      return false;
    }
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const appData = getAppData();
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      xp: appData.xp || 0,
      enrolledCourses: appData.enrolledCourses || [],
      courseProgress: appData.courseProgress || {},
    };
    setLocalUser(user);
    storeUser(user);
    return true;
  }, []);

  const logout = useCallback(() => {
    // Save current app data before logout
    if (localUser) {
      storeAppData({
        xp: localUser.xp,
        enrolledCourses: localUser.enrolledCourses,
        courseProgress: localUser.courseProgress,
      });
    }
    setLocalUser(null);
    storeUser(null);
    // Also call OAuth logout mutation
    logoutMutation.mutate();
  }, [localUser, logoutMutation]);

  const enrollInCourse = useCallback((courseId: string) => {
    setLocalUser((prev) => {
      if (!prev) return prev;
      if (prev.enrolledCourses.includes(courseId)) return prev;
      const updated: User = {
        ...prev,
        enrolledCourses: [...prev.enrolledCourses, courseId],
        courseProgress: { ...prev.courseProgress, [courseId]: 0 },
      };
      storeUser(updated);
      storeAppData({
        xp: updated.xp,
        enrolledCourses: updated.enrolledCourses,
        courseProgress: updated.courseProgress,
      });
      return updated;
    });
  }, []);

  const updateProgress = useCallback((courseId: string, progress: number) => {
    setLocalUser((prev) => {
      if (!prev) return prev;
      const updated: User = {
        ...prev,
        courseProgress: { ...prev.courseProgress, [courseId]: progress },
      };
      storeUser(updated);
      storeAppData({
        xp: updated.xp,
        enrolledCourses: updated.enrolledCourses,
        courseProgress: updated.courseProgress,
      });
      return updated;
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setLocalUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, xp: prev.xp + amount };
      storeUser(updated);
      storeAppData({
        xp: updated.xp,
        enrolledCourses: updated.enrolledCourses,
        courseProgress: updated.courseProgress,
      });
      return updated;
    });
  }, []);

  const isLoading = oauthLoading;
  const user = oauthUser && localUser ? localUser : (!oauthUser ? localUser : null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        enrollInCourse,
        updateProgress,
        addXp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
