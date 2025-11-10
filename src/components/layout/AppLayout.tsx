import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Kanban,
  ClipboardCheck,
  Network,
  TrendingUp,
  Palette,
  Settings,
  LogOut,
  Bell,
  User,
  FolderKanban,
  Users2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavLink } from '@/components/NavLink';
import { ProjectSelector } from '@/components/layout/ProjectSelector';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

interface AppLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Requirements', href: '/requirements', icon: FileText },
  { name: 'Elicitation', href: '/elicitation', icon: Kanban },
  { name: 'Reviews', href: '/reviews', icon: ClipboardCheck },
  { name: 'Review Sessions', href: '/review-sessions', icon: Users2 },
  { name: 'Traceability', href: '/traceability', icon: Network },
  { name: 'Impact Analysis', href: '/impact-analysis', icon: TrendingUp },
  { name: 'Design System', href: '/design-system', icon: Palette },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Project Selector */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AREP</h1>
                  <p className="text-xs text-muted-foreground">Requirements Platform</p>
                </div>
              </div>
              
              <ProjectSelector />
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                      {user?.fullName.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-8 px-4 sm:px-6 lg:px-8" aria-label="Navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent transition-colors"
                  activeClassName="text-primary border-primary"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className="flex items-center space-x-2 px-1 py-4 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent transition-colors"
                activeClassName="text-primary border-primary"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
