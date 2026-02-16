import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, products } from "@/lib/products";
import { isInWishlist } from "@/lib/wishlist";
import ProductActions from "./ProductActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(parseInt(id));

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — Pro Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(parseInt(id));

  if (!product) {
    notFound();
  }

  const inWishlist = await isInWishlist(product.id);

  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div>
      <Link href="/" className="back-link">
        ← Back to collection
      </Link>

      <div className="single-product">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} />
          {product.images.slice(1).map((img, i) => (
            <img key={i} src={img} alt={`${product.name} ${i + 2}`} />
          ))}
        </div>

        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <h1 style={{ marginTop: "0.5rem" }}>{product.name}</h1>
          <p className="product-price-large">
            ${minPrice.toFixed(2)}
            {maxPrice > minPrice && <span className="price-range"> — ${maxPrice.toFixed(2)}</span>}
          </p>

          <div className="product-rating" style={{ marginBottom: "1.25rem" }}>
            ★ {product.rating} <span>({product.reviews} reviews)</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-details-list">
            <div className="product-detail-item">
              <span>Variants</span>
              <span>{product.variants.length} options available</span>
            </div>
            <div className="product-detail-item">
              <span>Stock</span>
              <span style={{ color: totalStock > 0 ? "var(--accent)" : "var(--rose)" }}>
                {totalStock > 0 ? `${totalStock} units total` : "Out of stock"}
              </span>
            </div>
            <div className="product-detail-item">
              <span>Tags</span>
              <span>{product.tags.join(", ")}</span>
            </div>
            {product.brand && (
              <div className="product-detail-item">
                <span>Brand</span>
                <span>{product.brand}</span>
              </div>
            )}
            <div className="product-detail-item">
              <span>Shipping</span>
              <span>Free on orders over $100</span>
            </div>
          </div>

          <ProductActions product={product} initialInWishlist={inWishlist} />
        </div>
      </div>
    </div>
  );
}
