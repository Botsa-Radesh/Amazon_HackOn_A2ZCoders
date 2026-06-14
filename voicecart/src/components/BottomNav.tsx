'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function BottomNav() {
  const pathname = usePathname();
  const { commonCarts, personalCartId, carts } = useCart();

  const personalCart = personalCartId ? carts[personalCartId] : null;
  const personalItems = personalCart?.items.length || 0;
  const commonCartItems = commonCarts.reduce((s, c) => s + c.items.length, 0);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/personal-cart', label: 'My Cart', icon: '🛒', badge: personalItems },
    { href: '/group-cart', label: 'Group', icon: '👥', badge: commonCarts.length > 0 ? commonCartItems : undefined },
    { href: '/splits', label: 'Splits', icon: '💰' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/members', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <button className={`nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{ fontSize: 9, color: 'var(--amazon-orange)', marginLeft: 1 }}>{item.badge}</span>
                )}
              </span>
              <span>{item.label}</span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
