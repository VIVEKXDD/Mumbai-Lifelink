'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  TrainTrack,
  Map,
  Landmark,
  BookUser,
  MessageSquare,
  CalendarDays,
  Siren,
  User,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const menuItems = [
  { href: '/', label: 'Transit Tracker', icon: TrainTrack },
  { href: '/map', label: 'Local Map', icon: Map },
  { href: '/civic', label: 'Civic Hub', icon: Landmark },
  { href: '/directory', label: 'Local Directory', icon: BookUser },
  { href: '/forums', label: 'Forums', icon: MessageSquare },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/alerts', label: 'Safety Alerts', icon: Siren },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return null; // or a loading spinner
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-xl font-semibold font-headline">
                {menuItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            <UserMenu />
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-white">{children}</main>
        </SidebarInset>
      </SidebarProvider>
  );
}

function UserMenu() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading) {
    return null; // Or a skeleton loader
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Link>
        </Button>
        <Button asChild>
          <Link href="/signup">
             <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt="User" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'Mumbaikar'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || 'anonymous'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
