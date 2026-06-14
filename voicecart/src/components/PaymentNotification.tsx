'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMembers } from '@/context/MembersContext';
import { useAuth } from '@/context/AuthContext';

interface PaymentAlert {
  cartName: string;
  paidByName: string;
  paidByAvatar: string;
  splitAmount: number;
  splitMode: string;
  cartId: string;
}

export function PaymentNotification() {
  const [alert, setAlert] = useState<PaymentAlert | null>(null);
  const { currentUserId, getMemberById } = useMembers();
  const { userId } = useAuth();
  const router = useRouter();

  // Listen for custom event from CartContext polling
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { cartId, cartName, paidBy, splitMode } = e.detail;
      if (!paidBy || paidBy === userId) return; // Don't notify the payer

      const payer = getMemberById(paidBy);
      setAlert({
        cartName: cartName || 'Common Cart',
        paidByName: payer?.name || 'A member',
        paidByAvatar: payer?.avatar || '👤',
        splitAmount: 0,
        splitMode: splitMode || 'auto',
        cartId,
      });

      // Fetch split amount
      if (userId) {
        fetch(`/api/splits?userId=${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.splits && data.splits.length > 0) {
              const pending = data.splits.find(
                (s: any) => s.fromMemberId === userId && s.status === 'pending'
              );
              if (pending) {
                setAlert(prev => prev ? { ...prev, splitAmount: pending.amount } : null);
              }
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener('voicecart-payment-done', handler as EventListener);
    return () => window.removeEventListener('voicecart-payment-done', handler as EventListener);
  }, [userId, getMemberById]);

  const dismiss = useCallback(() => setAlert(null), []);

  if (!alert) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28,
        maxWidth: 380, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.4s ease',
        textAlign: 'center',
      }}>
        {/* Success icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4CAF50, #81C784)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 28,
          boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
          animation: 'pulse 1.5s infinite',
        }}>
          ✅
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8 }}>
          Payment Done!
        </h2>

        <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>{alert.paidByAvatar}</span>{' '}
          <strong>{alert.paidByName}</strong> paid for{' '}
          <strong>{alert.cartName}</strong>
        </p>

        {/* Split Amount */}
        {alert.splitAmount > 0 ? (
          <div style={{
            padding: 16, background: '#FFF8E0', borderRadius: 12,
            border: '1px solid #F0C14B', marginBottom: 16,
          }}>
            <p style={{ fontSize: 12, color: '#6d5a00', marginBottom: 4 }}>Your share to pay:</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#B12704' }}>
              ₹{alert.splitAmount}
            </p>
            <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
              {alert.splitMode === 'equal' ? 'Equal split among members' : 'Based on your items + shared items'}
            </p>
          </div>
        ) : (
          <div style={{
            padding: 12, background: '#f0fff4', borderRadius: 12,
            border: '1px solid #b7e4c7', marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, color: '#067D62', fontWeight: 600 }}>
              🎉 Split details loading...
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => { dismiss(); router.push('/splits'); }}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 8,
              background: 'linear-gradient(135deg, #FF9900, #E68A00)',
              color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            💰 View Split Details
          </button>
          <button
            onClick={dismiss}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 8,
              background: '#f5f5f5', color: '#333', border: '1px solid #ddd',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            OK, Got it
          </button>
        </div>

        {/* WhatsApp quick pay */}
        {alert.splitAmount > 0 && (
          <button
            onClick={() => {
              const msg = `Hi ${alert.paidByName}! I owe you ₹${alert.splitAmount} for our ${alert.cartName} order. Sending payment now! 💸`;
              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
              dismiss();
            }}
            style={{
              width: '100%', padding: '10px 16px', borderRadius: 8,
              background: '#25D366', color: '#fff', border: 'none',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            📱 Send Payment via WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
