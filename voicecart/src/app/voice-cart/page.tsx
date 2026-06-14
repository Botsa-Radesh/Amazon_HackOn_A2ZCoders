'use client';
import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useMembers } from '@/context/MembersContext';
import { useCommonCart } from '@/context/CommonCartContext';
import { useToast } from '@/components/NotificationToast';
import { MicrophoneButton } from '@/components/MicrophoneButton';
import { VoiceTranscript } from '@/components/VoiceTranscript';
import { CartItemRow } from '@/components/CartItem';
import { MemberAvatar } from '@/components/MemberAvatar';
import { RecipeModal } from '@/components/RecipeModal';
import { AllergyWarningModal } from '@/components/AllergyWarning';
import { BudgetBar } from '@/components/BudgetBar';
import { AIStatusBadge } from '@/components/AIStatusBadge';
import { StickyCheckoutBar } from '@/components/StickyCheckoutBar';
import { useVoice } from '@/hooks/useVoice';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { parseVoiceCommand } from '@/utils/voiceParser';
import { matchLLMItemsToProducts, analyzeCart, CartAnalysis } from '@/utils/llmService';
import { optimizeCartForBudget } from '@/utils/budgetOptimizer';
import { findSubstitution } from '@/utils/substitutionEngine';
import { checkAllergies } from '@/utils/allergyChecker';
import { searchProducts, products } from '@/data/products';
import { recipes, getRecipeById } from '@/data/recipes';
import { Recipe, Cart, SplitMode, CartItem } from '@/types';
import { AllergyWarning as AllergyWarningType } from '@/utils/allergyChecker';
import { predictReorder, ReorderSummary } from '@/utils/reorderPredictor';
import { ReorderPopup } from '@/components/ReorderPopup';
import { useOrder } from '@/context/OrderContext';

type PageMode = 'voice' | 'recipe' | 'budget' | 'normal';

function VoiceCartPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    carts, activeCartId, personalCartId, activeCart, commonCarts,
    setActiveCart, createPersonalCart, joinCommonCart,
    updateCartSplitMode, updateCartName,
    addItem, removeItem, updateQuantity, toggleShared, clearCart, clearCartAfterCheckout, leaveCommonCart,
    totalItems, totalPrice, getItemsByMember, getSharedItems,
  } = useCart();
  const { members, currentUserId, getMemberById } = useMembers();
  const { pendingInvites, joinCommonCartByCode } = useCommonCart();
  const { showToast } = useToast();
  const { isSupported, isListening, transcript, interimTranscript, startListening, stopListening } = useVoice();
  const { speak } = useSpeechSynthesis();
  const { history } = useOrder();

  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [mode, setMode] = useState<PageMode>('normal');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [allergyWarning, setAllergyWarning] = useState<AllergyWarningType | null>(null);
  const [budgetMode, setBudgetMode] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(500);
  const [highlightMember, setHighlightMember] = useState<string | null>(null);
  const [showCartSelector, setShowCartSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingCartName, setEditingCartName] = useState(false);
  const [cartNameInput, setCartNameInput] = useState('');
  const [showCodeCopied, setShowCodeCopied] = useState(false);
  const [cartAnalysis, setCartAnalysis] = useState<CartAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reorderSummary, setReorderSummary] = useState<ReorderSummary | null>(null);
  const [dismissedReorder, setDismissedReorder] = useState(false);
  const [voiceCheckoutPending, setVoiceCheckoutPending] = useState(false);
  const [voiceCheckoutProcessing, setVoiceCheckoutProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // Ensure personal cart exists
  useEffect(() => {
    if (!activeCartId && !personalCartId) {
      createPersonalCart(currentUserId, getMemberById(currentUserId)?.name || 'User');
    } else if (!activeCartId && personalCartId) {
      setActiveCart(personalCartId);
    }
  }, [activeCartId, personalCartId, createPersonalCart, currentUserId, getMemberById, setActiveCart]);

  useEffect(() => {
    const budget = searchParams.get('budget');
    if (budget) {
      setBudgetMode(true);
      setBudgetAmount(Number(budget));
      setMode('budget');
      handleBudgetCart(Number(budget));
    }
  }, [searchParams]);

  // Reorder prediction based on history
  useEffect(() => {
    if (dismissedReorder || history.length < 2) return;
    const result = predictReorder(history, products);
    if (result.predictions.length > 0) {
      setReorderSummary(result);
    }
  }, [history, dismissedReorder]);

  const handleBatchAdd = useCallback(async (productsToAdd: { productId: string; quantity: number }[]) => {
    for (const { productId, quantity } of productsToAdd) {
      const product = products.find(p => p.id === productId);
      if (!product) continue;
      if (product.stockStatus === 'out_of_stock') {
        const sub = findSubstitution(product);
        if (sub) {
          addItem(sub.suggested, 1, currentUserId, true);
          showToast(`${product.name} out of stock! Added ${sub.suggested.name} instead`, 'warning');
          speak(`${sub.suggested.name} added as substitute`);
        }
      } else {
        addItem(product, quantity, currentUserId, false);
        const warning = checkAllergies(product, members, products);
        if (warning) {
          setTimeout(() => setAllergyWarning(warning), 500);
        }
      }
    }
  }, [addItem, currentUserId, members, showToast, speak]);

  const handleVoiceCommand = useCallback(async (text: string) => {
    setMicStatus('processing');
    setIsAiTyping(true);

    await new Promise(r => setTimeout(r, 600));

    const command = await parseVoiceCommand(text);
    setAiResponse(command.response);
    setIsAiTyping(false);
    setRecentCommands(prev => [text, ...prev].slice(0, 5));

    // Require active cart for item-related intents
    const needsCart = ['ADD_ITEM', 'ADD_BATCH', 'RECIPE_ADD', 'RECIPE', 'BUDGET', 'REMOVE_ITEM', 'MARK_SHARED'];
    if (needsCart.includes(command.intent) && !activeCart) {
      showToast('Select a cart first before adding items!', 'warning');
      speak('Please select a cart first by tapping the cart name at the top.');
      setMicStatus('idle');
      return;
    }

    switch (command.intent) {
      case 'ADD_BATCH': {
        if (command.items && command.items.length > 0) {
          const matched = matchLLMItemsToProducts(command.items);
          const toAdd = matched
            .filter(m => m.matchedProduct)
            .map(m => ({ productId: m.matchedProduct!.id, quantity: m.quantity }));

          if (toAdd.length > 0) {
            await handleBatchAdd(toAdd);
            const names = toAdd.map(t => {
              const p = products.find(pr => pr.id === t.productId);
              return `${t.quantity} ${p?.name || ''}`;
            }).join(', ');
            showToast(`Added ${names}`, 'success');
            speak(command.response);
          } else {
            const fallback = products.find(p => p.id === command.params.productId);
            if (fallback) {
              addItem(fallback, parseInt(command.params.quantity) || 1, currentUserId, false);
              showToast(`Added ${fallback.name}`, 'success');
              speak(`Added ${fallback.name} to cart!`);
            } else {
              speak("I didn't recognize those items. Try again!");
            }
          }
        }
        break;
      }
      case 'ADD_ITEM': {
        const product = products.find(p => p.id === command.params.productId);
        if (product) {
          if (product.stockStatus === 'out_of_stock') {
            const sub = findSubstitution(product);
            if (sub) {
              addItem(sub.suggested, 1, currentUserId, true);
              showToast(`${product.name} out of stock! Added ${sub.suggested.name} instead`, 'warning');
              speak(`${sub.suggested.name} added as substitute`);
            }
          } else {
            const qty = parseInt(command.params.quantity) || 1;
            addItem(product, qty, currentUserId, false);
            showToast(`Added ${qty} ${product.name}`, 'success');
            speak(command.response);
            const warning = checkAllergies(product, members, products);
            if (warning) {
              setTimeout(() => setAllergyWarning(warning), 500);
            }
          }
        }
        break;
      }
      case 'SWITCH_CART': {
        const target = command.params.target;
        if (target === 'common' && commonCarts.length > 0) {
          setActiveCart(commonCarts[0].id);
          speak('Switched to common cart!');
        } else if (personalCartId) {
          setActiveCart(personalCartId);
          speak('Switched to your personal cart!');
        }
        break;
      }
      case 'SHOW_CODE': {
        if (activeCart && activeCart.type === 'common') {
          setShowCodeCopied(true);
          navigator.clipboard.writeText(activeCart.code);
          showToast(`Cart code: ${activeCart.code}`, 'info');
          speak(`Your cart code is ${activeCart.code}`);
          setTimeout(() => setShowCodeCopied(false), 2000);
        } else {
          speak('Personal carts do not have a share code.');
          showToast('Personal carts do not have a share code.', 'info');
        }
        break;
      }
      case 'CREATE_COMMON': {
        router.push(`/common-cart?name=${encodeURIComponent(command.params.name || 'Common Cart')}`);
        break;
      }
      case 'JOIN_CART': {
        if (command.params.code) {
          const joined = await joinCommonCartByCode(command.params.code, currentUserId);
          if (joined) {
            showToast('Joined common cart!', 'success');
            speak('Joined common cart!');
          } else {
            showToast('Cart not found!', 'error');
            speak('Cart not found. Try a different code.');
          }
        }
        break;
      }
      case 'REMOVE_ITEM': {
        const actCart = activeCart;
        if (!actCart) break;
        // #7 Fix: Handle "clear all" with confirmation
        if (command.params.productId === '__CLEAR_ALL__') {
          clearCart();
          showToast('Cart cleared!', 'success');
          speak('Cart cleared!');
          break;
        }
        const toRemove = actCart.items.find(i => i.product.id === command.params.productId);
        if (toRemove) removeItem(toRemove.id);
        showToast(command.response, 'success');
        speak(command.response);
        break;
      }
      case 'RECIPE_ADD': {
        const recipe = getRecipeById(command.params.recipeId);
        if (recipe) {
          const servings = parseInt(command.params.servings) || recipe.servings;
          const scale = servings / recipe.servings;
          const scaledIngredients = recipe.ingredients.map(ing => ({
            productId: ing.mappedProductId,
            quantity: Math.max(1, Math.round(scale)),
          }));
          await handleBatchAdd(scaledIngredients);
          showToast(`Added all ingredients for ${recipe.name} (${servings} servings)!`, 'success');
          speak(`Added all ${recipe.ingredients.length} ingredients for ${recipe.name} to your cart!`);
        }
        break;
      }
      case 'RECIPE': {
        const recipe = getRecipeById(command.params.recipeId);
        if (recipe) {
          const servings = parseInt(command.params.servings) || recipe.servings;
          setSelectedRecipe({ ...recipe, servings });
          setMode('recipe');
          speak(command.response);
        }
        break;
      }
      case 'BUDGET': {
        const amount = parseInt(command.params.amount) || 500;
        setBudgetAmount(amount);
        setBudgetMode(true);
        setMode('budget');
        handleBudgetCart(amount);
        speak(command.response);
        break;
      }
      case 'TEMPLATE': {
        showToast(command.response, 'success');
        speak(command.response);
        break;
      }
      case 'SUMMARY': {
        if (!activeCart) break;
        const summary = activeCart.items.map(i => `${i.quantity} ${i.product.name}`).join(', ');
        speak(`Your cart has ${totalItems} items: ${summary || 'nothing yet'}`);
        break;
      }
      case 'MARK_SHARED': {
        if (!activeCart) break;
        const item = activeCart.items.find(i => i.product.id === command.params.productId);
        if (item) toggleShared(item.id);
        speak(command.response);
        break;
      }
      case 'HIGHLIGHT': {
        setHighlightMember(command.params.memberId);
        const member = getMemberById(command.params.memberId);
        speak(`Here's what ${member?.name || 'they'} added`);
        setTimeout(() => setHighlightMember(null), 3000);
        break;
      }
      case 'CHECKOUT': {
        router.push('/checkout');
        break;
      }
      case 'VOICE_CHECKOUT': {
        if (!activeCart || totalItems === 0) {
          speak('Your cart is empty. Add some items first!');
          showToast('Cart is empty!', 'warning');
          break;
        }
        // Announce total and ask for confirmation
        const itemCount = totalItems;
        const cartTotal = totalPrice;
        speak(`Your total is ${cartTotal} rupees for ${itemCount} items. Delivery in 10 minutes. Say confirm to pay with Amazon Pay.`);
        setAiResponse(`🛒 Total: ₹${cartTotal} (${itemCount} items)\n🚚 Express: 10 min delivery\n💰 Amazon Pay\n\n🎤 Say "confirm" to place order`);
        setVoiceCheckoutPending(true);
        showToast('Say "confirm" to place order', 'info');
        break;
      }
      case 'CONFIRM_ORDER': {
        if (!voiceCheckoutPending) {
          speak('Say checkout now first, then confirm to place your order.');
          break;
        }
        if (!activeCart || totalItems === 0) {
          speak('Your cart is empty!');
          setVoiceCheckoutPending(false);
          break;
        }
        // Process the voice checkout
        setVoiceCheckoutPending(false);
        setVoiceCheckoutProcessing(true);
        speak('Processing your payment. Please wait.');
        setAiResponse('⏳ Processing payment via Amazon Pay...');

        try {
          const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartId: activeCart.id,
              userId: currentUserId,
              paymentMethod: 'amazon_pay',
              deliverySlot: 'Express 10-15 min',
              splitMode: activeCart.splitMode || 'auto',
            }),
          });
          const data = await res.json();

          if (!res.ok) {
            if (data.alreadyCheckedOut) {
              speak('This order was already paid by someone else. Check your splits.');
              setAiResponse('❌ Already paid by another member');
            } else {
              speak('Payment failed. Please try again.');
              setAiResponse('❌ Payment failed. Try again.');
            }
            setVoiceCheckoutProcessing(false);
            break;
          }

          // Success!
          if (data.coinsEarned > 0) {
            speak(`Order placed! You earned ${data.coinsEarned} coins. Delivery in 10 minutes.`);
          } else {
            speak('Order placed successfully! Delivery in 10 minutes.');
          }
          setAiResponse(`✅ Order placed!\n🪙 +${data.coinsEarned || 0} coins earned\n🚚 Delivering in 10 minutes`);
          clearCart();
          showToast('Order placed! 🎉', 'success');
          setVoiceCheckoutProcessing(false);

          // Redirect after a moment
          setTimeout(() => router.push('/order-confirmation'), 2000);
        } catch {
          speak('Network error. Please check your connection.');
          setAiResponse('❌ Network error');
          setVoiceCheckoutProcessing(false);
        }
        break;
      }
      case 'REORDER': {
        speak('Reordering your essentials!');
        showToast('Essentials added to cart!', 'success');
        break;
      }
      default: {
        if (activeCart) {
          const product = searchProducts(text)[0];
          if (product) {
            addItem(product, 1, currentUserId, false);
            showToast(`Added ${product.name}`, 'success');
            speak(`Added ${product.name} to cart!`);
          } else {
            speak("I didn't quite catch that. Try again!");
          }
        }
      }
    }

    setMicStatus('idle');
  }, [activeCart, addItem, removeItem, toggleShared, showToast, speak, members, currentUserId, totalItems, router, getMemberById, setActiveCart, personalCartId, commonCarts, joinCommonCartByCode, handleBatchAdd]);

  const handleMicToggle = useCallback(() => {
    if (!activeCart) {
      showToast('Select a cart first!', 'warning');
      speak('Please select a cart at the top before using voice.');
      return;
    }
    if (isListening) {
      stopListening();
      // Small delay to let final transcript settle, then process
      setTimeout(() => {
        // Read transcript directly from DOM-accessible state
        setMicStatus('idle');
      }, 100);
    } else {
      startListening();
      setMicStatus('listening');
      setAiResponse('');
    }
  }, [isListening, stopListening, startListening, activeCart, showToast, speak]);

  // When listening stops and we have a transcript, process it
  const wasListeningRef = useRef(false);
  useEffect(() => {
    if (wasListeningRef.current && !isListening) {
      // Listening just stopped — process transcript if we have one
      const textToProcess = transcript;
      if (textToProcess && textToProcess.trim().length > 0) {
        handleVoiceCommand(textToProcess);
      }
    }
    wasListeningRef.current = isListening;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const handleBudgetCart = (amount: number) => {
    if (!activeCart) return;
    const result = optimizeCartForBudget(amount, activeCart.items, currentUserId);
    for (const item of result.items) {
      addItem(item.product, item.quantity, currentUserId, true);
    }
    showToast(`Budget cart under ₹${amount} built!`, 'success');
  };

  const handleAnalyzeCart = useCallback(async () => {
    if (!activeCart || activeCart.items.length === 0) return;
    setIsAnalyzing(true);
    const items = activeCart.items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      category: i.product.category,
      price: i.product.price,
    }));
    const result = await analyzeCart(items);
    if (result) {
      setCartAnalysis(result);
      speak(result.summary);
    } else {
      showToast('Analysis failed. Check your API key.', 'error');
    }
    setIsAnalyzing(false);
  }, [activeCart, showToast, speak]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCart) {
      showToast('Select a cart first!', 'warning');
      return;
    }
    const val = inputRef.current?.value;
    if (val) {
      handleVoiceCommand(val);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleCopyCode = () => {
    if (!activeCart || activeCart.type !== 'common') return;
    navigator.clipboard.writeText(activeCart.code);
    setShowCodeCopied(true);
    showToast('Code copied!', 'success');
    setTimeout(() => setShowCodeCopied(false), 2000);
  };

  const splitModeOptions: SplitMode[] = ['family', 'auto', 'equal', 'custom'];

  const sharedItems = getSharedItems();
  const cartMembers = activeCart ? members.filter(m => activeCart.memberIds.includes(m.id)) : [];
  const memberItemMap = cartMembers.reduce((acc, m) => {
    acc[m.id] = getItemsByMember(m.id);
    return acc;
  }, {} as Record<string, CartItem[]>);

  // Determine active tab from URL param (?tab=group) so it persists on refresh
  const tabParam = searchParams.get('tab');
  const isGroupTab = tabParam === 'group';
  const isPersonalActive = !isGroupTab;
  const isCommonActive = isGroupTab;

  // On mount, sync activeCartId with the URL tab
  useEffect(() => {
    if (isGroupTab) {
      const alreadyCommon = commonCarts.some(c => c.id === activeCartId);
      if (!alreadyCommon && commonCarts.length > 0) {
        setActiveCart(commonCarts[0].id);
      }
    } else {
      if (personalCartId && activeCartId !== personalCartId) {
        setActiveCart(personalCartId);
      }
    }
  }, [isGroupTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page-content" style={{ paddingTop: 16, paddingBottom: 80 }}>
      {/* Cart Type Tabs — link to different URLs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--amazon-border)' }}>
        <button
          onClick={() => { if (personalCartId) setActiveCart(personalCartId); router.push('/voice-cart'); }}
          style={{
            flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer',
            background: isPersonalActive ? '#fff' : '#f5f5f5',
            borderBottom: isPersonalActive ? '3px solid var(--amazon-orange)' : '3px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: 20 }}>🛒</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: isPersonalActive ? 700 : 500, color: isPersonalActive ? 'var(--amazon-text)' : 'var(--amazon-text-muted)' }}>
              My Cart
            </p>
            <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>
              {personalCartId && carts[personalCartId] ? `${carts[personalCartId].items.length} items` : '0 items'}
            </p>
          </div>
        </button>
        <button
          onClick={() => {
            if (commonCarts.length > 0) {
              setActiveCart(commonCarts[0].id);
            }
            router.push('/voice-cart?tab=group');
          }}
          style={{
            flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer',
            borderLeft: '1px solid var(--amazon-border)',
            background: isCommonActive ? '#fff' : '#f5f5f5',
            borderBottom: isCommonActive ? '3px solid var(--amazon-orange)' : '3px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: 20 }}>👥</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: isCommonActive ? 700 : 500, color: isCommonActive ? 'var(--amazon-text)' : 'var(--amazon-text-muted)' }}>
              Group Cart
            </p>
            <p style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>
              {commonCarts.length > 0 ? `${commonCarts.length} cart${commonCarts.length > 1 ? 's' : ''} · ${commonCarts.reduce((s, c) => s + c.items.length, 0)} items` : 'None yet'}
            </p>
          </div>
        </button>
      </div>

      {/* Common Cart Switcher — show ALL group carts the user is in */}
      {isCommonActive && commonCarts.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--amazon-text)' }}>
              Select a group cart to shop:
            </p>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}
              onClick={() => router.push('/common-cart')}>
              + New
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {commonCarts.map(cc => {
              const isSelected = activeCartId === cc.id;
              const ccMembers = cc.memberIds.map(id => getMemberById(id)).filter(Boolean);
              const ccTotal = cc.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
              return (
                <div key={cc.id}
                  onClick={() => setActiveCart(cc.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                    border: isSelected ? '2px solid var(--amazon-orange)' : '1px solid var(--amazon-border-light)',
                    background: isSelected ? '#fffbf0' : '#fff',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(255,153,0,0.12)' : 'none',
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: isSelected ? '#fff3d4' : '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    🏠
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--amazon-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cc.name}
                      </p>
                      {isSelected && (
                        <span style={{ fontSize: 9, background: 'var(--amazon-orange)', color: '#111', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>ACTIVE</span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginTop: 2 }}>
                      {cc.items.length} items · ₹{ccTotal} · Code: <strong style={{ color: 'var(--amazon-orange)', letterSpacing: 1 }}>{cc.code}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                      {ccMembers.slice(0, 5).map(m => m && (
                        <span key={m.id} title={m.name} style={{ fontSize: 13 }}>{m.avatar}</span>
                      ))}
                      {cc.memberIds.length > 5 && (
                        <span style={{ fontSize: 10, color: 'var(--amazon-text-muted)' }}>+{cc.memberIds.length - 5}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {isSelected
                      ? <span style={{ fontSize: 18, color: 'var(--amazon-orange)' }}>✓</span>
                      : <span style={{ fontSize: 12, color: 'var(--amazon-text-muted)' }}>Select ▶</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No common carts state */}
      {isCommonActive && commonCarts.length === 0 && (
        <div className="amazon-card" style={{ textAlign: 'center', padding: 32, marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>👥</span>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--amazon-text)', marginTop: 12 }}>No Group Carts Yet</p>
          <p style={{ fontSize: 12, color: 'var(--amazon-text-muted)', margin: '6px 0 16px' }}>
            Create a common cart or join one with an invite code
          </p>
          <button className="btn btn-primary" onClick={() => router.push('/common-cart')}>
            ✨ Create or Join Group Cart
          </button>
        </div>
      )}

      {/* Compact Cart Header */}
      <div className="amazon-card" style={{ marginBottom: 16, background: activeCart ? '#fff' : '#fff8e1', border: activeCart ? '' : '2px solid #f0c14b' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="back-btn" onClick={() => router.push('/')} aria-label="Go back to home">←</button>
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <h1
                  style={{ fontSize: 16, fontWeight: 700, color: 'var(--amazon-text)', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {activeCart?.type === 'common' ? '👥' : '🛒'} {activeCart?.name || 'Select a cart...'}
                </h1>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {activeCart && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Cart settings"
                aria-expanded={showSettings}
                style={{ fontSize: 14, padding: '4px 8px' }}
              >
                ⚙️
              </button>
            )}
            {activeCart ? members.filter(m => activeCart.memberIds.includes(m.id)).map(m => <MemberAvatar key={m.id} member={m} size={28} />) : null}
          </div>
        </div>

        {/* Summary Row */}
        {activeCart && (
          <>
            {activeCart.type === 'common' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                padding: '6px 10px', background: '#fef4e8', borderRadius: 6,
              }}>
                <span style={{ fontSize: 11, color: 'var(--amazon-text-secondary)', fontWeight: 500 }}>
                  Common Cart Code:
                </span>
                <code style={{
                  fontSize: 14, fontWeight: 700, letterSpacing: 2, color: 'var(--amazon-orange)',
                  fontFamily: 'monospace',
                }}>
                  {activeCart.code}
                </code>
                <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: 11, marginLeft: 'auto' }}
                  onClick={handleCopyCode}>
                  {showCodeCopied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            )}

            {/* Split Mode Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--amazon-text-secondary)' }}>Split mode:</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {splitModeOptions.map(mode => (
                  <button
                    key={mode}
                    className={`chip ${activeCart?.splitMode === mode ? 'active' : ''}`}
                    style={{ fontSize: 11, padding: '2px 8px' }}
                    onClick={() => activeCart && updateCartSplitMode(activeCart.id, mode)}
                  >
                    {mode === 'family' ? '👨‍👩‍👧' : mode === 'auto' ? '🧾' : mode === 'equal' ? '➗' : '✏️'}
                    {' '}{mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--amazon-text-secondary)' }}>
                  {totalItems} items
                </span>
                <AIStatusBadge />
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--amazon-price)' }}>
                ₹{totalPrice}
              </span>
            </div>
          </>
        )}

        {!activeCart && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)' }}>
              👆 Select a cart above to start adding items
            </p>
          </div>
        )}
      </div>

      {/* Collapsible Settings Panel */}
      {showSettings && activeCart && (
        <div className="voice-settings-drawer" aria-label="Cart settings panel">
          {/* Cart Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', background: '#fef4e8', borderRadius: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--amazon-text-secondary)', fontWeight: 500 }}>
              Cart Code:
            </span>
            <code style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: 'var(--amazon-orange)', fontFamily: 'monospace' }}>
              {activeCart.code}
            </code>
            <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: 11, marginLeft: 'auto' }}
              onClick={handleCopyCode} aria-label="Copy cart code">
              {showCodeCopied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>

          {/* Split Mode */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--amazon-text-secondary)', display: 'block', marginBottom: 6 }}>Split mode:</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {splitModeOptions.map(mode => (
                <button
                  key={mode}
                  className={`chip ${activeCart?.splitMode === mode ? 'active' : ''}`}
                  style={{ fontSize: 11, padding: '4px 10px' }}
                  onClick={() => activeCart && updateCartSplitMode(activeCart.id, mode)}
                  aria-pressed={activeCart?.splitMode === mode}
                >
                  {mode === 'family' ? '👨‍👩‍👧' : mode === 'auto' ? '🧾' : mode === 'equal' ? '➗' : '✏️'}
                  {' '}{mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="amazon-card" style={{ marginBottom: 16, padding: 12, borderColor: '#f0c14b', background: '#fffbf0' }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--amazon-text)' }}>
            📩 Pending Invites
          </p>
          {pendingInvites.map((inv, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--amazon-text-secondary)' }}>
                {inv.cartName} · <code style={{ fontSize: 11 }}>{inv.code}</code>
              </span>
              <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }}
                onClick={() => {
                  joinCommonCartByCode(inv.code, currentUserId);
                  showToast('Joined cart!', 'success');
                }}>
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Budget Bar */}
      {budgetMode && (
        <div style={{ marginBottom: 16 }}>
          <BudgetBar current={totalPrice} budget={budgetAmount} />
        </div>
      )}

      {/* Voice Section - Clean & Focused */}
      <div className="amazon-card" style={{ textAlign: 'center', padding: '24px 20px', marginBottom: 16 }}>
        <MicrophoneButton status={micStatus} onClick={handleMicToggle} />
        <VoiceTranscript
          transcript={transcript}
          interimTranscript={interimTranscript}
          aiResponse={aiResponse}
          isTyping={isAiTyping}
        />

        {/* Text Input */}
        <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            ref={inputRef}
            placeholder='Try: "add 2kg rice, milk, and 3 apples"'
            aria-label="Type a voice command"
            style={{ flex: 1, fontSize: 13, padding: '10px 14px' }}
          />
          <button type="submit" className="btn btn-primary btn-sm" aria-label="Send command">Send</button>
        </form>

        {/* Quick Actions - compact row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
          <button className={`chip ${mode === 'recipe' ? 'active' : ''}`}
            onClick={() => {
              if (selectedRecipe) { setMode('recipe'); return; }
              setSelectedRecipe(recipes[0]);
              setMode('recipe');
            }}>🍳 Recipe</button>
          <button className={`chip ${budgetMode ? 'active' : ''}`}
            onClick={() => {
              setBudgetMode(!budgetMode);
              setMode(budgetMode ? 'normal' : 'budget');
              if (!budgetMode) handleBudgetCart(budgetAmount);
            }}>💰 Budget Mode</button>
          <button className="chip"
            onClick={() => {
              const result = predictReorder(history, products);
              if (result.predictions.length > 0) {
                setReorderSummary(result);
                setDismissedReorder(false);
              } else {
                showToast('No items to reorder yet!', 'info');
              }
            }}>📅 Reorder</button>
          <button className={`chip ${cartAnalysis ? 'active' : ''}`}
            onClick={handleAnalyzeCart} disabled={!activeCart || activeCart.items.length === 0 || isAnalyzing}>
            {isAnalyzing ? '⏳' : '🤖'} Analyze
          </button>
          <button className="chip" onClick={() => router.push('/dashboard')}>📋 Templates</button>
        </div>

        {/* AI Cart Analysis */}
        {cartAnalysis && (
          <div className="animate-fadeIn" style={{ marginTop: 12, padding: 14, background: '#f0f8ff', borderRadius: 8, border: '1px solid #b7d4f0', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a73e8' }}>🤖 AI Analysis</p>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }}
                onClick={() => setCartAnalysis(null)} aria-label="Dismiss analysis">✕</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--amazon-text)', marginBottom: 6 }}>{cartAnalysis.summary}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11, marginBottom: 4 }}>
              <span style={{ background: cartAnalysis.balanced ? '#e6f7e6' : '#fff3cd', padding: '2px 6px', borderRadius: 4 }}>
                {cartAnalysis.balanced ? '✅ Balanced' : '⚠️ Needs variety'}
              </span>
              {cartAnalysis.duplicates && (
                <span style={{ background: '#fff3cd', padding: '2px 6px', borderRadius: 4 }}>📋 Duplicates</span>
              )}
            </div>
            <p style={{ fontSize: 11, color: 'var(--amazon-text-secondary)' }}>💡 {cartAnalysis.tip}</p>
            {cartAnalysis.missing && (
              <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)', marginTop: 2 }}>🔔 Missing: {cartAnalysis.missing}</p>
            )}
          </div>
        )}
      </div>

      {/* Cart Items Section */}
      <div ref={cartRef}>
        {!activeCart || activeCart.items.length === 0 ? (
          <div className="amazon-card empty-state">
            <div className="empty-state-icon">🛒</div>
            <p className="empty-state-title">Your cart is empty</p>
            <p className="empty-state-desc">
              Tap the microphone and say something like &ldquo;add 2kg rice, milk, and 3 apples&rdquo; to get started.
            </p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}
              onClick={() => router.push('/search')}>
              Browse Products
            </button>
            {activeCart?.type === 'common' && (
              <button className="btn btn-ghost btn-sm w-full mt-8" style={{ color: 'var(--amazon-error)' }}
                onClick={() => { leaveCommonCart(activeCart.id, currentUserId); showToast(`Left "${activeCart.name}"`, 'info'); router.push('/voice-cart'); }}>
                🚪 Leave Cart
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Shared Items */}
            {sharedItems.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h3 className="section-title" style={{ fontSize: 16 }}>🤝 Shared Items</h3>
                {sharedItems.map(item => (
                  <div key={item.id} style={{ marginBottom: 8 }}>
                    <CartItemRow
                      item={item}
                      onRemove={removeItem}
                      onToggleShared={toggleShared}
                      onUpdateQty={updateQuantity}
                      allergyWarning={checkAllergies(item.product, members, products) !== null}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Per-Member Items */}
            {cartMembers.map(m => {
              const memberItems = memberItemMap[m.id] || [];
              if (memberItems.length === 0) return null;
              const isHighlighted = highlightMember === m.id;
              return (
                <div key={m.id} style={{ marginBottom: 16, opacity: highlightMember && !isHighlighted ? 0.4 : 1 }}>
                  <h3 className="section-title" style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{m.avatar}</span>
                    <span>{m.id === currentUserId ? 'Your' : `${m.name}'s`} Items</span>
                    <span style={{ fontSize: 12, color: 'var(--amazon-text-secondary)', fontWeight: 400 }}>
                      ₹{memberItems.reduce((s, i) => s + i.product.price * i.quantity, 0)}
                    </span>
                  </h3>
                  {memberItems.map(item => (
                    <div key={item.id} style={{ marginBottom: 8 }}>
                      <CartItemRow
                        item={item}
                        onRemove={removeItem}
                        onToggleShared={toggleShared}
                        onUpdateQty={updateQuantity}
                        memberName={m.name}
                        allergyWarning={checkAllergies(item.product, members, products) !== null}
                      />
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Items from current user if not in cartMembers list (fallback) */}
            {(() => {
              const knownMemberIds = new Set(cartMembers.map(m => m.id));
              const unmatchedItems = activeCart!.items.filter(i => !i.isShared && !knownMemberIds.has(i.addedBy));
              if (unmatchedItems.length === 0) return null;
              // Group by addedBy
              const grouped: Record<string, typeof unmatchedItems> = {};
              unmatchedItems.forEach(i => {
                if (!grouped[i.addedBy]) grouped[i.addedBy] = [];
                grouped[i.addedBy].push(i);
              });
              return Object.entries(grouped).map(([addedBy, items]) => {
                const member = getMemberById(addedBy);
                const label = addedBy === currentUserId ? 'Your' : (member?.name || 'Your');
                return (
                  <div key={addedBy} style={{ marginBottom: 16 }}>
                    <h3 className="section-title" style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{member?.avatar || '👤'}</span>
                      <span>{label} Items</span>
                      <span style={{ fontSize: 12, color: 'var(--amazon-text-secondary)', fontWeight: 400 }}>
                        ₹{items.reduce((s, i) => s + i.product.price * i.quantity, 0)}
                      </span>
                    </h3>
                    {items.map(item => (
                      <div key={item.id} style={{ marginBottom: 8 }}>
                        <CartItemRow
                          item={item}
                          onRemove={removeItem}
                          onToggleShared={toggleShared}
                          onUpdateQty={updateQuantity}
                          allergyWarning={checkAllergies(item.product, members, products) !== null}
                        />
                      </div>
                    ))}
                  </div>
                );
              });
            })()}

            {/* Total */}
            <div className="amazon-card animate-fadeIn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f0c14b', background: '#fffbf0' }}>
              <div>
                <p style={{ fontSize: 13, color: 'var(--amazon-text-secondary)' }}>Grand Total</p>
                <p style={{ fontSize: 11, color: 'var(--amazon-text-muted)' }}>{totalItems} items</p>
                <p style={{ fontSize: 11, color: 'var(--amazon-orange)' }}>Split: {activeCart?.splitMode || 'auto'}</p>
              </div>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--amazon-price)' }}>₹{totalPrice}</span>
            </div>

            {/* Checkout Button */}
            {activeCart?.checkedOut && activeCart.items.length === 0 ? (
              <div className="amazon-card animate-fadeIn" style={{ padding: 16, textAlign: 'center', borderColor: 'var(--amazon-success)', background: '#f0fff4' }}>
                <span style={{ fontSize: 32 }}>✅</span>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--amazon-success)', marginTop: 8 }}>
                  Order placed successfully!
                </p>
                <p style={{ fontSize: 12, color: 'var(--amazon-text-secondary)', marginTop: 4 }}>
                  Your cart is ready for a new order. All members are still in the cart.
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => clearCartAfterCheckout()}>
                    🛒 Start New Order
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => router.push('/splits')}>
                    💰 View Splits
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ⚡ Express Delivery — One Tap Buy */}
                <div style={{
                  marginTop: 16, padding: '16px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                  color: '#fff', position: 'relative', overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(27,94,32,0.25)',
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 18 }}>⚡</span>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>Express Delivery</span>
                      </div>
                      <p style={{ fontSize: 11, opacity: 0.85 }}>10-15 min · Amazon Pay · Earn {Math.round(totalPrice * 0.05)} coins</p>
                    </div>
                    <button
                      onClick={() => router.push('/checkout?instant=true')}
                      style={{
                        padding: '12px 20px', borderRadius: 10, border: 'none',
                        background: '#FF9900', color: '#111',
                        fontSize: 13, fontWeight: 800, cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(255,153,0,0.4)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ⚡ ₹{totalPrice}
                    </button>
                  </div>
                </div>

                {/* Regular Checkout */}
                <button className="btn btn-secondary btn-lg w-full mt-8"
                  onClick={() => router.push('/checkout')}>
                  🛒 Proceed to Checkout
                </button>
              </>
            )}

            {/* Clear Cart */}
            <button className="btn btn-ghost btn-sm w-full mt-8" style={{ color: 'var(--amazon-error)' }}
              onClick={() => { clearCart(); showToast('Cart cleared', 'info'); }}>
              Clear Cart
            </button>
            {activeCart?.type === 'common' && (
              <button className="btn btn-ghost btn-sm w-full mt-8" style={{ color: 'var(--amazon-error)' }}
                onClick={() => { leaveCommonCart(activeCart.id, currentUserId); showToast(`Left "${activeCart.name}"`, 'info'); router.push('/voice-cart'); }}>
                🚪 Leave Cart
              </button>
            )}
          </>
        )}
      </div>

      {/* Reorder Prediction Popup */}
      {reorderSummary && reorderSummary.predictions.length > 0 && !dismissedReorder && (
        <ReorderPopup
          predictions={reorderSummary.predictions}
          onDismiss={() => setDismissedReorder(true)}
          onAddToCart={(productId, qty) => {
            const product = products.find(p => p.id === productId);
            if (product) {
              addItem(product, qty, currentUserId, false);
              showToast(`Added ${qty} ${product.name}`, 'success');
              speak(`Added ${qty} ${product.name} to cart!`);
            }
          }}
          onAddAll={() => {
            for (const p of reorderSummary.predictions) {
              const product = products.find(x => x.id === p.product.id);
              if (product) addItem(product, p.suggestedQuantity, currentUserId, false);
            }
            setDismissedReorder(true);
            showToast(`Added ${reorderSummary.totalItems} items to cart!`, 'success');
            speak(`Added all ${reorderSummary.predictions.length} reorder items to cart!`);
          }}
        />
      )}

      {/* Recipe Modal */}
      {selectedRecipe && mode === 'recipe' && (
        <RecipeModal recipe={selectedRecipe} onClose={() => { setMode('normal'); setSelectedRecipe(null); }} />
      )}

      {/* Allergy Warning Modal */}
      {allergyWarning && (
        <AllergyWarningModal warning={allergyWarning} onClose={() => setAllergyWarning(null)} />
      )}

      {/* Sticky Checkout Bar */}
      <StickyCheckoutBar />
    </div>
  );
}

export default function VoiceCartPage() {
  return (
    <Suspense fallback={
      <div className="page-content" style={{ padding: '16px', paddingBottom: 80 }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid #e7e7e7' }}>
          <div style={{ flex: 1, padding: 12, background: '#f5f5f5' }}>
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" style={{ marginTop: 4 }} />
          </div>
          <div style={{ flex: 1, padding: 12, background: '#f5f5f5', borderLeft: '1px solid #e7e7e7' }}>
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" style={{ marginTop: 4 }} />
          </div>
        </div>
        <div className="skeleton-card-row" style={{ height: 80 }}>
          <div className="skeleton-avatar" style={{ width: 48, height: 48 }} />
          <div className="skeleton-lines">
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-card-row">
            <div className="skeleton-avatar" />
            <div className="skeleton-lines">
              <div className="skeleton-line medium" />
              <div className="skeleton-line short" />
            </div>
          </div>
        ))}
      </div>
    }>
      <VoiceCartPageInner />
    </Suspense>
  );
}
