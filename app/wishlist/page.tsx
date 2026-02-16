import Link from "next/link";
import { getWishlist } from "@/lib/wishlist";
import WishlistItems from "./WishlistItems";

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      <p className="wishlist-subtitle">
        {wishlist.itemCount} {wishlist.itemCount === 1 ? "item" : "items"} saved
      </p>

      {wishlist.items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.3 }}>◇</p>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "2rem" }}>
            Your wishlist is empty. Save items you love by clicking the heart icon.
          </p>
          <Link href="/" className="btn">Explore Products</Link>
        </div>
      ) : (
        <WishlistItems items={wishlist.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.image,
            category: item.product.category,
            variants: item.product.variants,
          },
          addedAt: item.addedAt.toISOString(),
        }))} />
      )}
    </div>
  );
}
