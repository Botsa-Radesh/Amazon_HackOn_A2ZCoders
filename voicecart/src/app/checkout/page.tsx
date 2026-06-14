'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';
import { useCoins } from '@/context/CoinsContext';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/components/NotificationToast';
import { CoinsAnimation } from '@/components/CoinsAnimation';
import { Confetti } from '@/components/Confetti';
import { DeliverySlotVoting } from '@/components/DeliverySlotVoting';
import { calculateCoinsEarned } from '@/utils/coinsCalculator';

export default function CheckoutPage() {
  const router = useRouter();
  const { activeCart, clearCartAfterCheckout, isHydrated } = useCart();
  const items = activeCart?.items || [];
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const { members, currentUserId, getMemberById } = useMembers();
  const { addCoins, streak, incrementStreak } = useCoins();
  const { placeOrder, deliverySlots, addSplitRequest } = useOrder();
  const { showToast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotConfirmed, setSlotConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const cartMembers = useMemo(
    () => members.filter(m => activeCart?.memberIds.includes(m.id)),
    [members, activeCart?.memberIds]
  );

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setSlotConfirmed(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedSlot) { showToast('Please select a delivery slot!', 'warning'); return; }
    setIsProcessing(true);

    if (activeCart?.id) {
      try {
        const checkRes = await fetch(`/api/carts/${activeCart.id}`);
        const checkData = await checkRes.json();
        if (checkData.cart?.checkedOut) {
          showToast('This cart was already checked out by another member!', 'error');
          setIsProcessing(false);
          router.push('/splits');
          return;
        }
      } catch {}
    }

    await new Promise(r => setTimeout(r, 1500));

    const coinInfo = calculateCoinsEarned(totalPrice, 'amazon_pay', true, streak);
    const totalCoins = coinInfo.earned;

    const payerPayments = cartMembers.map(m => ({
      memberId: m.id,
      amount: m.id === currentUserId ? totalPrice : 0,
      method: 'amazon_pay' as const,
      status: (m.id === currentUserId ? 'paid' : 'pending') as 'paid' | 'pending',
      coinsEarned: m.id === currentUserId ? totalCoins : 0,
    }));
    addCoins(totalCoins, 'Order payment');
    incrementStreak();

    const slot = deliverySlots.find(s => s.id === selectedSlot);
    const slotTime = slot?.time || '7-9 AM';
    const cartSplitMode = activeCart?.splitMode || 'auto';
    placeOrder(items, totalPrice, cartSplitMode, payerPayments, slotTime, totalCoins);

    if (activeCart?.id) {
      items.forEach(item => {
        fetch(`/api/carts/${activeCart.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: item.id }),
        }).catch(() => {});
      });
    }

    clearCartAfterCheckout();

    const orderId = `ord-${Date.now()}`;
    const nonPayerMembers = cartMembers.filter(m => m.id !== currentUserId);

    if (cartSplitMode !== 'family' && nonPayerMembers.length > 0) {
      for (const m of nonPayerMembers) {
        let amount = 0;
        let memberItems: { productId: string; name: string; quantity: number; price: number }[] = [];

        if (cartSplitMode === 'equal') {
          amount = Math.round(totalPrice / cartMembers.length);
          memberItems = items.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.price }));
        } else {
          const personalItems = items.filter(i => i.addedBy === m.id && !i.isShared);
          const personalTotal = personalItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
          const sharedTotal = items.filter(i => i.isShared).reduce((s, i) => s + i.product.price * i.quantity, 0);
          const sharedShare = cartMembers.length > 0 ? Math.round(sharedTotal / cartMembers.length) : 0;
          amount = personalTotal + sharedShare;
          memberItems = personalItems.map(i => ({ productId: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.price }));
        }

        if (amount <= 0) continue;

        addSplitRequest({
          orderId,
          fromMemberId: m.id,
          toMemberId: currentUserId,
          payerUserId: currentUserId,
          fromName: m.name,
          toName: getMemberById(currentUserId)?.name || 'Payer',
          amount,
          splitMode: cartSplitMode,
          items: memberItems,
          status: 'pending',
          orderTotal: totalPrice,
          deliverySlot: slotTime,
        });
      }
    }

    setIsProcessing(false);
    setIsComplete(true);
    setShowCoins(true);
    setShowConfetti(true);

    setTimeout(() => {
      setShowCoins(false);
      setShowConfetti(false);
      router.push('/order-confirmation');
    }, 1500);
  };

  // Loading state — wait for cart data
  if (!isHydrated) {
    return (
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>⏳</span>
        <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', marginTop: 12 }}>Loading checkout...</p>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !isComplete) {
    return (
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 64 }}>🛒</span>
        <p style={{ fontSize: 16, color: 'var(--amazon-text-secondary)', margin: '16px 0' }}>
          No items to checkout. Add items to your cart first!
        </p>
        <button className="btn btn-primary" onClick={() => router.push('/personal-cart')}>
          🛒 Go to My Cart
        </button>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <CoinsAnimation amount={50} active={showCoins} />
      <Confetti active={showConfetti} />

      <div className="page-header" style={{ margin: '-16px -16px 16px', borderRadius: 0 }}>
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <h1>Checkout</h1>
      </div>

      {isComplete ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="checkmark">
            <svg viewBox="0 0 40 40">
              <path d="M10 20 L18 28 L30 12" style={{ strokeDasharray: 100, strokeDashoffset: 0, animation: 'checkmark 0.6s ease forwards' }} />
            </svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '16px 0 8px', color: 'var(--amazon-text)' }}>Order Placed! 🎉</h2>
          <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)' }}>
            You paid ₹{totalPrice}. Redirecting to confirmation...
          </p>
        </div>
      ) : (
        <>
          {/* Info banner */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, padding: '12px 16px', background: '#fef4e8', borderRadius: 8, border: '1px solid #f0c14b', fontSize: 12, color: 'var(--amazon-text)', alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>🗳️</span>
            <span>Select a delivery slot and pay. You can split the bill with your group later.</span>
          </div>

          {/* ===== ITEMS READY TO CHECKOUT ===== */}
          <div className="content-section" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--amazon-text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🛒</span> Items Ready to Checkout ({totalItems})
            </h3>

            {/* Shared Items */}
            {items.filter(i => i.isShared).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '6px 10px', background: '#f0f7ff', borderRadius: 8, border: '1px solid #d0e3f7' }}>
                  <span style={{ fontSize: 16 }}>🤝</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-text)' }}>Shared Items</span>
                  <span style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginLeft: 'auto' }}>
                    ₹{items.filter(i => i.isShared).reduce((s, i) => s + i.product.price * i.quantity, 0)}
                  </span>
                </div>
                {items.filter(i => i.isShared).map(item => {
                  const addedByMember = getMemberById(item.addedBy);
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4, background: '#fafafa', borderRadius: 8, border: '1px solid #eee' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {item.product.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--amazon-text)' }}>{item.product.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                          {item.quantity} × ₹{item.product.price} · Added by {addedByMember?.name || 'Unknown'}
                        </p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-price)' }}>₹{item.product.price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Per-Member Items */}
            {(() => {
              const memberIds = [...new Set(items.filter(i => !i.isShared).map(i => i.addedBy))];
              return memberIds.map(memberId => {
                const member = getMemberById(memberId);
                const memberItems = items.filter(i => i.addedBy === memberId && !i.isShared);
                if (memberItems.length === 0) return null;
                const memberTotal = memberItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
                return (
                  <div key={memberId} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '6px 10px', background: memberId === currentUserId ? '#f0fff4' : '#fef9f0', borderRadius: 8, border: `1px solid ${memberId === currentUserId ? '#b7e4c7' : '#f0deb8'}` }}>
                      <span style={{ fontSize: 18 }}>{member?.avatar || '👤'}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-text)' }}>
                        {member?.name || (memberId === currentUserId ? 'You' : 'Guest')}
                        {memberId === currentUserId && <span style={{ fontSize: 10, color: 'var(--amazon-success)', marginLeft: 4 }}>(You)</span>}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginLeft: 'auto' }}>
                        {memberItems.length} item{memberItems.length !== 1 ? 's' : ''} · ₹{memberTotal}
                      </span>
                    </div>
                    {memberItems.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4, background: '#fafafa', borderRadius: 8, border: '1px solid #eee' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {item.product.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--amazon-text)' }}>{item.product.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                            {item.quantity} × ₹{item.product.price} · {item.product.brand}
                          </p>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-price)' }}>₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                );
              });
            })()}

            {/* Grand Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--amazon-border)', paddingTop: 12, marginTop: 8 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--amazon-text)' }}>Grand Total</span>
                <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginTop: 2 }}>
                  {totalItems} items · {activeCart?.splitMode || 'auto'} split
                </p>
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--amazon-price)' }}>₹{totalPrice}</span>
            </div>
          </div>

          {/* Delivery Slot */}
          <div className="content-section" style={{ marginBottom: 16 }}>
            <h3 className="section-title">🚚 Select Delivery Slot</h3>
            <DeliverySlotVoting
              onSelectSlot={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          </div>

          {/* Pay Button */}
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleProcessPayment}
            disabled={isProcessing || !selectedSlot}
            style={{ padding: 16, fontSize: 16 }}
          >
            {isProcessing ? '⏳ Processing...' : `💳 Pay ₹${totalPrice} & Place Order`}
          </button>
        </>
      )}
    </div>
  );
}
