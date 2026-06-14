'use client';
import React from 'react';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';
import { useToast } from '@/components/NotificationToast';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { activeCart, activeCartId, personalCartId, setActiveCart, createPersonalCart, addItem, updateQuantity, removeItem } = useCart();
  const { currentUserId, getMemberById } = useMembers();
  const { showToast } = useToast();

  // Find this product in the active cart
  const cartItem = activeCart?.items.find(
    i => i.product.id === product.id && i.addedBy === currentUserId
  );
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!activeCartId) {
      if (!personalCartId) {
        createPersonalCart(currentUserId, getMemberById(currentUserId)?.name || 'You');
      } else {
        setActiveCart(personalCartId);
      }
    }
    addItem(product, 1, currentUserId, false);
    if (quantity === 0) {
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  const handleIncrease = () => {
    addItem(product, 1, currentUserId, false);
  };

  const handleDecrease = () => {
    if (cartItem) {
      if (quantity <= 1) {
        removeItem(cartItem.id);
        showToast(`${product.name} removed`, 'info');
      } else {
        updateQuantity(cartItem.id, quantity - 1);
      }
    }
  };

  if (product.stockStatus === 'out_of_stock') {
    return (
      <button className="add-to-cart-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
        Out of Stock
      </button>
    );
  }

  if (quantity > 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 0, width: '100%', borderRadius: 20, overflow: 'hidden',
        border: '1px solid #1B5E20', background: '#f0fff4',
      }}>
        <button
          onClick={handleDecrease}
          style={{
            width: 36, height: 34, border: 'none',
            background: '#1B5E20', color: '#fff',
            fontSize: 18, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: '0.15s',
          }}
        >
          {quantity === 1 ? '🗑' : '−'}
        </button>
        <span style={{
          flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700,
          color: '#1B5E20', padding: '6px 0',
        }}>
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          style={{
            width: 36, height: 34, border: 'none',
            background: '#1B5E20', color: '#fff',
            fontSize: 18, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: '0.15s',
          }}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button className="add-to-cart-btn" onClick={handleAdd}>
      Add to Cart
    </button>
  );
}
