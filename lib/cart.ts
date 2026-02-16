"use server";

import { cookies } from "next/headers";
import { products, getProductById, Product, ProductVariant, getVariantById } from "./products";

export interface CartItem {
  productId: number;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface AbandonedCart {
  id: string;
  items: CartItem[];
  email?: string;
  createdAt: Date;
  reminderSent: boolean;
}

const CART_COOKIE = "established_brand_cart";
const ABANDONED_CART_COOKIE = "established_brand_abandoned";

async function getCartFromCookie(): Promise<Record<string, { variantId: string; quantity: number }>> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE);
  if (!cartCookie) return {};
  try {
    return JSON.parse(cartCookie.value);
  } catch {
    return {};
  }
}

async function saveCartToCookie(cart: Record<string, { variantId: string; quantity: number }>) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getCart(): Promise<Cart> {
  const cartData = await getCartFromCookie();
  const items: CartItem[] = [];
  let subtotal = 0;

  for (const [productIdStr, data] of Object.entries(cartData)) {
    const productId = parseInt(productIdStr);
    const product = getProductById(productId);
    const variant = getVariantById(productId, data.variantId);
    
    if (product && variant) {
      items.push({
        productId,
        variantId: data.variantId,
        product,
        variant,
        quantity: data.quantity,
      });
      subtotal += variant.price * data.quantity;
    }
  }

  const shipping = subtotal >= 100 ? 0 : 9.99;

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export async function addToCart(
  productId: number,
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  const cartData = await getCartFromCookie();
  const key = `${productId}-${variantId}`;

  const variant = getVariantById(productId, variantId);
  if (!variant) throw new Error("Variant not found");

  const availableStock = variant.stock;
  const currentQty = cartData[key]?.quantity || 0;
  const newQty = Math.min(currentQty + quantity, availableStock);

  if (newQty > 0) {
    cartData[key] = { variantId, quantity: newQty };
  }

  await saveCartToCookie(cartData);
  return getCart();
}

export async function removeFromCart(productId: number, variantId: string): Promise<Cart> {
  const cartData = await getCartFromCookie();
  const key = `${productId}-${variantId}`;
  delete cartData[key];
  await saveCartToCookie(cartData);
  return getCart();
}

export async function updateQuantity(
  productId: number,
  variantId: string,
  quantity: number
): Promise<Cart> {
  const cartData = await getCartFromCookie();
  const key = `${productId}-${variantId}`;

  const variant = getVariantById(productId, variantId);
  if (!variant) throw new Error("Variant not found");

  if (quantity <= 0) {
    delete cartData[key];
  } else {
    cartData[key] = { variantId, quantity: Math.min(quantity, variant.stock) };
  }

  await saveCartToCookie(cartData);
  return getCart();
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

export async function getAbandonedCarts(): Promise<AbandonedCart[]> {
  const cookieStore = await cookies();
  const abandonedCookie = cookieStore.get(ABANDONED_CART_COOKIE);
  if (!abandonedCookie) return [];
  try {
    return JSON.parse(abandonedCookie.value);
  } catch {
    return [];
  }
}

export async function saveAbandonedCart(email?: string): Promise<AbandonedCart> {
  const cart = await getCart();
  const abandonedCarts = await getAbandonedCarts();

  const abandoned: AbandonedCart = {
    id: `ABN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    items: cart.items,
    email,
    createdAt: new Date(),
    reminderSent: false,
  };

  abandonedCarts.push(abandoned);

  const cookieStore = await cookies();
  cookieStore.set(ABANDONED_CART_COOKIE, JSON.stringify(abandonedCarts), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return abandoned;
}

export async function getAbandonedCartStats(): Promise<{
  total: number;
  recovered: number;
  pendingRecovery: number;
  averageValue: number;
}> {
  const abandonedCarts = await getAbandonedCarts();

  const total = abandonedCarts.length;
  const recovered = abandonedCarts.filter((c) => c.reminderSent && c.email).length;
  const pendingRecovery = abandonedCarts.filter((c) => !c.reminderSent).length;
  const averageValue = total > 0
    ? abandonedCarts.reduce((sum, c) => {
        return sum + c.items.reduce((s, i) => s + i.variant.price * i.quantity, 0);
      }, 0) / total
    : 0;

  return { total, recovered, pendingRecovery, averageValue };
}

export async function validateCartStock(items: CartItem[]): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  for (const item of items) {
    if (item.quantity > item.variant.stock) {
      errors.push(
        `${item.product.name} (${item.variant.name}): Only ${item.variant.stock} available`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}
