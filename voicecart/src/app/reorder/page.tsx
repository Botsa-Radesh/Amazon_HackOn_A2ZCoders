'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { useMembers } from '@/context/MembersContext';
import { useToast } from '@/components/NotificationToast';
import { products } from '@/data/products';
import { predictReorder, getUrgencyColor } from '@/utils/reorderPredictor';

export default function ReorderPage() {
  const router = useRouter();
  const { addItem, activeCartId, personalCartId, setActiveCart, createPersonalCart, totalItems, totalPrice } = useCart();
  const { history } = useOrder();
  const { currentUserId, getMemberById } = useMembers();
  const { showToast } = useToast();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const reorderSummary = useMemo(() => predictReorder(history, products), [history]);

  // Get frequently ordered items (top by order count)
  const frequentItems = useMemo(() => {
    const countMap: Record<string, { product: any; count: number; lastQty: number }> = {};
    for (const order of history) {
      for (const item of order.items) {
        const pid = item.product.id;
        if (!countMap[pid]) {
          countMap[pid] = { product: item.product, count: 0, lastQty: item.quantity };
        }
        countMap[pid].count++;
        countMap[pid].lastQty = item.quantity;
      }
    }
    return Object.values(countMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [history]);

  const handleAddItem = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (!activeCartId) {
      if (!personalCartId) {
        createPersonalCart(currentUserId, getMemberById(currentUserId)?.name || 'You');
      } else {
        setActiveCart(personalCartId);
      }
    }
    addItem(product, quantity, currentUserId, false);
    setAddedItems(prev => new Set([...prev, productId]));
    showToast(`${product.name} x${quantity} added!`, 'success');
  };

  const handleAddAll = () => {
    reorderSummary.predictions.forEach(p => {
      handleAddItem(p.product.id, p.suggestedQuantity);
    });
    showToast(`Added ${reorderSummary.totalItems} items to cart!`, 'success');
  };

  const handleInstantBuy = async () => {
    // Add all predicted items first
    reorderSummary.predictions.forEach(p => {
      const product = products.find(pr => pr.id === p.product.id);
      if (product) addItem(product, p.suggestedQuantity, currentUserId, false);
    });
    // Navigate to instant checkout
    setTimeout(() => router.push('/checkout?instant=true'), 300);
  };

  return (
    <div className="page-content" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div className="page-header" style={{ margin: '-16px -16px 16px', borderRadius: 0 }}>
        <button className="back-btn" onClick={() => router.push('/')}>←</button>
        <h1>⚡ Smart Reorder</h1>
      </div>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
        borderRadius: 14, padding: 24, marginBottom: 20, color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
          🔄 Running Low?
        </h2>
        <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>
          Based on your order patterns, these items are due for restock.
        </p>
        {reorderSummary.predictions.length > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAddAll} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: 'rgba(255,255,255,0.95)', color: '#1B5E20',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              ➕ Add All ({reorderSummary.totalItems} items)
            </button>
            <button onClick={handleInstantBuy} style={{
              padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.4)',
              background: '#FF9900', color: '#111',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              ⚡ Buy Now — ₹{reorderSummary.totalCost}
            </button>
          </div>
        )}
      </div>

      {/* Predicted Reorder Items */}
      {reorderSummary.predictions.length > 0 ? (
        <div className="content-section" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📊</span> Predicted Restocks
            <span style={{ fontSize: 11, color: 'var(--amazon-text-muted)', fontWeight: 400, marginLeft: 'auto' }}>
              Based on {history.length} orders
            </span>
          </h3>
          {reorderSummary.predictions.map(p => {
            const isAdded = addedItems.has(p.product.id);
            const urgencyColor = getUrgencyColor(p.urgency);
            return (
              <div key={p.product.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', marginBottom: 8, borderRadius: 10,
                border: `1px solid ${isAdded ? '#b7e4c7' : '#eee'}`,
                background: isAdded ? '#f0fff4' : '#fff',
                borderLeft: `4px solid ${urgencyColor}`,
                transition: '0.2s',
              }}>
                <span style={{ fontSize: 28 }}>{p.product.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--amazon-text)' }}>{p.product.name}</p>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--amazon-text-muted)', marginTop: 2 }}>
                    <span>Last: {p.daysSinceLastOrder.toFixed(0)}d ago</span>
                    <span>•</span>
                    <span>Cycle: every {p.avgIntervalDays}d</span>
                    <span>•</span>
                    <span style={{ color: urgencyColor, fontWeight: 600, textTransform: 'uppercase' }}>
                      {p.urgency === 'high' ? '🔴 Urgent' : p.urgency === 'medium' ? '🟡 Soon' : '🟢 Low'}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--amazon-price)' }}>₹{p.product.price * p.suggestedQuantity}</p>
                  <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>x{p.suggestedQuantity}</p>
                </div>
                <button
                  onClick={() => handleAddItem(p.product.id, p.suggestedQuantity)}
                  disabled={isAdded}
                  style={{
                    padding: '8px 14px', borderRadius: 8, border: 'none',
                    background: isAdded ? '#b7e4c7' : '#1B5E20',
                    color: isAdded ? '#1B5E20' : '#fff',
                    fontSize: 12, fontWeight: 700, cursor: isAdded ? 'default' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {isAdded ? '✓ Added' : '+ Add'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="content-section" style={{ textAlign: 'center', padding: 40 }}>
          <span style={{ fontSize: 48 }}>📊</span>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--amazon-text)', marginTop: 12 }}>
            Not enough order history yet
          </p>
          <p style={{ fontSize: 12, color: 'var(--amazon-text-muted)', margin: '6px 0 16px' }}>
            Place 2+ orders and we'll predict your restock needs automatically.
          </p>
          <button className="btn btn-primary" onClick={() => router.push('/personal-cart')}>
            🛒 Start Shopping
          </button>
        </div>
      )}

      {/* Frequently Ordered */}
      {frequentItems.length > 0 && (
        <div className="content-section" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⭐</span> Your Favourites
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {frequentItems.map(({ product, count, lastQty }) => {
              const isAdded = addedItems.has(product.id);
              return (
                <div key={product.id} style={{
                  padding: 14, borderRadius: 10, border: `1px solid ${isAdded ? '#b7e4c7' : '#eee'}`,
                  background: isAdded ? '#f0fff4' : '#fff', textAlign: 'center',
                  transition: '0.2s',
                }}>
                  <span style={{ fontSize: 32 }}>{product.emoji}</span>
                  <p style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: 'var(--amazon-text)' }}>{product.name}</p>
                  <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>Ordered {count}x · ₹{product.price}</p>
                  <button
                    onClick={() => handleAddItem(product.id, lastQty)}
                    disabled={isAdded}
                    style={{
                      marginTop: 8, padding: '6px 12px', borderRadius: 6, border: 'none',
                      background: isAdded ? '#b7e4c7' : '#1B5E20', color: isAdded ? '#1B5E20' : '#fff',
                      fontSize: 11, fontWeight: 700, cursor: isAdded ? 'default' : 'pointer', width: '100%',
                    }}
                  >
                    {isAdded ? '✓ Added' : `+ Add (x${lastQty})`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart Summary Bar */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed', bottom: 70, left: 16, right: 16, zIndex: 90,
          background: '#fff', borderRadius: 12, padding: '12px 20px',
          border: '1px solid var(--amazon-border)', boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>Cart</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--amazon-price)' }}>₹{totalPrice}</p>
            <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>{totalItems} items</p>
          </div>
          <button onClick={() => router.push('/checkout?instant=true')} style={{
            padding: '12px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #FF9900, #E68A00)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(255,153,0,0.3)',
          }}>
            ⚡ Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
