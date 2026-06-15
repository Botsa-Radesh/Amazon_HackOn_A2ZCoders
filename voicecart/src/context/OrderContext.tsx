'use client';
import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { Order, CartItem, Member, SplitMode, MemberPayment, DeliverySlot, SplitRequest } from '@/types';
import { syncOrderToAPI, fetchOrdersFromAPI } from '@/lib/sync';
import { useAuth } from './AuthContext';
import { appConfigApi, splitApi } from '@/lib/api';

function generateSplitId(): string {
  return `spr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface OrderContextType {
  currentOrder: Order | null;
  placeOrder: (items: CartItem[], total: number, splitMode: SplitMode, payments: MemberPayment[], slot: string, coinsEarned: number) => void;
  history: Order[];
  deliverySlots: DeliverySlot[];
  voteSlot: (slotId: string, memberId: string) => void;
  clearCurrentOrder: () => void;
  splitRequests: SplitRequest[];
  addSplitRequest: (req: Omit<SplitRequest, 'id' | 'createdAt'>) => void;
  markSplitPaid: (splitId: string, paymentMethod?: string) => void;
  getPendingSplitsForMember: (memberId: string) => SplitRequest[];
  getSentSplitsForMember: (memberId: string) => SplitRequest[];
}

const defaultSlots: DeliverySlot[] = [
  { id: 's1', time: '7-9 AM', date: 'Tomorrow', votes: ['m1'], isWinner: false },
  { id: 's2', time: '10-12 PM', date: 'Tomorrow', votes: ['m2'], isWinner: false },
  { id: 's3', time: '2-4 PM', date: 'Tomorrow', votes: [], isWinner: false },
  { id: 's4', time: '6-8 PM', date: 'Tomorrow', votes: [], isWinner: false },
];

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('voicecart-order-history');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>(defaultSlots);
  const [splitRequests, setSplitRequests] = useState<SplitRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('voicecart-splits');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const { userId } = useAuth();

  // Persist history and splits to localStorage
  useEffect(() => {
    if (history.length > 0) {
      try { localStorage.setItem('voicecart-order-history', JSON.stringify(history)); } catch {}
    }
  }, [history]);

  useEffect(() => {
    if (splitRequests.length > 0) {
      try { localStorage.setItem('voicecart-splits', JSON.stringify(splitRequests)); } catch {}
    }
  }, [splitRequests]);

  useEffect(() => {
    let uid = userId;
    if (!uid) {
      try {
        const stored = localStorage.getItem('voicecart-auth-user');
        if (stored) {
          const u = JSON.parse(stored);
          uid = u?.id;
        }
      } catch {}
    }
    if (!uid) uid = localStorage.getItem('voicecart-guest-id') || '';

    if (uid) {
      let mounted = true;
      fetchOrdersFromAPI(uid).then((orders: any[]) => {
        if (!mounted) return;
        if (orders && orders.length > 0) {
          orders.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
          setHistory(prev => {
            // Merge: keep local orders + add any from API not already present
            const localIds = new Set(prev.map(o => o.id));
            const newFromApi = orders.filter((o: any) => !localIds.has(o.id));
            const merged = [...prev, ...newFromApi].sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
            return merged;
          });
        }
      }).catch(() => {});

      appConfigApi.get('deliverySlots').then(res => {
        if (!mounted) return;
        if (res.config && res.config.length > 0) {
          setDeliverySlots(res.config);
        }
      }).catch(() => {});

      splitApi.list(uid).then(res => {
        if (!mounted) return;
        if (res.splits && res.splits.length > 0) {
          setSplitRequests(prev => {
            // Merge: keep local splits + add any from API not already present
            const localIds = new Set(prev.map(s => s.id));
            const newFromApi = res.splits.filter((s: any) => !localIds.has(s.id));
            return [...prev, ...newFromApi];
          });
        }
      }).catch(() => {});

      return () => { mounted = false; };
    }
  }, [userId, setHistory]);

  const placeOrder = useCallback((
    items: CartItem[], total: number, splitMode: SplitMode, payments: MemberPayment[], slot: string, coinsEarned: number
  ) => {
    const uid = userId || 'unknown';
    const memberIds = payments.map(p => p.memberId);
    const order: Order = {
      id: `ord-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      totalAmount: total,
      splitMode,
      memberPayments: payments,
      deliverySlot: slot,
      status: 'confirmed',
      coinsEarned,
    };
    setCurrentOrder(order);
    setHistory(prev => [order, ...prev]);
    // Include userId and memberIds so the API can store it for all members
    syncOrderToAPI({ ...order, userId: uid, memberIds }).catch(() => {});

    // Reset all delivery slot votes to 0 for the next order
    setDeliverySlots(prev => {
      const reset = prev.map(s => ({ ...s, votes: [] as string[] }));
      appConfigApi.update('deliverySlots', reset).catch(() => {});
      return reset;
    });
  }, [setCurrentOrder, setHistory, userId]);

  const voteSlot = useCallback((slotId: string, memberId: string) => {
    setDeliverySlots(prev => {
      const next = prev.map(slot => {
        if (slot.id !== slotId) return { ...slot, votes: slot.votes.filter(v => v !== memberId) };
        const hasVoted = slot.votes.includes(memberId);
        return { ...slot, votes: hasVoted ? slot.votes.filter(v => v !== memberId) : [...slot.votes, memberId] };
      });
      appConfigApi.update('deliverySlots', next).catch(() => {});
      return next;
    });
  }, []);

  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, [setCurrentOrder]);

  const addSplitRequest = useCallback((req: Omit<SplitRequest, 'id' | 'createdAt'>) => {
    const split: SplitRequest = {
      ...req,
      id: generateSplitId(),
      createdAt: new Date().toISOString(),
    };
    setSplitRequests(prev => [split, ...prev]);
    splitApi.create(split).catch(() => {});
  }, []);

  const markSplitPaid = useCallback((splitId: string, paymentMethod?: string) => {
    setSplitRequests(prev => prev.map(s =>
      s.id === splitId ? { ...s, status: 'paid' as const, paidAt: new Date().toISOString(), paymentMethod: (paymentMethod || 'cash') as any } : s
    ));
    splitApi.update(splitId, { status: 'paid', paidAt: new Date().toISOString(), paymentMethod: paymentMethod || 'cash' }).catch(() => {});
  }, []);

  const getPendingSplitsForMember = useCallback((memberId: string) => {
    return splitRequests.filter(s => s.fromMemberId === memberId && s.status === 'pending');
  }, [splitRequests]);

  const getSentSplitsForMember = useCallback((memberId: string) => {
    return splitRequests.filter(s => s.toMemberId === memberId);
  }, [splitRequests]);

  const slotsWithWinner = useMemo(() => {
    const max = Math.max(...deliverySlots.map(s => s.votes.length), 0);
    return deliverySlots.map(s => ({ ...s, isWinner: s.votes.length > 0 && s.votes.length === max }));
  }, [deliverySlots]);

  return (
    <OrderContext.Provider value={{
      currentOrder, placeOrder, history, deliverySlots: slotsWithWinner, voteSlot, clearCurrentOrder,
      splitRequests, addSplitRequest, markSplitPaid, getPendingSplitsForMember, getSentSplitsForMember,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
