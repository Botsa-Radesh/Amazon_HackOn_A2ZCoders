'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  totalAmount: number;
}

export function PaymentNotification() {
  const [alert, setAlert] = useState<PaymentAlert | null>(null);
  const { currentUserId, getMemberById } = useMembers();
  const { userId } = useAuth();
  const router = useRouter();
  const retryRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch split amount with retries (server might take a moment to write)
  const fetchSplitAmount = useCallback((attempt = 0) => {
    if (!userId) return;
    fetch(`/api/splits?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.splits && data.splits.length > 0) {
          // Find the most recent pending split for this user
          const pending = data.splits
            .filter((s: any) => s.fromMemberId === userId && s.status === 'pending')
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          if (pending.length > 0) {
            setAlert(prev => prev ? {
              ...prev,
              splitAmount: pending[0].amount,
              totalAmount: pending[0].orderTotal || 0,
            } : null);
            return;
          }
        }
        // Retry up to 3 times with 2s delay (server might still be writing)
        if (attempt < 3) {
          retryRef.current = setTimeout(() => fetchSplitAmount(attempt + 1), 2000);
        }
      })
      .catch(() => {
        if (attempt < 3) {
          retryRef.current = setTimeout(() => fetchSplitAmount(attempt + 1), 2000);
        }
      });
  }, [userId]);

  // Listen for payment-done event from CartContext polling
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { cartId, cartName, paidBy, splitMode } = e.detail;
      if (!paidBy || paidBy === userId) return; // Don't notify the payer themselves

      const payer = getMemberById(paidBy);
      setAlert({
        cartName: cartName || 'Common Cart',
        paidByName: payer?.name || 'A member',
        paidByAvatar: payer?.avatar || '👤',
        splitAmount: 0,
        splitMode: splitMode || 'auto',
        cartId,
        totalAmount: 0,
      });

      // Start fetching split amount
      fetchSplitAmount(0);
    };

    window.addEventListener('voicecart-payment-done', handler as EventListener);
    return () => {
      window.removeEventListener('voicecart-payment-done', handler as EventListener);
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [userId, getMemberById, fetchSplitAmount]);

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
        background: '#fff', borderRadius: 20, padding: 32,
        maxWidth: 400, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.4s ease',
        textAlign: 'center',
      }}>
        {/* Success icon with ring animation */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 32,
          boxShadow: '0 6px 20px rgba(76,175,80,0.4)',
          animation: 'pulse 1.5s infinite',
        }}>
          ✅
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 6 }}>
          Order Paid!
        </h2>

        <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
          <span style={{ fontSize: 24, verticalAlign: 'middle' }}>{alert.paidByAvatar}</span>{' '}
          <strong>{alert.paidByName}</strong> paid for <strong>{alert.cartName}</strong>
        </p>

        {/* Split Amount Card */}
        {alert.splitAmount > 0 ? (
          <div style={{
            padding: 20, borderRadius: 14,
            background: 'linear-gradient(135deg, #FFF8E0, #FFF3CC)',
            border: '2px solid #F0C14B', marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, color: '#6d5a00', marginBottom: 6, fontWeight: 500 }}>Your share to pay {alert.paidByName}:</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#B12704', lineHeight: 1 }}>
              ₹{alert.splitAmount}
            </p>
            {alert.totalAmount > 0 && (
              <p style={{ fontSize: 11, color: '#888', marginTop: 8 }}>
                Order total: ₹{alert.totalAmount} · {alert.splitMode === 'equal' ? 'Split equally' : 'Based on your items'}
              </p>
            )}
          </div>
        ) : (
          <div style={{
            padding: 16, borderRadius: 14,
            background: '#f8f8f8', border: '1px solid #e0e0e0', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div className="typing-dots">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <span style={{ fontSize: 13, color: '#888' }}>Calculating your split...</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => { dismiss(); router.push('/splits'); }}
            style={{
              flex: 1, padding: '14px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg, #FF9900, #E68A00)',
              color: '#fff', border: 'none', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 3px 10px rgba(255,153,0,0.3)',
            }}
          >
            💰 View Split
          </button>
          <button
            onClick={dismiss}
            style={{
              flex: 1, padding: '14px 16px', borderRadius: 10,
              background: '#f5f5f5', color: '#333', border: '1px solid #ddd',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>

        {/* WhatsApp Quick Pay */}
        {alert.splitAmount > 0 && (
          <button
            onClick={() => {
              const msg = `Hi ${alert.paidByName}! 💸\n\nI owe you ₹${alert.splitAmount} for our "${alert.cartName}" order (total ₹${alert.totalAmount}).\n\nSending payment now via UPI! ✅`;
              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
              dismiss();
            }}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 10,
              background: '#25D366', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 3px 10px rgba(37,211,102,0.3)',
            }}
          >
            📱 Pay via WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
