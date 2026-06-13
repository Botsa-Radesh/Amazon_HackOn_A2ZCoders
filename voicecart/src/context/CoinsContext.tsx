'use client';
import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { CoinTransaction } from '@/types';
import { useAuth } from './AuthContext';
import { getNextMilestone, getRedeemOptions } from '@/utils/coinsCalculator';
import { syncCoinsToAPI } from '@/lib/sync';
import { coinApi, userPrefsApi } from '@/lib/api';

interface CoinsContextType {
  balance: number;
  transactions: CoinTransaction[];
  addCoins: (amount: number, reason: string) => void;
  redeemCoins: (cost: number, label: string) => boolean;
  nextMilestone: { label: string; remaining: number; progress: number };
  redeemOptions: { label: string; cost: number }[];
  streak: number;
  incrementStreak: () => void;
}

const CoinsContext = createContext<CoinsContextType | null>(null);

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(1247);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [streak, setStreak] = useState<number>(3);
  const { userId } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (userId) {
      coinApi.get(userId).then(res => {
        if (!mounted) return;
        if (res.balance !== undefined) setBalance(res.balance);
        if (res.transactions && res.transactions.length > 0) setTransactions(res.transactions);
      }).catch(() => {});

      userPrefsApi.get(userId).then(res => {
        if (!mounted) return;
        if (res.prefs?.streak !== undefined) setStreak(res.prefs.streak);
      }).catch(() => {});
    }
    return () => { mounted = false; };
  }, [userId]);

  const addCoins = useCallback((amount: number, reason: string) => {
    setBalance(prev => prev + amount);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      amount,
      type: 'earned',
      reason,
      date: new Date().toISOString(),
    }, ...prev]);
    if (userId) syncCoinsToAPI(userId, amount, reason).catch(() => {});
  }, [setBalance, setTransactions, userId]);

  const redeemCoins = useCallback((cost: number, label: string): boolean => {
    if (balance < cost) return false;
    setBalance(prev => prev - cost);
    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      amount: -cost,
      type: 'redeemed',
      reason: label,
      date: new Date().toISOString(),
    }, ...prev]);
    if (userId) syncCoinsToAPI(userId, -cost, `Redeemed: ${label}`).catch(() => {});
    return true;
  }, [balance, setBalance, setTransactions, userId]);

  const incrementStreak = useCallback(() => {
    setStreak(prev => {
      const next = prev + 1;
      if (userId) userPrefsApi.update(userId, { streak: next }).catch(() => {});
      return next;
    });
  }, [userId]);

  const nextMilestone = useMemo(() => getNextMilestone(balance), [balance]);
  const redeemOptions = useMemo(() => getRedeemOptions(), []);

  return (
    <CoinsContext.Provider value={{ balance, transactions, addCoins, redeemCoins, nextMilestone, redeemOptions, streak, incrementStreak }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error('useCoins must be used within CoinsProvider');
  return ctx;
}
