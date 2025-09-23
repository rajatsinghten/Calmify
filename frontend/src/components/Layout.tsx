import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
  currentRole?: string;
}

export function Layout({ children, currentRole }: LayoutProps) {
  const { user } = useAuth();
  
  // Use the user's actual role from auth context, fallback to provided currentRole or default to patient
  const actualRole = user?.role || currentRole || "patient";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentRole={actualRole} />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}