
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Home, Edit3, Star, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
  
  if (!currentUser) { // Should be covered by isAuthenticated, but as an extra check
    return null; // Or a more specific message, though redirect should happen
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 items-center">
           <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary hover:text-sidebar-primary/80 transition-colors">
             <ShieldCheck className="h-7 w-7" />
             <span className="group-data-[collapsible=icon]:hidden">TrustVerify</span>
           </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{children: "My Reviews", side: "right"}}>
                <Link href="/dashboard">
                  <Star />
                  <span className="group-data-[collapsible=icon]:hidden">My Reviews</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{children: "Edit Profile", side: "right"}}>
                <Link href="/dashboard/edit-profile">
                  <Edit3 />
                  <span className="group-data-[collapsible=icon]:hidden">Edit Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{children: "Back to Home", side: "right"}}>
                <Link href="/">
                  <Home />
                  <span className="group-data-[collapsible=icon]:hidden">Back to Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4 md:hidden">
          {/* Mobile Header Content with SidebarTrigger */}
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
