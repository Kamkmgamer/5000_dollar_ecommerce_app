import Link from "next/link";
import { products, categories, getFeaturedProducts, getNewProducts, getBestsellingProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

export default async function Home() {
  const allCategories = categories;
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const bestsellingProducts = getBestsellingProducts();

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-eyebrow">The Professional Collection</div>
        <h1>Curated for<br /><span className="hero-accent">Established Brands</span></h1>
        <p>
          Artisan-crafted goods meeting modern commerce — advanced inventory,
          customer intelligence, and real-time analytics, built for scale.
        </p>
        <div className="hero-actions">
          <Link href="#products" className="btn">Explore Collection</Link>
          <Link href="/admin" className="btn btn-secondary">View Dashboard</Link>
        </div>
      </section>

      {/* ─── TRUST MARQUEE ─── */}
      <div className="trust-banner">
        <div className="trust-item">
          <span>⚡</span>
          Instant Loading
        </div>
        <div className="trust-item">
          <span>◈</span>
          Live Analytics
        </div>
        <div className="trust-item">
          <span>▣</span>
          Inventory Control
        </div>
        <div className="trust-item">
          <span>◎</span>
          Customer Insight
        </div>
        <div className="trust-item">
          <span>↻</span>
          Cart Recovery
        </div>
      </div>

      {/* ─── CATEGORY SHOWCASE ─── */}
      <section className="category-showcase">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>{allCategories.length} Collections</p>
        </div>
        <div className="category-grid">
          {allCategories.slice(0, 4).map((cat, i) => (
            <Link href={`/category/${cat.slug}`} key={cat.id} className="category-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="category-card-img">
                <img src={cat.image} alt={cat.name} />
              </div>
              <div className="category-card-content">
                <h3>{cat.name}</h3>
                <span>{cat.productCount} Products</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section className="editorial-section">
          <div className="section-header">
            <div>
              <h2>Editor&apos;s Picks</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0, fontStyle: "italic" }}>
                Hand-selected pieces for the discerning buyer
              </p>
            </div>
            <Link href="/?featured=true" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="product-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {featuredProducts.slice(0, 4).map((product, index) => {
              const minPrice = Math.min(...product.variants.map((v) => v.price));
              const maxPrice = Math.max(...product.variants.map((v) => v.price));
              return (
                <article key={product.id} className="product-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                  <Link href={`/product/${product.id}`}>
                    <div className="product-card-img-wrap">
                      <img src={product.image} alt={product.name} />
                      {product.new && <span className="product-badge badge-new">New</span>}
                      {product.bestselling && <span className="product-badge badge-best">Best Seller</span>}
                    </div>
                  </Link>
                  <div className="product-card-content">
                    <span className="product-category">{product.category}</span>
                    <h3>
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="product-meta-row">
                      <p className="product-price">
                        ${minPrice.toFixed(2)}
                        {maxPrice > minPrice && <span className="price-range"> — ${maxPrice.toFixed(2)}</span>}
                      </p>
                      <div className="product-rating">
                        ★ {product.rating}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── EDITORIAL BANNER ─── */}
      <section className="editorial-banner">
        <div className="editorial-banner-content">
          <span className="editorial-eyebrow">Our Philosophy</span>
          <h2>Crafted with Intention,<br />Built to Last</h2>
          <p>
            Every product in our collection is chosen for its quality, sustainability, and timeless design.
            We partner with artisans and independent makers who share our commitment to exceptional craft.
          </p>
        </div>
      </section>

      {/* ─── FULL COLLECTION ─── */}
      <section id="products" className="editorial-section">
        <ProductGrid
          products={products}
          categories={categories.map(c => c.name)}
          title="Our Collection"
        />
      </section>

      {/* ─── NEW ARRIVALS ─── */}
      {newProducts.length > 0 && (
        <section className="editorial-section">
          <div className="section-header">
            <div>
              <h2>New Arrivals</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0, fontStyle: "italic" }}>
                Just landed in our collection
              </p>
            </div>
          </div>
          <div className="product-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {newProducts.slice(0, 4).map((product, index) => {
              const minPrice = Math.min(...product.variants.map((v) => v.price));
              return (
                <article key={product.id} className="product-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                  <Link href={`/product/${product.id}`}>
                    <div className="product-card-img-wrap">
                      <img src={product.image} alt={product.name} />
                      <span className="product-badge badge-new">New</span>
                    </div>
                  </Link>
                  <div className="product-card-content">
                    <span className="product-category">{product.category}</span>
                    <h3>
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="product-price">${minPrice.toFixed(2)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── BEST SELLERS ─── */}
      {bestsellingProducts.length > 0 && (
        <section className="editorial-section">
          <div className="section-header">
            <div>
              <h2>Best Sellers</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0, fontStyle: "italic" }}>
                Loved by our community
              </p>
            </div>
          </div>
          <div className="product-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {bestsellingProducts.slice(0, 4).map((product, index) => {
              const minPrice = Math.min(...product.variants.map((v) => v.price));
              return (
                <article key={product.id} className="product-card animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                  <Link href={`/product/${product.id}`}>
                    <div className="product-card-img-wrap">
                      <img src={product.image} alt={product.name} />
                      <span className="product-badge badge-best">Best Seller</span>
                    </div>
                  </Link>
                  <div className="product-card-content">
                    <span className="product-category">{product.category}</span>
                    <h3>
                      <Link href={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <p className="product-price">${minPrice.toFixed(2)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
