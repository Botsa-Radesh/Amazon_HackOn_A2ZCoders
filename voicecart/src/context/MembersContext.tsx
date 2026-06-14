'use client';
import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { Member, Allergen, DietType } from '@/types';
import { useAuth } from './AuthContext';
import { defaultMembers } from '@/data/members';
import { syncMemberToAPI, fetchMembersFromAPI } from '@/lib/sync';
import { memberApi } from '@/lib/api';

const avatars = ['👨‍💻', '👩‍🍳', '👨‍🎓', '👩‍💼', '👨‍🏫', '👩‍🔧', '👨‍🎨', '👩‍🚀', '👨‍⚕️', '👩‍🌾'];
let avatarIndex = 0;
function nextAvatar(): string {
  const a = avatars[avatarIndex % avatars.length];
  avatarIndex++;
  return a;
}

interface MembersContextType {
  members: Member[];
  currentUserId: string;
  updateMember: (memberId: string, updates: Partial<Member>) => void;
  getMemberById: (memberId: string) => Member | undefined;
  addMember: (name: string, avatar?: string) => Member;
  toggleMemberOnline: (memberId: string) => void;
  toggleMemberTyping: (memberId: string) => void;
}

const MembersContext = createContext<MembersContextType | null>(null);

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const { userId, user } = useAuth();
  const currentUserId = useMemo(() => userId || 'guest', [userId]);

  useEffect(() => {
    let mounted = true;
    fetchMembersFromAPI().then(dbMembers => {
      if (!mounted) return;
      if (dbMembers && dbMembers.length > 0) {
        setMembers(dbMembers);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Ensure the logged-in user always exists in the members list with their real name
  useEffect(() => {
    if (!userId || !user?.name) return;
    setMembers(prev => {
      const existing = prev.find(m => m.id === userId);
      if (existing) {
        // Update name if it's still generic
        if (existing.name === 'You' || existing.name === 'Guest' || existing.name !== user.name) {
          return prev.map(m => m.id === userId ? { ...m, name: user.name } : m);
        }
        return prev;
      }
      // User not in members list — add them
      const newMember: Member = {
        id: userId,
        name: user.name,
        avatar: '👤',
        role: 'creator',
        diet: 'non-veg',
        allergies: [],
        favoriteBrands: [],
        dislikes: [],
        isOnline: true,
        isTyping: false,
      };
      syncMemberToAPI(newMember).catch(() => {});
      return [...prev, newMember];
    });
  }, [userId, user?.name]);

  const updateMember = useCallback((memberId: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updates } : m));
    memberApi.update(memberId, updates).catch(() => {});
  }, []);

  const getMemberById = useCallback((memberId: string) => members.find(m => m.id === memberId), [members]);

  const addMember = useCallback((name: string, avatar?: string): Member => {
    const existing = members.find(m => m.name === name);
    if (existing) return existing;
    const member: Member = {
      id: `m${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name,
      avatar: avatar || nextAvatar(),
      role: 'member',
      diet: 'veg',
      allergies: [],
      favoriteBrands: [],
      dislikes: [],
      isOnline: false,
      isTyping: false,
    };
    setMembers(prev => [...prev, member]);
    syncMemberToAPI(member).catch(() => {});
    return member;
  }, [members, setMembers]);

  const toggleMemberOnline = useCallback((memberId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, isOnline: !m.isOnline } : m));
    const m = getMemberById(memberId);
    if (m) memberApi.update(memberId, { isOnline: !m.isOnline }).catch(() => {});
  }, [getMemberById]);

  const toggleMemberTyping = useCallback((memberId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, isTyping: !m.isTyping } : m));
    const m = getMemberById(memberId);
    if (m) memberApi.update(memberId, { isTyping: !m.isTyping }).catch(() => {});
  }, [getMemberById]);

  return (
    <MembersContext.Provider value={{ members, currentUserId, updateMember, getMemberById, addMember, toggleMemberOnline, toggleMemberTyping }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within MembersProvider');
  return ctx;
}
