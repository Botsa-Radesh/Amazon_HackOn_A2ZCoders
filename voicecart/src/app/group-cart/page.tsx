'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';
import { useToast } from '@/components/NotificationToast';

export default function GroupCartPage() {
  const router = useRouter();
  const { commonCarts, activeCartId, setActiveCart, leaveCommonCart } = useCart();
  const { currentUserId, getMemberById } = useMembers();
  const { showToast } = useToast();

  const handleOpenCart = (cartId: string) => {
    setActiveCart(cartId);
    router.push('/voice-cart');
  };

  return (
    <div className="page-content" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div className="page-header" style={{ margin: '-16px -16px 16px', borderRadius: 0 }}>
        <button className="back-btn" onClick={() => router.push('/')}>←</button>
        <h1>👥 Group Carts</h1>
      </div>

      {commonCarts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px' }}>
          <span style={{ fontSize: 64 }}>👥</span>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--amazon-text)', marginTop: 16 }}>
            No Group Carts Yet
          </h2>
          <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)', margin: '8px 0 24px', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
            Create a common cart and invite your flatmates, family, or friends to shop together.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => router.push('/common-cart')}>
            ✨ Create Group Cart
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)', marginBottom: 16 }}>
            All your shared group carts. Even after ordering, the cart stays alive for future orders.
          </p>

          {commonCarts.map(cc => {
            const memberAvatars = cc.memberIds.map(id => getMemberById(id)).filter(Boolean);
            const cartTotal = cc.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
            const isActive = activeCartId === cc.id;

            return (
              <div key={cc.id} className="amazon-card animate-fadeIn" style={{
                marginBottom: 12,
                border: isActive ? '2px solid var(--amazon-orange)' : '1px solid var(--amazon-border-light)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {isActive && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--amazon-orange)' }} />
                )}
                <div style={{ padding: 16 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        🏠
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--amazon-text)' }}>
                          {cc.name}
                          {isActive && <span style={{ fontSize: 10, color: 'var(--amazon-orange)', marginLeft: 6 }}>● Active</span>}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                          Code: <strong style={{ letterSpacing: 1, color: 'var(--amazon-orange)' }}>{cc.code}</strong>
                          {' · '}{cc.splitMode} split
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ textAlign: 'center', padding: '8px', background: '#f9f9f9', borderRadius: 8 }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: cc.items.length > 0 ? 'var(--amazon-text)' : 'var(--amazon-text-muted)' }}>
                        {cc.items.length}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>Items</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', background: '#f9f9f9', borderRadius: 8 }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--amazon-price)' }}>
                        ₹{cartTotal}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>Total</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', background: '#f9f9f9', borderRadius: 8 }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--amazon-text)' }}>
                        {cc.memberIds.length}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>Members</p>
                    </div>
                  </div>

                  {/* Members */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                    {memberAvatars.slice(0, 6).map(m => m && (
                      <div key={m.id} title={m.name} style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}>{m.avatar}</div>
                    ))}
                    {cc.memberIds.length > 6 && (
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: 'var(--amazon-text-muted)',
                      }}>+{cc.memberIds.length - 6}</div>
                    )}
                  </div>

                  {/* Empty state hint */}
                  {cc.items.length === 0 && (
                    <div style={{ padding: '8px 12px', background: '#fef9f0', borderRadius: 8, border: '1px solid #f0deb8', marginBottom: 12 }}>
                      <p style={{ fontSize: 11, color: 'var(--amazon-text-secondary)' }}>
                        🛒 Cart is empty — add items via voice or browse to start a new order!
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: 12 }}
                      onClick={() => handleOpenCart(cc.id)}>
                      {cc.items.length > 0 ? '🛒 Open Cart' : '🎙️ Start Shopping'}
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 12 }}
                      onClick={() => {
                        navigator.clipboard.writeText(cc.code);
                        showToast('Code copied!', 'success');
                      }}>
                      📋
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, color: 'var(--amazon-error)' }}
                      onClick={() => {
                        leaveCommonCart(cc.id, currentUserId);
                        showToast(`Left "${cc.name}"`, 'info');
                      }}>
                      🚪
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create another */}
          <button className="btn btn-secondary w-full" style={{ marginTop: 8 }}
            onClick={() => router.push('/common-cart')}>
            ➕ Create or Join Another Group Cart
          </button>
        </>
      )}
    </div>
  );
}
