'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import dynamic from 'next/dynamic';

const VoiceCartPage = dynamic(() => import('../../voice-cart/page'), { ssr: false });

export default function GroupCartShopPage() {
  const { commonCarts, activeCartId, setActiveCart, isHydrated } = useCart();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    // If no common cart is active, set the first one
    const isCommonActive = commonCarts.some(c => c.id === activeCartId);
    if (!isCommonActive && commonCarts.length > 0) {
      setActiveCart(commonCarts[0].id);
    }
    setReady(true);
  }, [isHydrated, commonCarts, activeCartId, setActiveCart]);

  if (!ready) {
    return (
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>👥</span>
        <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', marginTop: 12 }}>Loading group cart...</p>
      </div>
    );
  }

  return <VoiceCartPage />;
}
