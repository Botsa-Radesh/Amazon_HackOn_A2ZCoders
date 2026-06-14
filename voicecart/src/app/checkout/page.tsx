'use client';
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';
import { useCoins } from '@/context/CoinsContext';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/components/NotificationToast';
import { CoinsAnimation } from '@/components/CoinsAnimation';
import { Confetti } from '@/components/Confetti';
import { CheckoutStepper } from '@/components/CheckoutStepper';
import { calculateCoinsEarned } from '@/utils/coinsCalculator';

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInstant = searchParams.get('instant') === 'true';
  const { activeCart, clearCart } = useCart();
  const items = activeCart?.items || [];
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const { members, currentUserId, getMemberById } = useMembers();
  const { addCoins, streak, incrementStreak } = useCoins();
  const { placeOrder, addSplitRequest } = useOrder();
  const { showToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [paidByName, setPaidByName] = useState('');
  const [mySplitAmount, setMySplitAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(isInstant ? 'amazon_pay' : null);

  const paymentMethods = [
    { id: 'amazon_pay', name: 'Amazon Pay', icon: '💰', color: '#FF9900', coins: true, desc: 'Earn coins on every order' },
    { id: 'phonepay', name: 'PhonePe', icon: '📱', color: '#5F259F', coins: false, desc: 'UPI payment' },
    { id: 'paytm', name: 'Paytm', icon: '💙', color: '#00BAF2', coins: false, desc: 'Wallet / UPI' },
    { id: 'gpay', name: 'Google Pay', icon: '🅶', color: '#4285F4', coins: false, desc: 'UPI payment' },
    { id: 'card', name: 'Credit / Debit Card', icon: '💳', color: '#333', coins: false, desc: 'Visa, Mastercard, RuPay' },
    { id: 'cod', name: 'Cash on Delivery', icon: '🏠', color: '#067D62', coins: false, desc: 'Pay when delivered' },
  ];

  const cartMembers = useMemo(
    () => members.filter(m => activeCart?.memberIds.includes(m.id)),
    [members, activeCart?.memberIds]
  );

  // On load, check if this cart was already checked out by ANOTHER member
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated || !activeCart?.id) return;
    // If user has items in cart, it's a new order — don't block
    if (items.length > 0) return;
    
    fetch(`/api/carts/${activeCart.id}`)
      .then(res => res.json())
      .then(data => {
        // Only block if someone ELSE checked out (not the current user starting a new order)
        if (data.cart?.checkedOut && data.cart?.checkedOutBy && data.cart.checkedOutBy !== currentUserId) {
          setAlreadyPaid(true);
          const payerName = getMemberById(data.cart.checkedOutBy)?.name || 'A member';
          setPaidByName(payerName);
          const splitMode = activeCart.splitMode || 'auto';
          if (splitMode === 'equal') {
            setMySplitAmount(Math.round(totalPrice / Math.max(cartMembers.length, 1)));
          } else if (splitMode === 'family') {
            setMySplitAmount(0);
          } else {
            const myItems = items.filter(i => i.addedBy === currentUserId && !i.isShared);
            const myTotal = myItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
            const sharedTotal = items.filter(i => i.isShared).reduce((s, i) => s + i.product.price * i.quantity, 0);
            const sharedShare = Math.round(sharedTotal / Math.max(cartMembers.length, 1));
            setMySplitAmount(myTotal + sharedShare);
          }
        }
      })
      .catch(() => {});
  }, [hydrated, activeCart?.id, activeCart?.splitMode, totalPrice, cartMembers.length, currentUserId, items, getMemberById]);

  const handleProcessPayment = async () => {
    if (!selectedPayment) { showToast('Please select a payment method!', 'warning'); return; }
    if (isProcessing) return;
    setIsProcessing(true);

    // ====== STEP 1: Check if already paid (race condition guard) ======
    if (activeCart?.id) {
      try {
        const checkRes = await fetch(`/api/carts/${activeCart.id}`);
        const checkData = await checkRes.json();
        if (checkData.cart?.checkedOut) {
          const payerName = getMemberById(checkData.cart.checkedOutBy)?.name || 'Someone';
          showToast(`Already paid by ${payerName}! Check your splits.`, 'error');
          setAlreadyPaid(true);
          setPaidByName(payerName);
          setIsProcessing(false);
          return;
        }
      } catch {}

      // ====== STEP 2: Mark cart as checkedOut IMMEDIATELY (lock it) ======
      try {
        await fetch(`/api/carts/${activeCart.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkedOut: true,
            checkedOutBy: currentUserId,
            checkedOutAt: new Date().toISOString(),
          }),
        });
      } catch {}
    }

    // ====== STEP 3: Process payment ======
    await new Promise(r => setTimeout(r, 1500));

    // Only earn coins if paying with Amazon Pay
    const isAmazonPay = selectedPayment === 'amazon_pay';
    const coinInfo = calculateCoinsEarned(totalPrice, selectedPayment as any, isAmazonPay, streak);
    const totalCoins = isAmazonPay ? coinInfo.earned : 0;

    const payerPayments = cartMembers.map(m => ({
      memberId: m.id,
      amount: m.id === currentUserId ? totalPrice : 0,
      method: selectedPayment as any,
      status: (m.id === currentUserId ? 'paid' : 'pending') as 'paid' | 'pending',
      coinsEarned: m.id === currentUserId ? totalCoins : 0,
    }));
    
    if (isAmazonPay && totalCoins > 0) {
      addCoins(totalCoins, `Order payment via Amazon Pay`);
      incrementStreak();
    }

    const slotTime = 'Express 10-15 min';
    const cartSplitMode = activeCart?.splitMode || 'auto';
    placeOrder(items, totalPrice, cartSplitMode, payerPayments, slotTime, totalCoins);

    // ====== STEP 4: Clear cart items in DynamoDB ======
    // Keep checkedOut=true with payer info so other members get the payment notification
    // It will auto-reset when any member starts a new order
    if (activeCart?.id) {
      // Delete all items from DynamoDB
      await Promise.all(items.map(item =>
        fetch(`/api/carts/${activeCart.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: item.id }),
        }).catch(() => {})
      ));
    }

    // ====== STEP 5: Create split requests for other members ======
    const orderId = `ord-${Date.now()}`;
    const payerName = getMemberById(currentUserId)?.name || 'Payer';
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
          toName: payerName,
          amount,
          splitMode: cartSplitMode,
          items: memberItems,
          status: 'pending',
          orderTotal: totalPrice,
          deliverySlot: slotTime,
        });
      }
    }

    // Mark as complete BEFORE clearing cart to avoid flash of empty state
    setIsProcessing(false);
    setIsComplete(true);
    setShowCoins(true);
    setShowConfetti(true);

    // Clear cart after marking complete
    clearCart();

    setTimeout(() => {
      setShowCoins(false);
      setShowConfetti(false);
      router.push('/order-confirmation');
    }, 1500);
  };

  // ====== LOADING STATE ======
  if (!hydrated) {
    return (
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>⏳</span>
        <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', marginTop: 12 }}>Loading checkout...</p>
      </div>
    );
  }

  // ====== ALREADY PAID BY ANOTHER MEMBER ======
  if (alreadyPaid) {
    return (
      <div className="page-content" style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div className="page-header" style={{ margin: '-16px -16px 16px', borderRadius: 0 }}>
          <button className="back-btn" onClick={() => router.push('/personal-cart')}>←</button>
          <h1>Checkout</h1>
        </div>
        <div className="amazon-card" style={{ textAlign: 'center', padding: 32, border: '2px solid #b7e4c7', background: '#f0fff4' }}>
          <span style={{ fontSize: 56 }}>✅</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--amazon-text)', marginTop: 16 }}>
            Already Paid!
          </h2>
          <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', margin: '8px 0 16px' }}>
            <strong>{paidByName}</strong> has already paid for this order.
          </p>

          {mySplitAmount > 0 && (
            <div style={{ padding: 16, background: '#fffbf0', borderRadius: 12, border: '1px solid #f0c14b', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)', marginBottom: 4 }}>Your share to pay:</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--amazon-price)' }}>₹{mySplitAmount}</p>
              <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginTop: 4 }}>
                Pay {paidByName} via UPI, cash, or Amazon Pay
              </p>
            </div>
          )}

          {mySplitAmount === 0 && (
            <div style={{ padding: 16, background: '#f0fff4', borderRadius: 12, border: '1px solid #b7e4c7', marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--amazon-success)', fontWeight: 600 }}>
                🎉 Nothing to pay! (Family mode)
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => router.push('/splits')}>
              💰 View My Splits
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => router.push('/orders')}>
              📦 View Orders
            </button>
          </div>

          {/* Share split via WhatsApp */}
          {mySplitAmount > 0 && (
            <button className="btn btn-ghost w-full" style={{ marginTop: 12 }}
              onClick={() => {
                const msg = `Hi ${paidByName}! I owe you ₹${mySplitAmount} for our VoiceCart order. Sending payment now! 💸`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
              }}>
              📱 Send Payment Message via WhatsApp
            </button>
          )}
        </div>
      </div>
    );
  }

  // ====== EMPTY CART ======
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

  // ====== MAIN CHECKOUT VIEW ======
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
            You paid ₹{totalPrice}. Other members will be notified of their split.
          </p>
        </div>
      ) : (
        <>
          {/* Info banner */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, padding: '12px 16px', background: '#fef4e8', borderRadius: 8, border: '1px solid #f0c14b', fontSize: 12, color: 'var(--amazon-text)', alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>💳</span>
            <span>Only one member needs to pay. Others will see their split amount automatically.</span>
          </div>

          {/* ⚡ Express Delivery — One Tap */}
          <div style={{
            marginBottom: 16, padding: '16px 20px', borderRadius: 12,
            background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
            color: '#fff', position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(27,94,32,0.25)',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>⚡</span>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Express Delivery</span>
                </div>
                <p style={{ fontSize: 12, opacity: 0.85 }}>
                  Get it in 10-15 min · Nearest slot auto-selected
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPayment('amazon_pay');
                  handleProcessPayment();
                }}
                disabled={isProcessing}
                style={{
                  padding: '12px 20px', borderRadius: 10, border: 'none',
                  background: '#FF9900', color: '#111',
                  fontSize: 13, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255,153,0,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                {isProcessing ? '⏳...' : `Pay ₹${totalPrice}`}
              </button>
            </div>
            <p style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>
              🪙 Pays with Amazon Pay · Earns {Math.round(totalPrice * 0.05)} coins
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 12, color: 'var(--amazon-text-muted)' }}>
            — or choose payment method below —
          </div>

          {/* Progress Stepper */}
          <CheckoutStepper currentStep={selectedPayment ? 3 : 2} />

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

          {/* Payment Method Selection */}
          <div className="content-section" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--amazon-text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💳</span> Select Payment Method
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {paymentMethods.map(method => {
                const isSelected = selectedPayment === method.id;
                return (
                  <div key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                      border: isSelected ? `2px solid ${method.color}` : '1px solid var(--amazon-border-light)',
                      background: isSelected ? `${method.color}08` : '#fff',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 2px 8px ${method.color}20` : 'none',
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${method.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {method.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--amazon-text)' }}>{method.name}</span>
                        {method.coins && (
                          <span style={{ fontSize: 10, background: '#fff8e0', color: '#9c7e31', padding: '2px 6px', borderRadius: 4, fontWeight: 600, border: '1px solid #f0c14b' }}>
                            🪙 Earn Coins
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginTop: 2 }}>{method.desc}</p>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      border: isSelected ? `6px solid ${method.color}` : '2px solid #ccc',
                      transition: 'all 0.2s ease',
                    }} />
                  </div>
                );
              })}
            </div>
            {selectedPayment === 'amazon_pay' && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fff8e0', borderRadius: 8, border: '1px solid #f0c14b', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🪙</span>
                <span style={{ fontSize: 12, color: '#6d5a00' }}>
                  You'll earn <strong>{Math.round(totalPrice * 0.05)}</strong> coins on this order!
                </span>
              </div>
            )}
            {selectedPayment && selectedPayment !== 'amazon_pay' && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#f5f5f5', borderRadius: 8, border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>ℹ️</span>
                <span style={{ fontSize: 12, color: 'var(--amazon-text-muted)' }}>
                  Switch to Amazon Pay to earn coins! No coins for {paymentMethods.find(m => m.id === selectedPayment)?.name}.
                </span>
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleProcessPayment}
            disabled={isProcessing || !selectedPayment}
            style={{ padding: 16, fontSize: 16 }}
          >
            {isProcessing ? '⏳ Processing Payment...' : `💳 Pay ₹${totalPrice} via ${paymentMethods.find(m => m.id === selectedPayment)?.name || '...'}`}
          </button>

          <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', textAlign: 'center', marginTop: 8 }}>
            ⚠️ Only one person needs to pay. Other members will be notified of their split.
          </p>
        </>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="page-content" style={{ paddingTop: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 48 }}>⏳</span>
        <p style={{ fontSize: 14, color: 'var(--amazon-text-secondary)', marginTop: 12 }}>Loading checkout...</p>
      </div>
    }>
      <CheckoutPageInner />
    </Suspense>
  );
}
