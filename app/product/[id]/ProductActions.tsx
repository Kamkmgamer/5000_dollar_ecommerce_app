"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WishlistToggle from "@/components/WishlistToggle";
import VariantSelector from "@/components/VariantSelector";
import { Product, ProductVariant } from "@/lib/products";

interface ProductActionsProps {
  product: Product;
  initialInWishlist: boolean;
}

export default function ProductActions({ product, initialInWishlist }: ProductActionsProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (loading || !selectedVariant || selectedVariant.stock === 0) return;
    setLoading(true);

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant.id,
          quantity,
        }),
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stock, 99) : 0;

  return (
    <>
      <VariantSelector
        product={product}
        onVariantChange={setSelectedVariant}
        selectedVariantId={selectedVariant?.id}
      />

      {selectedVariant && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="variant-label">Quantity</label>
          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}>+</button>
          </div>
        </div>
      )}

      <div className="product-actions-row">
        <button
          onClick={handleAddToCart}
          disabled={loading || !selectedVariant || selectedVariant.stock === 0}
          className="btn btn-lg"
          style={{ background: added ? "var(--accent)" : undefined }}
        >
          {added
            ? "✓ Added to Cart"
            : loading
            ? "Adding..."
            : !selectedVariant
            ? "Select Options"
            : selectedVariant.stock === 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
        <WishlistToggle productId={product.id} initialInWishlist={initialInWishlist} />
      </div>
    </>
  );
}
