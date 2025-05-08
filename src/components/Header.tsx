
'use client';

import Link from 'next/link';
import { ShieldCheck, LogOut, UserCircle, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { currentUser, logout, loading } = useAuth();

  return (
    <header className="py-4 px-6 shadow-md bg-card text-card-foreground">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          <ShieldCheck className="h-8 w-8" />
          <span>TrustVerify</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded-md"></div>
          ) : currentUser ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
