'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';

export default function MyCartPage() {
  const router = useRouter();
  const { personalCartId, setActiveCart, createPersonalCart } = useCart();
  const { currentUserId, getMemberById } = useMembers();

  useEffect(() => {
    if (personalCartId) {
      setActiveCart(personalCartId);
    } else {
      const name = getMemberById(currentUserId)?.name || 'You';
      createPersonalCart(currentUserId, name);
    }
    router.replace('/voice-cart');
  }, [personalCartId, setActiveCart, createPersonalCart, currentUserId, getMemberById, router]);

  return (
    <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
      <span style={{ fontSize: 48 }}>🛒</span>
      <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', marginTop: 12 }}>Opening your personal cart...</p>
    </div>
  );
}
