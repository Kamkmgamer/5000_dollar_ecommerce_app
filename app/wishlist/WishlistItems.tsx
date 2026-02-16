"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface WishlistItem {
  productId: number;
  variantId?: string;
  product: {
    id: number;
    name: string;
    image: string;
    category: string;
    variants: Array<{ id: string; name: string; price: number; stock: number }>;
  };
  addedAt: string;
}

interface WishlistItemsProps {
  items: WishlistItem[];
}

export default function WishlistItems({ items }: WishlistItemsProps) {
  const router = useRouter();

  const handleRemove = async (productId: number, variantId?: string) => {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId }),
    });
    router.refresh();
  };

  const handleAddToCart = async (productId: number, variantId?: string) => {
    const item = items.find((i) => i.productId === productId && i.variantId === variantId);
    if (!item) return;

    const variant = variantId
      ? item.product.variants.find((v) => v.id === variantId)
      : item.product.variants[0];

    if (!variant) return;

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId: variant.id, quantity: 1 }),
    });
    await handleRemove(productId, variantId);
    router.refresh();
  };

  return (
    <div className="product-grid">
      {items.map((item, index) => {
        const minPrice = Math.min(...item.product.variants.map((v) => v.price));
        const totalStock = item.product.variants.reduce((sum, v) => sum + v.stock, 0);

        return (
          <article
            key={`${item.productId}-${item.variantId || "any"}`}
            className="product-card animate-fade-in-up"
            style={{ animationDelay: `${(index % 8) * 0.05}s` }}
          >
            <Link href={`/product/${item.productId}`}>
              <div className="product-card-img-wrap">
                <img src={item.product.image} alt={item.product.name} />
              </div>
            </Link>
            <div className="product-card-actions" style={{ opacity: 1 }}>
              <button
                onClick={() => handleRemove(item.productId, item.variantId)}
                className="product-action-btn in-wishlist"
                aria-label="Remove from wishlist"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              </button>
            </div>
            <div className="product-card-content">
              <span className="product-category">{item.product.category}</span>
              <h3>
                <Link href={`/product/${item.productId}`}>{item.product.name}</Link>
              </h3>
              <div className="product-meta-row">
                <p className="product-price">${minPrice.toFixed(2)}</p>
              </div>
              <p className={`product-stock ${totalStock < 10 ? "low" : ""}`}>
                {totalStock} in stock
              </p>
              <button
                onClick={() => handleAddToCart(item.productId, item.variantId)}
                className="btn btn-sm"
                style={{ width: "100%", marginTop: "0.75rem" }}
                disabled={totalStock === 0}
              >
                {totalStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
