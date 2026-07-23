"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Search, PlaySquare, Settings, User } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  // Hide on public routes
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Rooms', href: '/rooms', icon: PlaySquare },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[var(--color-surface)] px-2 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] lg:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
              isActive ? 'text-[var(--color-accent-pink)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] font-medium tracking-wide">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
