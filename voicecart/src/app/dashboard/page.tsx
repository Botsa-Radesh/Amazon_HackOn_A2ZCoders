'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCoins } from '@/context/CoinsContext';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { useMembers } from '@/context/MembersContext';
import { useToast } from '@/components/NotificationToast';
import { TemplateCard } from '@/components/TemplateCard';
import { BarChart, DonutChart } from '@/components/AnalyticsChart';
import { predictReorder } from '@/utils/reorderPredictor';
import { products } from '@/data/products';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTimeBasedTip(hour: number): string {
  if (hour < 10) return '🌅 Morning orders get priority delivery slots!';
  if (hour < 14) return '☀️ Lunch rush — order now for 2-4 PM delivery';
  if (hour < 18) return '🌇 Evening slots filling up — lock yours in!';
  return '🌙 Late orders deliver tomorrow morning';
}

const staggerDelay = (i: number) => ({ animationDelay: `${i * 0.08}s` });

export default function DashboardPage() {
  const router = useRouter();
  const { balance, nextMilestone, redeemOptions, transactions, redeemCoins, streak } = useCoins();
  const { activeCartId, activeCart, commonCarts, savedTemplates, deleteTemplate, loadTemplate, totalPrice, totalItems } = useCart();
  const { history } = useOrder();
  const { members, currentUserId, getMemberById } = useMembers();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'coins' | 'templates'>('overview');

  const currentUser = getMemberById(currentUserId);

  const visibleMemberIds = useMemo(() => {
    const ids = new Set<string>();
    ids.add(currentUserId);
    if (activeCart) {
      activeCart.memberIds.forEach(id => ids.add(id));
    }
    commonCarts.forEach(cart => cart.memberIds.forEach(id => ids.add(id)));
    return ids;
  }, [currentUserId, activeCart, commonCarts]);

  const cartMembers = useMemo(() => members.filter(m => visibleMemberIds.has(m.id)), [members, visibleMemberIds]);

  const monthlyTotal = useMemo(() =>
    history
      .filter(o => new Date(o.date).getMonth() === new Date().getMonth())
      .reduce((s, o) => s + o.totalAmount, 0),
    [history]
  );

  const lastMonthTotal = useMemo(() => {
    const lastMonth = new Date().getMonth() - 1;
    return history
      .filter(o => new Date(o.date).getMonth() === lastMonth)
      .reduce((s, o) => s + o.totalAmount, 0);
  }, [history]);

  const monthlyChange = lastMonthTotal > 0
    ? Math.round(((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100)
    : 0;

  const memberTotals = useMemo(() =>
    cartMembers.reduce((acc, m) => {
      const total = history.reduce((s, o) => {
        const payment = o.memberPayments.find(p => p.memberId === m.id);
        return s + (payment?.amount || 0);
      }, 0);
      acc[m.id] = { name: m.name, avatar: m.avatar, total, color: m.id === 'm1' ? '#FF9900' : m.id === 'm2' ? '#067D62' : '#007185' };
      return acc;
    }, {} as Record<string, { name: string; avatar: string; total: number; color: string }>),
    [cartMembers, history]
  );

  const categoryTotals = useMemo(() =>
    history.reduce((acc, o) => {
      for (const item of o.items) {
        const cat = item.product.category;
        acc[cat] = (acc[cat] || 0) + item.product.price * item.quantity;
      }
      return acc;
    }, {} as Record<string, number>),
    [history]
  );

  const categoryColors: Record<string, string> = {
    'Staples': '#FF9900',
    'Fruits & Vegetables': '#067D62',
    'Dairy': '#007185',
    'Snacks': '#DDE11D',
    'Beverages': '#E040FB',
    'Personal Care': '#FF69B4',
    'Household': '#00BCD4',
  };

  const categoryData = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([label, value]) => ({ label, value, color: categoryColors[label] || '#888' }));

  const memberBarData = Object.values(memberTotals).map(m => ({
    label: m.avatar + ' ' + m.name,
    value: m.total,
    color: m.color,
  }));

  const reorderSummary = useMemo(() => predictReorder(history, products), [history]);

  const aiInsights = useMemo(() => {
    const insights: { icon: string; title: string; subtitle: string }[] = [];

    if (history.length >= 2) {
      const dates = history.map(o => new Date(o.date).getTime()).sort((a, b) => a - b);
      const avgGap = (dates[dates.length - 1] - dates[0]) / (dates.length - 1) / (1000 * 60 * 60 * 24);
      insights.push({
        icon: '📊',
        title: `You order every ${avgGap.toFixed(1)} days on average`,
        subtitle: `Based on ${history.length} past orders`,
      });
    }

    if (categoryData.length > 0) {
      const top = categoryData[0];
      const pct = Math.round((top.value / monthlyTotal) * 100) || 0;
      insights.push({
        icon: '🏷️',
        title: `${top.label} is ${pct}% of your spending`,
        subtitle: `₹${top.value} spent this month`,
      });
    }

    if (streak >= 3) {
      insights.push({
        icon: '🔥',
        title: `${streak}-order streak! Earning 3% bonus coins`,
        subtitle: 'Keep ordering with Amazon Pay to maintain it',
      });
    }

    const topSpender = Object.values(memberTotals).sort((a, b) => b.total - a.total)[0];
    if (topSpender && topSpender.total > 0) {
      insights.push({
        icon: '👥',
        title: `${topSpender.name} contributes most to the cart`,
        subtitle: `₹${topSpender.total} across all orders`,
      });
    }

    insights.push({
      icon: '⏰',
      title: getTimeBasedTip(new Date().getHours()),
      subtitle: 'Based on delivery patterns in your area',
    });

    if (monthlyTotal > 500) {
      const savings = Math.round(monthlyTotal * 0.12);
      insights.push({
        icon: '💡',
        title: `Switch to Amazon brands → save ~₹${savings}/month`,
        subtitle: 'On staples and dairy categories',
      });
    }

    if (activeCart && activeCart.items.length > 0) {
      insights.push({
        icon: '🛒',
        title: `${totalItems} items in cart — ₹${totalPrice}`,
        subtitle: activeCart.type === 'common' ? `${activeCart.memberIds.length} members sharing` : 'Ready to checkout',
      });
    }

    return insights.slice(0, 4);
  }, [history, categoryData, monthlyTotal, streak, memberTotals, activeCart, totalItems, totalPrice]);

  const handleRedeem = (cost: number, label: string) => {
    const success = redeemCoins(cost, label);
    if (success) {
      showToast(`Redeemed ${label}!`, 'success');
    } else {
      showToast(`Need ${cost - balance} more coins for ${label}`, 'warning');
    }
  };

  const quickActions = [
    { icon: '🎙️', label: 'Voice Shop', desc: 'Add items by voice', color: '#FF9900', bg: '#FFF8E8', onClick: () => router.push('/voice-cart') },
    { icon: '🛒', label: 'My Cart', desc: `${totalItems} items · ₹${totalPrice}`, color: '#007185', bg: '#F0F7FA', onClick: () => router.push('/voice-cart') },
    { icon: '👥', label: 'Members', desc: `${cartMembers.length} in cart`, color: '#067D62', bg: '#F0FFF4', onClick: () => router.push('/members') },
    { icon: history.length > 0 ? '📦' : '🛍️', label: history.length > 0 ? 'Orders' : 'Browse', desc: history.length > 0 ? `${history.length} past orders` : 'Explore products', color: '#B12704', bg: '#FFF5F5', onClick: () => router.push(history.length > 0 ? '/orders' : '/') },
  ];

  return (
    <div className="page-content" style={{ paddingTop: 12, paddingBottom: 80 }}>
      {/* Hero Greeting */}
      <div className="animate-fadeIn" style={{
        background: 'linear-gradient(135deg, #232F3E 0%, #2E3F53 100%)',
        borderRadius: 16,
        padding: '20px',
        marginBottom: 16,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,153,0,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,153,0,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>{currentUser?.avatar || '👤'}</span>
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                {getGreeting()}, <strong>{currentUser?.name || 'there'}</strong>
              </p>
              <h1 style={{ fontSize: 18, fontWeight: 700 }}>
                Your Shopping Dashboard
              </h1>
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12,
            background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 8px',
          }}>
            {[
              { label: 'Month Spend', value: `₹${monthlyTotal.toLocaleString()}`, accent: '#FF9900', change: monthlyChange !== 0 ? `${monthlyChange > 0 ? '↑' : '↓'} ${Math.abs(monthlyChange)}%` : null },
              { label: 'Orders', value: `${history.length}`, accent: '#fff' },
              { label: 'Streak', value: `🔥 ${streak}`, accent: '#fff' },
              { label: 'Coins', value: `🪙 ${balance.toLocaleString()}`, accent: '#FFD700' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{stat.label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: stat.accent, lineHeight: 1.2 }}>{stat.value}</p>
                {stat.change && <p style={{ fontSize: 9, color: monthlyChange > 0 ? '#FF6B6B' : '#67CB33' }}>{stat.change}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {quickActions.map((action, i) => (
          <button key={i} onClick={action.onClick}
            className="animate-fadeInUp"
            style={{
              ...staggerDelay(i),
              background: action.bg, border: `1px solid ${action.color}22`,
              borderRadius: 14, padding: '12px 6px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              transition: 'all 0.25s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <span style={{ fontSize: 24 }}>{action.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amazon-text)' }}>{action.label}</span>
            <span style={{ fontSize: 9, color: 'var(--amazon-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{action.desc}</span>
          </button>
        ))}
      </div>

      {/* Active Cart Summary */}
      {activeCart && (
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s', marginBottom: 16 }}>
          <div className="content-section" style={{
            padding: '16px', cursor: 'pointer',
            border: '1px solid #f0c14b', background: '#fffbf0',
          }} onClick={() => router.push('/voice-cart')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{activeCart.type === 'common' ? '🏠' : '🛒'}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--amazon-text)' }}>{activeCart.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                    {activeCart.splitMode} split · Code: {activeCart.code || 'N/A'}
                  </p>
                </div>
              </div>
              <span style={{ background: 'var(--amazon-orange)', color: '#111', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}>
                Open ▶
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)' }}>
                  <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''}
                </p>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--amazon-price)' }}>₹{totalPrice.toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {cartMembers.filter(m => activeCart.memberIds.includes(m.id)).map(m => (
                  <div key={m.id} title={m.name} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>{m.avatar}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Cart State */}
      {!activeCart && commonCarts.length === 0 && (
        <div className="animate-fadeInUp content-section" style={{ textAlign: 'center', padding: '28px 16px', marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>🛒</span>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--amazon-text)', marginTop: 8 }}>Ready to shop for groceries?</p>
          <p style={{ fontSize: 12, color: 'var(--amazon-text-muted)', marginTop: 4, maxWidth: 280, margin: '4px auto 0' }}>
            Start your shopping cart and add items with your voice
          </p>
          <button className="btn btn-primary btn-lg mt-16" onClick={() => router.push('/voice-cart')}>
            🎙️ Start Voice Shopping
          </button>
        </div>
      )}

      {/* Reorder Predictions — Grocery urgency */}
      {reorderSummary.predictions.length > 0 && (
        <div className="animate-fadeInUp content-section" style={{ marginBottom: 16, animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>🔄 Time to Restock</h3>
            <span className="badge badge-warning">{reorderSummary.predictions.length} items</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reorderSummary.predictions.slice(0, 4).map((p, i) => {
              const urgencyColor = p.urgency === 'high' ? '#d32f2f' : p.urgency === 'medium' ? '#f57c00' : '#388e3c';
              return (
                <div key={p.product.id} className="amazon-card animate-fadeInRight" style={{
                  ...staggerDelay(i),
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderLeft: `3px solid ${urgencyColor}`,
                }}>
                  <span style={{ fontSize: 24 }}>{p.product.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.product.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>
                      Last ordered {p.daysSinceLastOrder >= 1 ? `${p.daysSinceLastOrder.toFixed(0)} days ago` : 'today'} · Usually every {p.avgIntervalDays} days
                    </p>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    color: urgencyColor, whiteSpace: 'nowrap',
                    background: `${urgencyColor}12`, padding: '2px 8px', borderRadius: 4,
                  }}>
                    {p.urgency === 'high' ? 'Urgent' : p.urgency === 'medium' ? 'Soon' : 'Low'}
                  </span>
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary btn-sm mt-8 w-full" onClick={() => router.push('/voice-cart')}>
            ➕ Add Restock Items to Cart
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab ${activeTab === 'coins' ? 'active' : ''}`} onClick={() => setActiveTab('coins')}>
          🪙 Coins & Rewards
        </button>
        <button className={`tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
          📋 Templates
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          {/* Smart Insights */}
          <div className="content-section" style={{
            marginBottom: 16,
            border: '1px solid rgba(255,153,0,0.15)',
            background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF8E8 100%)',
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🤖</span> Smart Grocery Insights
              <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--amazon-text-muted)', marginLeft: 'auto' }}>
                Updated now
              </span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
              {aiInsights.map((insight, i) => (
                <div key={i} className="animate-fadeIn" style={{
                  ...staggerDelay(i),
                  display: 'flex', gap: 10, alignItems: 'flex-start', padding: 10,
                  background: 'rgba(255,255,255,0.7)', borderRadius: 10,
                  border: '1px solid rgba(0,0,0,0.04)',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{insight.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--amazon-text)', lineHeight: 1.3 }}>
                      {insight.title}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)', marginTop: 1 }}>
                      {insight.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Side by Side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div className="content-section" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>👥 Spending by Member</h3>
              {memberBarData.some(d => d.value > 0) ? (
                <BarChart data={memberBarData} height={140} />
              ) : (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--amazon-text-muted)' }}>
                  <span style={{ fontSize: 32 }}>📊</span>
                  <p style={{ fontSize: 12, marginTop: 6 }}>Place orders to see member breakdown</p>
                </div>
              )}
            </div>
            <div className="content-section" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🏷️ Category Breakdown</h3>
              {categoryData.length > 0 ? (
                <DonutChart data={categoryData} />
              ) : (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--amazon-text-muted)' }}>
                  <span style={{ fontSize: 32 }}>🍩</span>
                  <p style={{ fontSize: 12, marginTop: 6 }}>Category data appears after your first order</p>
                </div>
              )}
            </div>
          </div>

          {/* Other Carts */}
          {commonCarts.filter(cc => cc.id !== activeCartId).length > 0 && (
            <div className="content-section" style={{ marginBottom: 16, padding: 14 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🏠 Other Common Carts</h3>
              {commonCarts.filter(cc => cc.id !== activeCartId).map(cc => (
                <div key={cc.id} className="amazon-card" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', marginBottom: 6, cursor: 'pointer',
                }} onClick={() => { router.push('/voice-cart'); }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>🏠</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-text)' }}>{cc.name}</p>
                      <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>
                        {cc.items.length} items · Code: {cc.code}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>{cc.memberIds.length} members</span>
                    <span style={{ fontSize: 12, color: 'var(--amazon-orange)' }}>▶</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Orders */}
          {history.length > 0 && (
            <div className="content-section" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>📦 Recent Orders</h3>
                <button className="btn btn-link btn-sm" onClick={() => router.push('/orders')}>View All</button>
              </div>
              {history.slice(0, 3).map((order, i) => (
                <div key={order.id} className="amazon-card animate-fadeInRight" style={{
                  ...staggerDelay(i),
                  marginBottom: 6, padding: '10px 12px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--amazon-text)' }}>
                      {order.items.reduce((s, it) => s + it.quantity, 0)} items · {order.splitMode} split
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--amazon-price)' }}>₹{order.totalAmount}</p>
                    <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coins Tab */}
      {activeTab === 'coins' && (
        <div className="animate-fadeIn">
          <div className="content-section" style={{
            marginBottom: 16,
            background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF3D4 100%)',
            border: '1px solid #f0c14b',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--amazon-text-secondary)', marginBottom: 2 }}>🪙 Amazon Coins Balance</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--amazon-orange)', lineHeight: 1 }}>{balance.toLocaleString()}</p>
                {streak >= 3 && (
                  <p style={{ fontSize: 10, color: 'var(--amazon-success)', marginTop: 3 }}>
                    🔥 {streak}-order streak active! +3% bonus on every order
                  </p>
                )}
              </div>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700, #FF9900)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, boxShadow: '0 4px 12px rgba(255,153,0,0.3)',
              }}>
                🪙
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--amazon-text-secondary)' }}>Next: {nextMilestone.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amazon-orange)' }}>
                  {Math.round(nextMilestone.progress * 100)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: 8, background: 'rgba(0,0,0,0.06)' }}>
                <div className="progress-fill" style={{
                  width: `${nextMilestone.progress * 100}%`,
                  background: 'linear-gradient(90deg, #FF9900, #FFD700)',
                  borderRadius: 4,
                }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)', marginTop: 3 }}>
                {nextMilestone.remaining > 0
                  ? `${nextMilestone.remaining.toLocaleString()} more coins needed`
                  : '🎉 All rewards unlocked!'}
              </p>
            </div>

            <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--amazon-text)' }}>Redeem Rewards</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {redeemOptions.map(opt => {
                const canRedeem = balance >= opt.cost;
                return (
                  <button key={opt.label} className={`btn ${canRedeem ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ flexDirection: 'column', padding: '8px 6px', height: 'auto', fontSize: 11 }}
                    onClick={() => handleRedeem(opt.cost, opt.label)}
                    disabled={!canRedeem}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{opt.label}</span>
                    <span style={{ fontSize: 9, marginTop: 1, color: canRedeem ? '#111' : 'var(--amazon-text-muted)' }}>
                      🪙 {opt.cost.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="content-section" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📜 Transaction History</h3>
            {transactions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon" style={{ fontSize: 40 }}>🪙</span>
                <p className="empty-state-title">No transactions yet</p>
                <p className="empty-state-desc">Start shopping to earn coins and unlock rewards!</p>
                <button className="btn btn-primary" onClick={() => router.push('/voice-cart')}>🎙️ Shop Now</button>
              </div>
            ) : (
              <div>
                {transactions.slice(0, 10).map(tx => (
                  <div key={tx.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--amazon-border-light)',
                  }}>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--amazon-text)' }}>{tx.reason}</p>
                      <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: tx.type === 'earned' ? 'var(--amazon-success)' : 'var(--amazon-error)',
                    }}>
                      {tx.type === 'earned' ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="animate-fadeIn">
          <div className="content-section" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>📋 Saved Templates</h3>
              <span className="badge badge-info">{savedTemplates.length} saved</span>
            </div>
            {savedTemplates.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon" style={{ fontSize: 44 }}>📋</span>
                <p className="empty-state-title">No templates saved yet</p>
                <p className="empty-state-desc">
                  Add items to cart and save as a template for one-tap reordering
                </p>
                <button className="btn btn-primary" onClick={() => router.push('/voice-cart')}>
                  🎙️ Start Shopping
                </button>
              </div>
            ) : (
              savedTemplates.map(t => (
                <div key={t.id} style={{ marginBottom: 8 }}>
                  <TemplateCard template={t} onDelete={deleteTemplate} onLoad={loadTemplate} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
