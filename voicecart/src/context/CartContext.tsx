'use client';
import React, { createContext, useContext, useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { CartItem, Product, Template, Cart, SplitMode } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { products, getProductById } from '@/data/products';
import { defaultTemplates } from '@/data/templates';
import { useAuth } from './AuthContext';
import { syncCartToAPI, syncCartItemToAPI, syncRemoveCartItemToAPI, fetchCartsFromAPI } from '@/lib/sync';
import { cartApi, userPrefsApi } from '@/lib/api';

function generateCartCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generateCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface CartContextType {
  carts: Record<string, Cart>;
  activeCartId: string | null;
  personalCartId: string | null;
  activeCart: Cart | null;
  commonCarts: Cart[];
  isHydrated: boolean;
  setActiveCart: (cartId: string) => void;
  createPersonalCart: (userId: string, userName: string) => Cart;
  createCommonCart: (name: string, creatorId: string, creatorName: string, splitMode: SplitMode, memberIds?: string[]) => Cart;
  joinCommonCart: (code: string, userId: string) => Cart | null;
  joinCommonCartViaApi: (code: string, userId: string) => Promise<Cart | null>;
  leaveCommonCart: (cartId: string, userId: string) => void;
  updateCartSplitMode: (cartId: string, mode: SplitMode) => void;
  updateCartName: (cartId: string, name: string) => void;
  addItem: (product: Product, quantity: number, addedBy: string, isShared?: boolean) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleShared: (itemId: string) => void;
  toggleChecked: (itemId: string) => void;
  clearCart: () => void;
  clearCartAfterCheckout: () => void;
  totalItems: number;
  totalPrice: number;
  getItemsByMember: (memberId: string) => CartItem[];
  getSharedItems: () => CartItem[];
  loadTemplate: (templateId: string) => void;
  savedTemplates: Template[];
  saveTemplate: (name: string, items?: Template['items']) => void;
  setSavedTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  deleteTemplate: (templateId: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

function getCurrentUserId(): string {
  try {
    const stored = localStorage.getItem('voicecart-auth-user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u?.id) return u.id;
    }
  } catch { /* ignore */ }
  const GUEST_KEY = 'voicecart-guest-id';
  let gid = localStorage.getItem(GUEST_KEY);
  if (!gid) {
    gid = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    localStorage.setItem(GUEST_KEY, gid);
  }
  return gid!;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<Record<string, Cart>>({});
  const [activeCartId, setActiveCartId] = useState<string | null>(null);
  const [personalCartId, setPersonalCartId] = useState<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<Template[]>(defaultTemplates);
  const [isHydrated, setIsHydrated] = useState(false);
  const { userId } = useAuth();

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedCarts = localStorage.getItem('voicecart-carts');
      if (storedCarts) setCarts(JSON.parse(storedCarts));
      const storedActiveId = localStorage.getItem('voicecart-activeCartId');
      if (storedActiveId) setActiveCartId(storedActiveId);
      const storedPersonalId = localStorage.getItem('voicecart-personalCartId');
      if (storedPersonalId) setPersonalCartId(storedPersonalId);
    } catch {}
    setIsHydrated(true);
  }, []);

  // Persist cart state to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try { localStorage.setItem('voicecart-carts', JSON.stringify(carts)); } catch {}
  }, [carts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (activeCartId) localStorage.setItem('voicecart-activeCartId', activeCartId);
      else localStorage.removeItem('voicecart-activeCartId');
    } catch {}
  }, [activeCartId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (personalCartId) localStorage.setItem('voicecart-personalCartId', personalCartId);
      else localStorage.removeItem('voicecart-personalCartId');
    } catch {}
  }, [personalCartId, isHydrated]);

  // Fetch carts from API first, then create personal cart only if none exists in DB
  const lastFetchedUid = useRef<string | null>(null);

  useEffect(() => {
    // Wait for auth to hydrate — don't run with guest IDs
    if (!userId) return;
    const uid = userId;
    
    // Skip if we already fetched for this exact userId
    if (lastFetchedUid.current === uid) return;
    lastFetchedUid.current = uid;
    
    fetchCartsFromAPI(uid).then(fetchedCarts => {
      if (fetchedCarts && fetchedCarts.length > 0) {
        setCarts(prev => {
          const merged: Record<string, Cart> = { ...prev };
          fetchedCarts.forEach((c: any) => {
            const existing = merged[c.id];
            if (existing) {
              // Keep local items if we have them (they're more up-to-date)
              // Only update metadata from API (memberIds, checkedOut, etc.)
              merged[c.id] = {
                ...existing,
                memberIds: c.memberIds || existing.memberIds,
                checkedOut: c.checkedOut,
                checkedOutBy: c.checkedOutBy,
                checkedOutAt: c.checkedOutAt,
                name: c.name || existing.name,
                splitMode: c.splitMode || existing.splitMode,
                items: existing.items.length > 0 ? existing.items : (c.items || []),
              };
            } else {
              // New cart from API that we don't have locally
              merged[c.id] = { ...c, items: c.items || [], isActive: true };
            }
          });
          return merged;
        });

        // Find existing personal cart from DB
        const personal = fetchedCarts.find((c: any) => c.type === 'personal' && c.memberIds?.includes(uid));
        if (personal) {
          setPersonalCartId(prev => prev || personal.id);
          // Only set active cart if none was restored from localStorage
          setActiveCartId(prev => prev || personal.id);
        } else {
          // No personal cart in DB, create one
          createLocalPersonalCart(uid);
        }

        // Also set active to common cart if one exists and nothing else is active
        const common = fetchedCarts.find((c: any) => c.type === 'common');
        if (common && !personal) {
          setActiveCartId(prev => prev || common.id);
        }
      } else {
        // No carts in DB at all, create a personal cart
        createLocalPersonalCart(uid);
      }
    }).catch(() => {
      // API failed, create local cart as fallback
      if (!personalCartId) createLocalPersonalCart(uid);
    });

    userPrefsApi.get(uid).then(res => {
      if (res.prefs) {
        if (res.prefs.savedTemplates) setSavedTemplates(res.prefs.savedTemplates);
      }
    }).catch(() => {});

    function createLocalPersonalCart(uid: string) {
      const cart: Cart = {
        id: generateCartId(),
        code: '',
        name: 'My Cart',
        type: 'personal',
        splitMode: 'auto',
        createdBy: uid,
        memberIds: [uid],
        items: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCarts(prev => ({ ...prev, [cart.id]: cart }));
      setPersonalCartId(cart.id);
      setActiveCartId(cart.id);
      syncCartToAPI(cart).catch(() => {});
    }
  }, [userId]);

  // Poll for cart updates every 30 seconds (detects when another member checks out)
  // Only update checkedOut status and memberIds — never overwrite local items
  useEffect(() => {
    if (!userId) return;
    const uid = userId;
    const interval = setInterval(() => {
      fetchCartsFromAPI(uid).then(fetchedCarts => {
        if (fetchedCarts && fetchedCarts.length > 0) {
          setCarts(prev => {
            const next = { ...prev };
            fetchedCarts.forEach((c: any) => {
              const existing = next[c.id];
              if (existing) {
                // Only update metadata (checkedOut, memberIds) — keep local items intact
                next[c.id] = {
                  ...existing,
                  checkedOut: c.checkedOut,
                  checkedOutBy: c.checkedOutBy,
                  checkedOutAt: c.checkedOutAt,
                  memberIds: c.memberIds || existing.memberIds,
                };
              } else {
                // New cart we don't have locally — add it fully
                next[c.id] = { ...c, items: c.items || [], isActive: true };
              }
            });
            return next;
          });
        }
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const activeCart = useMemo(() => {
    if (!activeCartId || !carts[activeCartId]) return null;
    return carts[activeCartId];
  }, [carts, activeCartId]);

  const commonCarts = useMemo(() => {
    const uid = userId || getCurrentUserId();
    return Object.values(carts).filter(c => c.type === 'common' && c.memberIds.includes(uid));
  }, [carts, userId]);

  const setActiveCart = useCallback((cartId: string) => {
    setActiveCartId(cartId);
    const uid = userId || getCurrentUserId();
    userPrefsApi.update(uid, { activeCartId: cartId }).catch(() => {});
  }, [userId]);

  const createPersonalCart = useCallback((userId: string, userName: string): Cart => {
    const existing = personalCartId && carts[personalCartId];
    if (existing) return existing;

    const cart: Cart = {
      id: generateCartId(),
      code: '',
      name: `${userName}'s Cart`,
      type: 'personal',
      splitMode: 'auto',
      createdBy: userId,
      memberIds: [userId],
      items: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setCarts(prev => ({ ...prev, [cart.id]: cart }));
    setPersonalCartId(cart.id);
    setActiveCartId(cart.id);
    const uid = userId || getCurrentUserId();
    userPrefsApi.update(uid, { personalCartId: cart.id, activeCartId: cart.id }).catch(() => {});
    syncCartToAPI(cart).catch(() => {});
    return cart;
  }, [carts, personalCartId, userId]);

  const createCommonCart = useCallback((
    name: string,
    creatorId: string,
    creatorName: string,
    splitMode: SplitMode,
    memberIds?: string[]
  ): Cart => {
    const cart: Cart = {
      id: generateCartId(),
      code: generateCartCode(),
      name,
      type: 'common',
      splitMode,
      createdBy: creatorId,
      memberIds: memberIds || [creatorId],
      items: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setCarts(prev => ({ ...prev, [cart.id]: cart }));
    setActiveCartId(cart.id);
    syncCartToAPI(cart).catch(() => {});
    return cart;
  }, [setCarts, setActiveCartId]);

  const joinCommonCart = useCallback((code: string, userId: string): Cart | null => {
    const upperCode = code.toUpperCase();
    const found = Object.values(carts).find(c => c.type === 'common' && c.code.toUpperCase() === upperCode);
    if (!found) return null;
    if (found.memberIds.includes(userId)) {
      setActiveCartId(found.id);
      return found;
    }
    const updated: Cart = {
      ...found,
      memberIds: [...found.memberIds, userId],
    };
    setCarts(prev => ({ ...prev, [found.id]: updated }));
    setActiveCartId(found.id);
    syncCartToAPI(updated).catch(() => {});
    return updated;
  }, [carts, setCarts, setActiveCartId]);

  const joinCommonCartViaApi = useCallback(async (code: string, userId: string): Promise<Cart | null> => {
    try {
      const result = await cartApi.join(code, userId, '');
      if (result.cart) {
        const apiCart: Cart = {
          id: result.cart.id,
          code: result.cart.code,
          name: result.cart.name || 'Common Cart',
          type: 'common',
          splitMode: result.cart.splitMode || 'auto',
          createdBy: result.cart.createdBy || userId,
          memberIds: result.cart.memberIds || [userId],
          items: result.cart.items || [],
          isActive: true,
          createdAt: result.cart.createdAt || new Date().toISOString(),
        };
        setCarts(prev => {
          if (prev[apiCart.id]) return prev;
          return { ...prev, [apiCart.id]: apiCart };
        });
        setActiveCartId(apiCart.id);
        return apiCart;
      }
    } catch {}
    return null;
  }, [setCarts, setActiveCartId]);

  const leaveCommonCart = useCallback((cartId: string, userId: string) => {
    let updatedCart: Cart | null = null;
    setCarts(prev => {
      const cart = prev[cartId];
      if (!cart) return prev;
      updatedCart = {
        ...cart,
        memberIds: cart.memberIds.filter(id => id !== userId),
      };
      return { ...prev, [cartId]: updatedCart! };
    });
    if (activeCartId === cartId && personalCartId) {
      setActiveCartId(personalCartId);
      const uid = userId || getCurrentUserId();
      userPrefsApi.update(uid, { activeCartId: personalCartId }).catch(() => {});
    }
    if (updatedCart) syncCartToAPI(updatedCart).catch(() => {});
  }, [activeCartId, personalCartId, userId]);

  const updateCartSplitMode = useCallback((cartId: string, mode: SplitMode) => {
    setCarts(prev => {
      const cart = prev[cartId];
      if (!cart) return prev;
      return { ...prev, [cartId]: { ...cart, splitMode: mode } };
    });
    syncCartToAPI({ id: cartId, splitMode: mode } as Cart).catch(() => {});
  }, [setCarts]);

  const updateCartName = useCallback((cartId: string, name: string) => {
    setCarts(prev => {
      const cart = prev[cartId];
      if (!cart) return prev;
      return { ...prev, [cartId]: { ...cart, name } };
    });
    syncCartToAPI({ id: cartId, name } as Cart).catch(() => {});
  }, [setCarts]);

  const updateActiveCartItems = useCallback((updater: (items: CartItem[]) => CartItem[]) => {
    if (!activeCartId) return;
    setCarts(prev => {
      const cart = prev[activeCartId];
      if (!cart) return prev;
      return { ...prev, [activeCartId]: { ...cart, items: updater(cart.items) } };
    });
  }, [activeCartId, setCarts]);

  const addItem = useCallback((product: Product, quantity: number, addedBy: string, isShared = false) => {
    let addedItem: CartItem | null = null;
    updateActiveCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.addedBy === addedBy && i.isShared === isShared);
      if (existing) {
        addedItem = { ...existing, quantity: existing.quantity + quantity };
        return prev.map(i => i.id === existing.id ? addedItem! : i);
      }
      const id = `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      addedItem = { id, product, quantity, addedBy, isShared, checked: false };
      return [...prev, addedItem!];
    });
    if (addedItem && activeCartId) {
      syncCartItemToAPI(activeCartId, addedItem).catch(() => {});
    }
  }, [updateActiveCartItems, activeCartId]);

  const removeItem = useCallback((itemId: string) => {
    updateActiveCartItems(prev => prev.filter(i => i.id !== itemId));
    if (activeCartId) {
      syncRemoveCartItemToAPI(activeCartId, itemId).catch(() => {});
    }
  }, [updateActiveCartItems, activeCartId]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(itemId); return; }
    updateActiveCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  }, [updateActiveCartItems, removeItem]);

  const toggleShared = useCallback((itemId: string) => {
    updateActiveCartItems(prev => prev.map(i => i.id === itemId ? { ...i, isShared: !i.isShared } : i));
  }, [updateActiveCartItems]);

  const toggleChecked = useCallback((itemId: string) => {
    updateActiveCartItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i));
  }, [updateActiveCartItems]);

  const clearCart = useCallback(() => {
    updateActiveCartItems(() => []);
  }, [updateActiveCartItems]);

  // Clears items and resets checkedOut, but keeps the cart and all members intact
  const clearCartAfterCheckout = useCallback(() => {
    if (!activeCartId) return;
    setCarts(prev => {
      const cart = prev[activeCartId];
      if (!cart) return prev;
      const updated = { ...cart, items: [], checkedOut: false, checkedOutBy: undefined, checkedOutAt: undefined };
      // Sync the cleared (but alive) cart back to the API
      syncCartToAPI(updated).catch(() => {});
      return { ...prev, [activeCartId]: updated };
    });
  }, [activeCartId, setCarts]);

  const totalItems = useMemo(() => activeCart?.items.reduce((s, i) => s + i.quantity, 0) || 0, [activeCart]);
  const totalPrice = useMemo(() => activeCart?.items.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0, [activeCart]);

  const getItemsByMember = useCallback((memberId: string) => {
    return activeCart?.items.filter(i => i.addedBy === memberId && !i.isShared) || [];
  }, [activeCart]);

  const getSharedItems = useCallback(() => {
    return activeCart?.items.filter(i => i.isShared) || [];
  }, [activeCart]);

  const loadTemplate = useCallback((templateId: string) => {
    const allTemplates = [...defaultTemplates, ...savedTemplates];
    const template = allTemplates.find(t => t.id === templateId);
    if (!template) return;
    const uid = userId || getCurrentUserId();
    updateActiveCartItems(prev => {
      const newItems = [...prev];
      for (const tItem of template.items) {
        const product = getProductById(tItem.productId);
        if (!product) continue;
        const existing = newItems.find(i => i.product.id === product.id);
        if (existing) {
          existing.quantity += tItem.quantity;
        } else {
          newItems.push({
            id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            product,
            quantity: tItem.quantity,
            addedBy: uid,
            isShared: true,
            checked: false,
          });
        }
      }
      return newItems;
    });
  }, [savedTemplates, updateActiveCartItems, userId]);

  const saveTemplateFn = useCallback((name: string, items?: Template['items']) => {
    const templateItems = items || (activeCart ? activeCart.items.map(i => ({ productId: i.product.id, quantity: i.quantity })) : []);
    if (templateItems.length === 0) return;
    const total = templateItems.reduce((s, i) => {
      const p = getProductById(i.productId);
      return s + (p ? p.price * i.quantity : 0);
    }, 0);
    const template: Template = {
      id: `t-${Date.now()}`,
      name,
      items: templateItems,
      totalItems: templateItems.length,
      totalPrice: total,
    };
    setSavedTemplates(prev => {
      const next = [...prev, template];
      const uid = userId || getCurrentUserId();
      userPrefsApi.update(uid, { savedTemplates: next }).catch(() => {});
      return next;
    });
  }, [activeCart, userId]);

  const deleteTemplate = useCallback((templateId: string) => {
    setSavedTemplates(prev => {
      const next = prev.filter(t => t.id !== templateId);
      const uid = userId || getCurrentUserId();
      userPrefsApi.update(uid, { savedTemplates: next }).catch(() => {});
      return next;
    });
  }, [userId]);

  return (
    <CartContext.Provider value={{
      carts, activeCartId, personalCartId, activeCart, commonCarts, isHydrated,
      setActiveCart, createPersonalCart, createCommonCart,
      joinCommonCart, joinCommonCartViaApi, leaveCommonCart,
      updateCartSplitMode, updateCartName,
      addItem, removeItem, updateQuantity, toggleShared, toggleChecked, clearCart, clearCartAfterCheckout,
      totalItems, totalPrice, getItemsByMember, getSharedItems,
      loadTemplate, savedTemplates, saveTemplate: saveTemplateFn, setSavedTemplates, deleteTemplate,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export { generateCartCode, generateCartId };
