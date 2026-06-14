'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';
import dynamic from 'next/dynamic';

// Dynamically import the voice cart inner component to avoid SSR issues
const VoiceCartPage = dynamic(() => import('../voice-cart/page'), { ssr: false });

export default function PersonalCartPage() {
  const { personalCartId, setActiveCart, createPersonalCart, isHydrated } = useCart();
  const { currentUserId, getMemberById } = useMembers();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (personalCartId) {
      setActiveCart(personalCartId);
    } else {
      const name = getMemberById(currentUserId)?.name || 'You';
      createPersonalCart(currentUserId, name);
    }
    setReady(true);
  }, [isHydrated, personalCartId, setActiveCart, createPersonalCart, currentUserId, getMemberById]);

  if (!ready) {
    return (
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>🛒</span>
        <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', marginTop: 12 }}>Loading your cart...</p>
      </div>
    );
  }

  return <VoiceCartPage />;
}
