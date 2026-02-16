import { cookies } from "next/headers";
import { products, Product, getVariantById } from "./products";

export interface WishlistItem {
  productId: number;
  variantId?: string;
  product: Product;
  addedAt: Date;
}

export interface Wishlist {
  items: WishlistItem[];
  itemCount: number;
}

const WISHLIST_COOKIE = "established_brand_wishlist";

async function getWishlistFromCookie(): Promise<Array<{ productId: number; variantId?: string; addedAt: string }>> {
  const cookieStore = await cookies();
  const wishlistCookie = cookieStore.get(WISHLIST_COOKIE);
  if (!wishlistCookie) return [];
  try {
    return JSON.parse(wishlistCookie.value);
  } catch {
    return [];
  }
}

async function saveWishlistToCookie(wishlist: Array<{ productId: number; variantId?: string; addedAt: string }>): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(WISHLIST_COOKIE, JSON.stringify(wishlist), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getWishlist(): Promise<Wishlist> {
  const wishlistData = await getWishlistFromCookie();
  const items: WishlistItem[] = [];

  for (const item of wishlistData) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      items.push({
        productId: item.productId,
        variantId: item.variantId,
        product,
        addedAt: new Date(item.addedAt),
      });
    }
  }

  return {
    items,
    itemCount: items.length,
  };
}

export async function addToWishlist(productId: number, variantId?: string): Promise<Wishlist> {
  const wishlistData = await getWishlistFromCookie();
  
  const exists = wishlistData.some(
    (item) => item.productId === productId && item.variantId === variantId
  );
  
  if (!exists) {
    wishlistData.push({
      productId,
      variantId,
      addedAt: new Date().toISOString(),
    });
    await saveWishlistToCookie(wishlistData);
  }

  return getWishlist();
}

export async function removeFromWishlist(productId: number, variantId?: string): Promise<Wishlist> {
  const wishlistData = await getWishlistFromCookie();
  const filtered = wishlistData.filter(
    (item) => !(item.productId === productId && item.variantId === variantId)
  );
  await saveWishlistToCookie(filtered);
  return getWishlist();
}

export async function isInWishlist(productId: number, variantId?: string): Promise<boolean> {
  const wishlistData = await getWishlistFromCookie();
  return wishlistData.some(
    (item) => item.productId === productId && item.variantId === variantId
  );
}

export async function toggleWishlist(
  productId: number,
  variantId?: string
): Promise<{ inWishlist: boolean; wishlist: Wishlist }> {
  const wishlistData = await getWishlistFromCookie();
  const index = wishlistData.findIndex(
    (item) => item.productId === productId && item.variantId === variantId
  );
  
  if (index >= 0) {
    wishlistData.splice(index, 1);
  } else {
    wishlistData.push({
      productId,
      variantId,
      addedAt: new Date().toISOString(),
    });
  }
  
  await saveWishlistToCookie(wishlistData);
  
  const wishlist = await getWishlist();
  return { inWishlist: index < 0, wishlist };
}

export async function clearWishlist(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(WISHLIST_COOKIE);
}
