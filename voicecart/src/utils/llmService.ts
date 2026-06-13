import { LLMItem } from '@/types';
import { products, findBestMatch } from '@/data/products';
import { recipes } from '@/data/recipes';

// Track AI availability for the UI indicator
let aiAvailable: boolean | null = null;

export function getAIAvailability(): boolean | null {
  return aiAvailable;
}

async function callServerAI(action: string, payload: Record<string, unknown>): Promise<{ data: Record<string, unknown> | null; available: boolean }> {
  try {
    const res = await fetch('/api/ai/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });

    if (res.status === 503) {
      aiAvailable = false;
      return { data: null, available: false };
    }

    if (!res.ok) {
      return { data: null, available: aiAvailable ?? true };
    }

    const data = await res.json();
    if (data.available !== undefined) {
      aiAvailable = data.available;
    }
    return { data, available: data.available ?? true };
  } catch {
    return { data: null, available: aiAvailable ?? false };
  }
}

function smartParse(text: string): LLMItem[] {
  const lower = text.toLowerCase().trim();
  const cleaned = lower
    .replace(/^(add|get|i need|i want|please add|kindly add|need|want|buy|purchase)\s+/i, '')
    .replace(/\s+please$/i, '')
    .trim();

  const separators = /[,;&]|\band\b|\bplus\b/;
  const parts = cleaned.split(separators).map(s => s.trim()).filter(Boolean);

  const items: LLMItem[] = [];

  for (const part of parts) {
    const qtyMatch = part.match(/(\d+)\s*(kg|g|l|ml|packet|dozen|pk|pieces|bottle|litre|liters|kgs|grams)?/i);
    let quantity = 1;
    let namePart = part;

    if (qtyMatch) {
      quantity = parseInt(qtyMatch[1]) || 1;
      namePart = part.replace(qtyMatch[0], '').trim();
    }

    namePart = namePart.replace(/^(a |an |the |some |of )/i, '').trim();

    if (!namePart || namePart.length < 1) continue;
    items.push({ productName: namePart, quantity });
  }

  if (items.length === 0) {
    const qtyMatch = cleaned.match(/(\d+)/);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
    const name = cleaned.replace(/(\d+)\s*(kg|g|l|ml|packet|dozen|pk|pieces|bottle|litre|liters|kgs|grams)?/i, '').trim().replace(/^(a |an |the |some |of )/i, '');
    if (name) {
      items.push({ productName: name, quantity: qty });
    }
  }

  return items;
}

export async function parseItemsWithLLM(text: string): Promise<LLMItem[]> {
  const { data } = await callServerAI('parse_items', { text });
  if (data && Array.isArray(data.items) && data.items.length > 0) {
    return data.items as LLMItem[];
  }
  return smartParse(text);
}

export function matchLLMItemsToProducts(llmItems: LLMItem[]): { productName: string; matchedProduct?: { id: string; name: string }; quantity: number }[] {
  return llmItems.map(item => {
    const productName = item.productName;
    const singular = productName.replace(/s$/, '');
    const matched = findBestMatch(singular) || findBestMatch(productName);
    return {
      productName: item.productName,
      matchedProduct: matched ? { id: matched.id, name: matched.name } : undefined,
      quantity: item.quantity,
    };
  });
}

export function findRecipeSmart(text: string): string | null {
  const lower = text.toLowerCase();
  const cookingWords = ['recipe', 'make', 'cook', 'prepare', 'want', 'need', 'i\'d like', 'i\'ll', 'i will'];
  const hasCookingIntent = cookingWords.some(w => lower.includes(w));

  if (!hasCookingIntent) return null;

  for (const r of recipes) {
    const name = r.name.toLowerCase();
    if (lower.includes(name)) return r.name;
    const keywords = name.split(' ');
    if (keywords.some(kw => lower.includes(kw))) return r.name;
  }
  return null;
}

export async function findBestRecipeMatch(text: string): Promise<string | null> {
  const { data } = await callServerAI('match_recipe', { text });
  if (data && data.recipe) {
    const recipe = recipes.find(r => r.name.toLowerCase() === (data.recipe as string).toLowerCase());
    if (recipe) return recipe.name;
  }
  return findRecipeSmart(text);
}

export interface CartAnalysis {
  summary: string;
  tip: string;
  missing: string;
  duplicates: boolean;
  balanced: boolean;
}

export async function analyzeCart(items: { name: string; quantity: number; category: string; price: number }[]): Promise<CartAnalysis | null> {
  if (items.length === 0) return null;

  const { data } = await callServerAI('analyze_cart', { items });
  if (data && data.analysis) {
    return data.analysis as CartAnalysis;
  }
  return null;
}

const insightsPrompt = `You are a smart AI shopping analyst. Given order history data and member names, return a JSON array of exactly 3 insights. Each insight has:
- "emoji": a single emoji representing the insight
- "title": short bold title (max 40 chars)
- "detail": one-line explanation (max 80 chars)

Make insights specific, data-driven, and personalized. Cover: spending trends, frequently bought items, member comparisons, or savings tips.

Return ONLY valid JSON array, no other text.`;

export interface DashboardInsight {
  emoji: string;
  title: string;
  detail: string;
}

export async function generateDashboardInsights(
  orders: { date: string; totalAmount: number; items: { name: string; quantity: number; price: number; category: string }[]; memberPayments: { memberId: string; amount: number }[] }[],
  members: { id: string; name: string }[]
): Promise<DashboardInsight[]> {
  if (orders.length === 0) {
    return [
      { emoji: '🛒', title: 'Start ordering to see insights', detail: 'Your personalized analytics will appear here after your first order.' },
      { emoji: '📊', title: 'Track your spending', detail: 'Order history will power AI-driven spending insights.' },
      { emoji: '🎯', title: 'Smart recommendations', detail: 'Get product suggestions based on your purchase patterns.' },
    ];
  }

  const { data } = await callServerAI('dashboard_insights', { orders, members });
  if (data && Array.isArray(data.insights)) {
    return (data.insights as DashboardInsight[]).slice(0, 3);
  }
  return getFallbackInsights(orders, members);
}

function getFallbackInsights(
  orders: { date: string; totalAmount: number; items: { name: string; quantity: number; price: number; category: string }[]; memberPayments: { memberId: string; amount: number }[] }[],
  members: { id: string; name: string }[]
): DashboardInsight[] {
  const total = orders.reduce((s, o) => s + o.totalAmount, 0);
  const avg = total / Math.max(orders.length, 1);
  const allItems = orders.flatMap(o => o.items);
  const freq: Record<string, number> = {};
  for (const i of allItems) {
    freq[i.name] = (freq[i.name] || 0) + i.quantity;
  }
  const topItem = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  const thisMonth = orders.filter(o => new Date(o.date).getMonth() === new Date().getMonth());
  const monthTotal = thisMonth.reduce((s, o) => s + o.totalAmount, 0);

  return [
    { emoji: '💰', title: `₹${total.toLocaleString()} total spent`, detail: `Across ${orders.length} orders — avg ₹${Math.round(avg)} per order` },
    { emoji: '📈', title: `₹${monthTotal.toLocaleString()} this month`, detail: `${thisMonth.length} orders so far this month` },
    { emoji: topItem ? '🛒' : '📊', title: topItem ? `Most bought: ${topItem[0]}` : 'Start ordering!', detail: topItem ? `Bought ${topItem[1]} times` : 'Your first order will generate insights' },
  ];
}

export { smartParse };
