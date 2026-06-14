'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchProducts } from '@/data/products';
import { Product } from '@/types';

export function Header() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.trim().length > 0) {
      setResults(searchProducts(val).slice(0, 6));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = (product: Product) => {
    setShowResults(false);
    setQuery('');
    router.push(`/search?q=${encodeURIComponent(product.name)}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#1B5E20',
      color: '#fff', padding: 0,
      boxShadow: '0 2px 12px rgba(27,94,32,0.3)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 20px', maxWidth: 1500, margin: '0 auto',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 4, border: '1px solid transparent', transition: '0.2s' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #FF9900, #FFB84D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🎙️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>Voice</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#FF9900', letterSpacing: -0.5 }}>Cart</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: -3, letterSpacing: 0.5 }}>by Amazon</div>
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} style={{ flex: 1, maxWidth: 680, margin: '0 12px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <select aria-label="Category" style={{
              width: 'auto', minWidth: 50, background: '#f3f3f3', border: 'none',
              padding: '10px 6px', fontSize: 12, color: '#555', cursor: 'pointer',
              borderRight: '1px solid #ddd', borderRadius: 0,
            }}>
              <option>All</option>
              <option>Fruits & Veg</option>
              <option>Dairy</option>
              <option>Staples</option>
              <option>Snacks</option>
              <option>Beverages</option>
              <option>Personal Care</option>
              <option>Household</option>
            </select>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search groceries, recipes, brands..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowResults(true); }}
              style={{
                flex: 1, border: 'none', padding: '10px 14px', fontSize: 14,
                outline: 'none', minWidth: 0, borderRadius: 0,
              }}
            />
            <button type="submit" aria-label="Search" style={{
              background: 'linear-gradient(135deg, #4CAF50, #388E3C)',
              border: 'none', padding: '0 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#fff', borderRadius: 0, transition: '0.2s',
            }}>
              🔍
            </button>
          </form>

          {/* Search Dropdown */}
          {showResults && results.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
              background: '#fff', border: '1px solid #ddd', borderTop: 'none',
              borderRadius: '0 0 8px 8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              maxHeight: 360, overflowY: 'auto',
            }}>
              {results.map(p => (
                <div key={p.id} onClick={() => handleResultClick(p)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                  transition: '0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fef9f0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <span style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.brand} · {p.category}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#B12704' }}>₹{p.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Account & Cart */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAuthenticated ? (
            <>
              <Link href="/members" style={{
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s', color: '#fff',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #81C784, #4CAF50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  👤
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>Hello, {user?.name?.split(' ')[0]}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>Account</div>
                </div>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#fff',
                transition: 'all 0.2s', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                <span style={{ fontSize: 14 }}>🚪</span> Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login" style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              transition: 'all 0.2s', color: '#fff',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <span style={{ fontSize: 18 }}>👤</span>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Hello, Sign in</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Account</div>
              </div>
            </Link>
          )}

          <Link href="/orders" style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            transition: 'all 0.2s', color: '#fff',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = ''; }}
          >
            <span style={{ fontSize: 16 }}>📦</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Orders</span>
          </Link>
        </div>

        {/* Cart Icon */}
        <Link href="/personal-cart" style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.2s', position: 'relative', color: '#fff',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = ''; }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>🛒</span>
          <span className="desktop-only" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Cart</span>
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              background: '#FF9900', color: '#111',
              fontSize: 10, fontWeight: 800, borderRadius: 10,
              padding: '2px 6px', minWidth: 18, textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
