import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: ReactNode;
  currentRole?: string;
}

export function Layout({ children, currentRole = "student" }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentRole={currentRole} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}