import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Home, 
  MessageCircle, 
  Users, 
  Archive, 
  BookOpen, 
  Star, 
  Settings,
  BarChart3,
  UserCheck,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Heart,
  LogOut,
  User,
  Shield,
  Clock,
  HelpCircle,
  FileText,
  Brain
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  currentRole: string;
}

const roleConfigs = {
  patient: {
    title: "Patient",
    icon: User,
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "AI Chatbot", url: "/chatbot", icon: MessageCircle },
      { title: "Peer Support", url: "/peer/chats", icon: Users },
      { title: "Counselor Sessions", url: "/counsellor/sessions", icon: UserCheck },
      { title: "Take Assessment", url: "/questionnaire/PHQ-9", icon: FileText },
      { title: "Meditation", url: "/meditation", icon: Brain },
      { title: "Crisis Help", url: "/crisis", icon: AlertTriangle },
    ]
  },
  peer: {
    title: "Peer Volunteer",
    icon: UserCheck,
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "Active Sessions", url: "/peer/chats", icon: MessageCircle },
      { title: "Session History", url: "/peer/history", icon: Archive },
      { title: "Crisis Alerts", url: "/peer/alerts", icon: AlertTriangle },
      { title: "Resources", url: "/peer/resources", icon: BookOpen },
      { title: "Training", url: "/peer/training", icon: Star },
    ]
  },
  counselor: {
    title: "Counselor",
    icon: Heart,
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "My Sessions", url: "/counsellor/sessions", icon: MessageCircle },
      { title: "Patient Reports", url: "/counsellor/reports", icon: Archive },
      { title: "Crisis Alerts", url: "/counsellor/alerts", icon: AlertTriangle },
      { title: "Schedule", url: "/counsellor/calendar", icon: Calendar },
      { title: "Notes & Records", url: "/counsellor/notes", icon: FileText },
    ]
  },
  admin: {
    title: "Administrator",
    icon: Settings,
    items: [
      { title: "Dashboard", url: "/admin/analytics", icon: BarChart3 },
      { title: "User Management", url: "/admin/users", icon: Users },
      { title: "Crisis Management", url: "/admin/crisis", icon: Shield },
      { title: "Reports", url: "/admin/reports", icon: TrendingUp },
      { title: "System Settings", url: "/admin/settings", icon: Settings },
      { title: "Audit Logs", url: "/admin/logs", icon: Archive },
    ]
  },
  student: {
    title: "Student",
    icon: Users,
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "AI Chatbot", url: "/chatbot", icon: MessageCircle },
      { title: "Peer Support", url: "/peer/chats", icon: Users },
      { title: "Counselor Sessions", url: "/counsellor/sessions", icon: UserCheck },
      { title: "Take Assessment", url: "/questionnaire/PHQ-9", icon: FileText },
      { title: "Meditation", url: "/meditation", icon: Brain },
      { title: "Crisis Help", url: "/crisis", icon: AlertTriangle },
    ]
  }
};

export function AppSidebar({ currentRole }: AppSidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use user's actual role if authenticated, otherwise use currentRole prop
  const effectiveRole = isAuthenticated && user?.role ? user.role : currentRole;
  const config = roleConfigs[effectiveRole as keyof typeof roleConfigs] || roleConfigs.student;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sidebar className="w-64 border-r bg-gray-100">
      <SidebarHeader className="p-4 border-b border-gray-200">
                <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200">
          <Brain className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg text-gray-800">Calmify</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-sm text-black">
            <config.icon className="h-4 w-4" />
            <span>{config.title}</span>
          </div>
          {isAuthenticated && (
            <Badge variant={user?.isAnonymous ? "secondary" : "default"} className="text-xs">
              {user?.isAnonymous ? "Anonymous" : "Logged In"}
            </Badge>
          )}
        </div>
        {isAuthenticated && user && !user.isAnonymous && (
          <div className="mt-2 text-xs text-muted-foreground">
            Welcome, {user.profile?.preferredName || user.profile?.firstName || user.username}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-muted-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.title === "Crisis Help" && (
                        <AlertTriangle className="h-3 w-3 text-destructive ml-auto" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isAuthenticated ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/login"
                        className="flex items-center gap-3 px-4 py-2 text-xs text-black-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                      >
                        <User className="h-3 w-3" />
                        <span>Login</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/register"
                        className="flex items-center gap-3 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                      >
                        <Users className="h-3 w-3" />
                        <span>Register</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/questionnaire/PHQ-9"
                        className="flex items-center gap-3 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Quick Assessment</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/crisis"
                        className="flex items-center gap-3 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>Get Help Now</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help & Support */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#help"
                    className="flex items-center gap-3 px-4 py-2 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                  >
                    <HelpCircle className="h-3 w-3" />
                    <span>Help & FAQ</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="tel:988"
                    className="flex items-center gap-3 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    <span>Crisis Line: 988</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user actions */}
      <SidebarFooter className="p-4 border-t border-gray-200">
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Session active</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {user?.isAnonymous ? "End Session" : "Logout"}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button
              size="sm"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Login to Continue
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}