import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  Phone,
  Heart,
  LogOut,
  User,
  Shield,
  Clock,
  FileText,
  Brain,
  Menu
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface AppNavbarProps {
  currentRole: string;
}

const roleConfigs = {
  patient: {
    title: "Patient",
    icon: User,
    items: [
      { title: "AI Chatbot", url: "/chatbot", icon: MessageCircle },
      { title: "My Sessions", url: "/my-sessions", icon: Clock },
      { title: "Peer Support", url: "/peer/request", icon: Users },
      { title: "Counselor Sessions", url: "/counselor/request", icon: UserCheck },
      { title: "Take Assessment", url: "/assessment", icon: FileText },
      { title: "Meditation", url: "/meditation", icon: Brain },
      { title: "Crisis Help", url: "/crisis", icon: AlertTriangle },
    ]
  },
  peer: {
    title: "Peer Volunteer",
    icon: UserCheck,
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Available Sessions", url: "/peer/available", icon: MessageCircle },
      { title: "My Sessions", url: "/my-sessions", icon: Clock },
      { title: "Resources", url: "/peer/resources", icon: BookOpen },
      { title: "Crisis Help", url: "/crisis", icon: AlertTriangle },
    ]
  },
  counselor: {
    title: "Counselor",
    icon: Heart,
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Available Sessions", url: "/counselor/available", icon: MessageCircle },
      { title: "My Sessions", url: "/my-sessions", icon: Clock },
      { title: "Notes & Records", url: "/counselor/notes", icon: FileText },
      { title: "Crisis Help", url: "/crisis", icon: AlertTriangle },
    ]
  },
  admin: {
    title: "Administrator",
    icon: Settings,
    items: [
      { title: "Analytics Dashboard", url: "/admin/analytics", icon: BarChart3 },
      { title: "User Management", url: "/admin/users", icon: Users },
      { title: "System Stats", url: "/admin/stats", icon: TrendingUp },
      { title: "Content Moderation", url: "/admin/moderation", icon: Shield },
      { title: "Crisis Management", url: "/admin/crisis", icon: AlertTriangle },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ]
  }
};

export function AppNavbar({ currentRole }: AppNavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleConfig = roleConfigs[currentRole as keyof typeof roleConfigs] || roleConfigs.patient;
  const IconComponent = roleConfig.icon;

  // Find current page title
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    for (const item of roleConfig.items) {
      if (item.url === currentPath) {
        return item.title;
      }
    }
    if (currentPath === '/crisis') return 'Emergency Help';
    if (currentPath === '/') return 'Home';
    return roleConfig.title;
  };

  const getRoleDisplayName = () => {
    if (!isAuthenticated || !user) return 'CALMIFY';
    
    switch (user.role) {
      case 'patient':
        return 'PATIENT';
      case 'peer':
        return 'PEER';
      case 'counselor':
        return 'COUNSELOR';
      case 'admin':
        return 'ADMIN';
      default:
        return 'CALMIFY';
    }
  };

  const handleHomeClick = () => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    // Route authenticated users based on their role
    switch (user.role) {
      case 'patient':
        navigate('/chatbot');
        break;
      case 'peer':
      case 'counselor':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/admin/analytics');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-[var(--glass)] backdrop-blur-[22px] border-b border-[var(--color-rule)] px-5 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-3 hover:bg-[var(--color-paper-2)] px-2.5 py-1.5 rounded-[var(--radius-inner)] -ml-2 transition-colors duration-150 group"
          title="Click to go to home page"
        >
          <div className="p-1 bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-[6px] group-hover:border-[var(--color-accent)] transition-colors duration-150 flex items-center justify-center">
            <img src="/meditation-white.png" alt="Calmify" className="h-5 w-5 object-contain" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-2">
              <span className="font-display text-base text-[var(--color-ink)] font-medium leading-none">
                Calmify
              </span>
              <span className="text-[11px] text-[var(--color-muted)] px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
                {getRoleDisplayName()}
              </span>
            </div>
            {user && (
              <p className="text-xs text-[var(--color-muted)] leading-none mt-1">
                {user.profile?.preferredName || user.profile?.firstName || user.username}
              </p>
            )}
          </div>
          <div className="sm:hidden text-left">
            <span className="text-xs text-[var(--color-ink)] font-medium">
              {getRoleDisplayName()}
            </span>
          </div>
        </button>

        {/* Center - Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => navigate('/crisis')}
            className="text-xs font-medium"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Crisis Help
          </Button>
          <span className="w-px h-4 bg-[var(--color-rule)] mx-1" />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            <a href="tel:112" className="flex items-center">
              <Phone className="h-3 w-3 mr-1.5 text-[var(--color-accent-2)]" />
              Helpline: 112
            </a>
          </Button>
        </div>

        {/* Right side - Menu Dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-[var(--radius-inner)] border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                <Menu className="h-4 w-4 text-[var(--color-ink)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-56 mt-1 rounded-[var(--radius-card)] border-[var(--color-rule)] bg-[var(--color-paper-2)] p-1.5 shadow-[var(--shadow-card)] text-[var(--color-ink)]">
              <DropdownMenuLabel className="text-[11px] text-[var(--color-muted)] px-2 py-1">Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--color-rule)]" />
              
              {/* Navigation Items */}
              {roleConfig.items.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <DropdownMenuItem key={`${item.url}-${item.title}-${index}`} asChild className="rounded-[var(--radius-inner)] focus:bg-[var(--color-paper-3)]">
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 w-full px-2 py-1.5 text-sm text-[var(--color-ink)]"
                    >
                      <ItemIcon className="h-4 w-4 text-[var(--color-muted)]" />
                      <span>{item.title}</span>
                    </NavLink>
                  </DropdownMenuItem>
                );
              })}
              
              <DropdownMenuSeparator className="bg-[var(--color-rule)]" />
              
              {/* Quick Actions for Mobile */}
              <div className="md:hidden">
                <DropdownMenuItem asChild className="rounded-[var(--radius-inner)] focus:bg-[var(--color-paper-3)]">
                  <NavLink to="/crisis" className="flex items-center gap-3 w-full px-2 py-1.5 text-sm text-[oklch(84%_0.10_25)]">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Emergency Help</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-[var(--radius-inner)] focus:bg-[var(--color-paper-3)]">
                  <a href="tel:112" className="flex items-center gap-3 w-full px-2 py-1.5 text-sm text-[var(--color-ink)]">
                    <Phone className="h-4 w-4 text-[var(--color-muted)]" />
                    <span>Crisis Line: 112</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[var(--color-rule)]" />
              </div>
              
              {/* Home Link */}
              <DropdownMenuItem asChild className="rounded-[var(--radius-inner)] focus:bg-[var(--color-paper-3)]">
                <NavLink to="/" className="flex items-center gap-3 w-full px-2 py-1.5 text-sm text-[var(--color-ink)]">
                  <Home className="h-4 w-4 text-[var(--color-muted)]" />
                  <span>Home</span>
                </NavLink>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[var(--color-rule)]" />
              
              {/* Auth Actions */}
              {isAuthenticated ? (
                <DropdownMenuItem onClick={handleLogout} className="rounded-[var(--radius-inner)] text-[oklch(84%_0.10_25)] focus:bg-[var(--color-paper-3)] px-2 py-1.5 text-sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  {user?.isAnonymous ? "End Session" : "Logout"}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/login')} className="rounded-[var(--radius-inner)] focus:bg-[var(--color-paper-3)] px-2 py-1.5 text-sm">
                  <User className="h-4 w-4 mr-2 text-[var(--color-muted)]" />
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
