
'use client';

import type { UserProfile } from '@/types';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { findUserByEmail, registerUser as apiRegisterUser, updateUserProfile as apiUpdateUserProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'bio' | 'avatarUrl'>>) => Promise<UserProfile | null>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_NAME = 'isAuthenticated';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser: UserProfile = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.email) {
           setCurrentUser(parsedUser);
           document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${COOKIE_MAX_AGE}`;
        } else {
            localStorage.removeItem('currentUser');
            document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      } else {
        document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    } catch (error) {
      console.error("Failed to process auth state from localStorage", error);
      localStorage.removeItem('currentUser');
      document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    const user = findUserByEmail(email);
    if (user && (password === user.password || !password) ) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${COOKIE_MAX_AGE}`;
      setLoading(false);
      toast({ title: "Login Successful", description: `Welcome back, ${user.name}!` });
      return true;
    }
    setLoading(false);
    toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
    return false;
  }, [toast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    router.push('/login');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [router, toast]);

  const register = useCallback(async (name: string, email: string, password?: string): Promise<UserProfile | null> => {
    setLoading(true);
    const newUser = apiRegisterUser({ name, email, password });
    if (newUser) {
      setLoading(false);
      toast({ title: "Registration Successful", description: "You can now log in." });
      return newUser;
    }
    setLoading(false);
    toast({ title: "Registration Failed", description: "Email may already be in use or an error occurred.", variant: "destructive" });
    return null;
  }, [toast]);
  
  const updateProfile = useCallback(async (updates: Partial<Pick<UserProfile, 'name' | 'bio' | 'avatarUrl'>>): Promise<UserProfile | null> => {
    if (!currentUser) {
        toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive"});
        return null;
    }
    setLoading(true);
    const updatedUser = apiUpdateUserProfile(currentUser.id, updates);
    if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        // Cookie is already set from login/initial load, no need to reset unless its lifetime needs extension.
        setLoading(false);
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated."});
        return updatedUser;
    }
    setLoading(false);
    toast({ title: "Update Failed", description: "Could not update profile.", variant: "destructive"});
    return null;
  }, [currentUser, toast]);


  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateProfile, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
