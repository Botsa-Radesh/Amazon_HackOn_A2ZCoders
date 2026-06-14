'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categoryLinks = [
  { href: '/', label: 'All', emoji: '≡' },
  { href: '/personal-cart', label: 'My Cart', emoji: '🛒' },
  { href: '/group-cart', label: 'Group Cart', emoji: '👥' },
  { href: '/reorder', label: 'Reorder', emoji: '⚡' },
  { href: '/common-cart', label: 'Create/Join', emoji: '➕' },
  { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
  { href: '/checkout', label: 'Checkout', emoji: '💳' },
  { href: '/splits', label: 'My Splits', emoji: '💰' },
  { href: '/orders', label: 'Orders', emoji: '📦' },
  { href: '/search', label: 'Browse', emoji: '🔍' },
];

export function SubHeader() {
  const pathname = usePathname();

  return (
    <div className="sub-header desktop-only">
      <div className="sub-header-inner">
        {categoryLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`sub-header-item ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? 'active' : ''}`}
          >
            <span style={{ fontSize: 15 }}>{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
