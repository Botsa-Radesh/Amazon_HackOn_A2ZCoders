'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export function StickyCheckoutBar() {
  const router = useRouter();
  const { totalItems, totalPrice, activeCart } = useCart();

  if (!activeCart || totalItems === 0) return null;

  return (
    <div className="sticky-checkout-bar">
      <div className="checkout-total">
        <span className="total-label">Subtotal</span>
        <span className="total-amount">₹{totalPrice.toLocaleString()}</span>
        <span className="total-items">{totalItems} item{totalItems !== 1 ? 's' : ''} · {activeCart.splitMode} split</span>
      </div>
      <button className="checkout-btn" onClick={() => router.push('/checkout')}>
        🛒 Checkout →
      </button>
    </div>
  );
}
