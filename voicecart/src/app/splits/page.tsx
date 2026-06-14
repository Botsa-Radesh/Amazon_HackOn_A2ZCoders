'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/context/OrderContext';
import { useMembers } from '@/context/MembersContext';
import { useCoins } from '@/context/CoinsContext';
import { useToast } from '@/components/NotificationToast';
import { MemberAvatar } from '@/components/MemberAvatar';
import { SplitRequest } from '@/types';
import { calculateCoinsEarned } from '@/utils/coinsCalculator';

const PAYMENT_OPTIONS = [
  { id: 'amazon_pay', label: 'Amazon Pay', icon: '🅰️', color: '#FF9900', coinsEnabled: true, desc: 'Earn 5% coins!' },
  { id: 'phonepay', label: 'PhonePe', icon: '📱', color: '#5F259F', coinsEnabled: false, desc: 'UPI Payment' },
  { id: 'gpay', label: 'Google Pay', icon: '🟢', color: '#4285F4', coinsEnabled: false, desc: 'UPI Payment' },
  { id: 'card', label: 'Other UPI', icon: '💳', color: '#1A73E8', coinsEnabled: false, desc: 'Any UPI App' },
  { id: 'cash', label: 'Cash', icon: '💵', color: '#2E7D32', coinsEnabled: false, desc: 'Pay in person' },
];

export default function SplitsPage() {
  const router = useRouter();
  const { splitRequests, markSplitPaid } = useOrder();
  const { members, currentUserId, getMemberById } = useMembers();
  const { addCoins, streak } = useCoins();
  const { showToast } = useToast();

  const [paymentModal, setPaymentModal] = useState<{ splitId: string; amount: number } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const pendingSplits = useMemo(() => {
    return splitRequests.filter(s =>
      s.fromMemberId === currentUserId && s.status === 'pending'
    );
  }, [currentUserId, splitRequests]);

  const sentSplits = useMemo(() => {
    return splitRequests.filter(s => s.toMemberId === currentUserId);
  }, [currentUserId, splitRequests]);
  const history = useMemo(() => splitRequests.filter(s => s.status === 'paid'), [splitRequests]);

  const handleMarkPaid = (splitId: string, amount: number) => {
    setPaymentModal({ splitId, amount });
    setSelectedMethod(null);
  };

  const handleConfirmPayment = async () => {
    if (!paymentModal || !selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1200));

    markSplitPaid(paymentModal.splitId, selectedMethod);

    // Award coins if paid via Amazon Pay
    if (selectedMethod === 'amazon_pay') {
      const coinInfo = calculateCoinsEarned(paymentModal.amount, 'amazon_pay', true, streak);
      const coins = coinInfo.earned;
      if (coins > 0) {
        addCoins(coins, `Split payment via Amazon Pay (₹${paymentModal.amount})`);
        setEarnedCoins(coins);
        setShowCoinAnimation(true);
        setTimeout(() => setShowCoinAnimation(false), 2500);
      }
      showToast(`✅ Paid ₹${paymentModal.amount} via Amazon Pay! +${coins} coins 🪙`, 'success');
    } else {
      const methodLabel = PAYMENT_OPTIONS.find(o => o.id === selectedMethod)?.label || selectedMethod;
      showToast(`✅ Paid ₹${paymentModal.amount} via ${methodLabel}`, 'success');
    }

    setIsProcessing(false);
    setPaymentModal(null);
    setSelectedMethod(null);
  };

  return (
    <div className="page-content" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div className="page-header" style={{ margin: '-16px -16px 16px', borderRadius: 0 }}>
        <button className="back-btn" onClick={() => router.push('/dashboard')}>←</button>
        <h1>My Splits</h1>
      </div>

      {/* Coin Animation Overlay */}
      {showCoinAnimation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, pointerEvents: 'none',
        }}>
          <div style={{
            animation: 'slideUp 0.5s ease, fadeIn 0.3s ease',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 64, animation: 'bounce 0.6s ease infinite' }}>🪙</div>
            <p style={{
              fontSize: 28, fontWeight: 800, color: '#FF9900',
              textShadow: '0 2px 8px rgba(255,153,0,0.4)',
              marginTop: 8,
            }}>
              +{earnedCoins} Coins!
            </p>
          </div>
        </div>
      )}

      {/* Pending — what I owe */}
      <h3 className="section-title" style={{ fontSize: 16 }}>📋 I Owe</h3>
      {pendingSplits.length === 0 ? (
        <div className="amazon-card" style={{ textAlign: 'center', padding: 24, marginBottom: 16 }}>
          <span style={{ fontSize: 40 }}>✅</span>
          <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)', marginTop: 8 }}>You don&apos;t owe anyone. All cleared!</p>
        </div>
      ) : (
        pendingSplits.map(s => (
          <SplitCard key={s.id} split={s} onMarkPaid={handleMarkPaid} showActions />
        ))
      )}

      {/* Sent — what others owe me */}
      <h3 className="section-title" style={{ fontSize: 16, marginTop: 24 }}>💰 Others Owe Me</h3>
      {sentSplits.filter(s => s.status === 'pending').length === 0 ? (
        <div className="amazon-card" style={{ textAlign: 'center', padding: 24, marginBottom: 16 }}>
          <span style={{ fontSize: 40 }}>🪙</span>
          <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)', marginTop: 8 }}>No pending payments owed to you.</p>
        </div>
      ) : (
        sentSplits.filter(s => s.status === 'pending').map(s => (
          <SplitCard key={s.id} split={s} onMarkPaid={handleMarkPaid} showActions={false} />
        ))
      )}

      {/* History */}
      {history.length > 0 && (
        <>
          <h3 className="section-title" style={{ fontSize: 16, marginTop: 24 }}>📜 History</h3>
          {history.map(s => (
            <SplitCard key={s.id} split={s} onMarkPaid={handleMarkPaid} showActions={false} faded />
          ))}
        </>
      )}

      {/* Payment Method Modal */}
      {paymentModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 1000, padding: '0 0 0 0',
        }}
          onClick={() => { setPaymentModal(null); setSelectedMethod(null); }}
        >
          <div
            style={{
              width: '100%', maxWidth: 480,
              background: '#fff', borderRadius: '20px 20px 0 0',
              padding: '24px 20px 32px',
              animation: 'slideUp 0.3s ease',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 40, height: 4, background: '#ddd', borderRadius: 2,
                margin: '0 auto 16px',
              }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--amazon-text)', margin: 0 }}>
                Choose Payment Method
              </h2>
              <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)', marginTop: 4 }}>
                Pay <strong style={{ color: 'var(--amazon-price)', fontSize: 16 }}>₹{paymentModal.amount}</strong> to settle your share
              </p>
            </div>

            {/* Payment Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PAYMENT_OPTIONS.map(opt => {
                const isSelected = selectedMethod === opt.id;
                const coinPreview = opt.coinsEnabled
                  ? calculateCoinsEarned(paymentModal.amount, 'amazon_pay', true, streak).earned
                  : 0;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMethod(opt.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${isSelected ? opt.color : 'var(--amazon-border-light)'}`,
                      background: isSelected ? `${opt.color}08` : '#fff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Radio circle */}
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      border: `2px solid ${isSelected ? opt.color : '#ccc'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isSelected && (
                        <div style={{
                          width: 12, height: 12, borderRadius: '50%',
                          background: opt.color,
                        }} />
                      )}
                    </div>

                    {/* Icon */}
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.icon}</span>

                    {/* Label */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--amazon-text)', margin: 0 }}>
                        {opt.label}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', margin: 0 }}>
                        {opt.desc}
                      </p>
                    </div>

                    {/* Coin badge for Amazon Pay */}
                    {opt.coinsEnabled && coinPreview > 0 && (
                      <div style={{
                        background: 'linear-gradient(135deg, #FF9900, #FEBD69)',
                        color: '#fff', fontSize: 11, fontWeight: 700,
                        padding: '4px 10px', borderRadius: 20,
                        display: 'flex', alignItems: 'center', gap: 4,
                        boxShadow: '0 2px 6px rgba(255,153,0,0.3)',
                      }}>
                        🪙 +{coinPreview}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Amazon Pay Promo Banner */}
            {selectedMethod !== 'amazon_pay' && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 8,
                background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)',
                border: '1px solid #F0C14B',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>💡</span>
                <p style={{ fontSize: 11, color: '#7A5700', margin: 0 }}>
                  <strong>Pay with Amazon Pay</strong> to earn <strong style={{ color: '#FF9900' }}>5% coins</strong> on every split payment!
                </p>
              </div>
            )}

            {/* Confirm Button */}
            <button
              className="btn btn-primary btn-lg w-full"
              style={{
                marginTop: 16,
                opacity: selectedMethod ? 1 : 0.5,
                pointerEvents: selectedMethod ? 'auto' : 'none',
              }}
              onClick={handleConfirmPayment}
              disabled={!selectedMethod || isProcessing}
            >
              {isProcessing
                ? '⏳ Processing...'
                : selectedMethod === 'amazon_pay'
                  ? `Pay ₹${paymentModal.amount} & Earn Coins 🪙`
                  : `Pay ₹${paymentModal.amount}`
              }
            </button>

            <button
              className="btn btn-ghost w-full"
              style={{ marginTop: 8, fontSize: 13, color: 'var(--amazon-text-secondary)' }}
              onClick={() => { setPaymentModal(null); setSelectedMethod(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SplitCard({ split, onMarkPaid, showActions, faded }: {
  split: SplitRequest;
  onMarkPaid: (id: string, amount: number) => void;
  showActions: boolean;
  faded?: boolean;
}) {
  const { getMemberById } = useMembers();
  const toMember = getMemberById(split.toMemberId);
  const fromMember = getMemberById(split.fromMemberId);

  const paymentMethodLabel = split.paymentMethod
    ? PAYMENT_OPTIONS.find(o => o.id === split.paymentMethod)?.label || split.paymentMethod
    : null;
  const paymentMethodIcon = split.paymentMethod
    ? PAYMENT_OPTIONS.find(o => o.id === split.paymentMethod)?.icon || '💳'
    : null;

  return (
    <div className="amazon-card" style={{
      marginBottom: 12,
      opacity: faded ? 0.55 : 1,
      borderColor: split.status === 'paid' ? 'var(--amazon-success)' : 'var(--amazon-border-light)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MemberAvatar member={toMember || fromMember || { id: '', name: '', avatar: '👤', role: 'member', diet: 'veg', allergies: [], favoriteBrands: [], dislikes: [], isOnline: false, isTyping: false }} size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--amazon-text)' }}>
              {split.fromMemberId === split.toMemberId
                ? 'You'
                : `${fromMember?.name || split.fromName} → ${toMember?.name || split.toName}`}
            </p>
            <span className={`badge ${split.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
              {split.status === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>

          <p style={{ fontSize: 12, color: 'var(--amazon-text-secondary)', marginTop: 2 }}>
            Order #{split.orderId.slice(-6).toUpperCase()} · {split.deliverySlot}
            · {split.splitMode === 'family' ? 'Family' : split.splitMode === 'auto' ? 'Auto' : split.splitMode === 'equal' ? 'Equal' : 'Custom'} split
          </p>

          {split.items.length > 0 && split.splitMode === 'auto' && (
            <div style={{ marginTop: 4 }}>
              {split.items.slice(0, 3).map((item, i) => (
                <p key={i} style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                  {item.quantity}x {item.name} — ₹{item.price * item.quantity}
                </p>
              ))}
              {split.items.length > 3 && (
                <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                  +{split.items.length - 3} more items
                </p>
              )}
            </div>
          )}

          {/* Payment method + date info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)', margin: 0 }}>
              {new Date(split.createdAt).toLocaleDateString()}
              {split.status === 'paid' && split.paidAt ? ` · Paid ${new Date(split.paidAt).toLocaleDateString()}` : ''}
            </p>
            {split.status === 'paid' && paymentMethodLabel && (
              <span style={{
                fontSize: 10, fontWeight: 600,
                padding: '2px 8px', borderRadius: 10,
                background: split.paymentMethod === 'amazon_pay' ? '#FFF3CD' : '#f0f0f0',
                color: split.paymentMethod === 'amazon_pay' ? '#FF9900' : 'var(--amazon-text-secondary)',
                display: 'inline-flex', alignItems: 'center', gap: 3,
              }}>
                {paymentMethodIcon} {paymentMethodLabel}
                {split.paymentMethod === 'amazon_pay' && ' 🪙'}
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>Amount</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--amazon-price)' }}>₹{split.amount}</p>
          {showActions && split.status === 'pending' && (
            <button
              className="btn btn-success btn-sm"
              style={{ marginTop: 8, fontSize: 11 }}
              onClick={() => onMarkPaid(split.id, split.amount)}
            >
              ✅ Mark Paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
