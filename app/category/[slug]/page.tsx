import Link from "next/link";
import { categories, products } from "@/lib/products";
import { notFound } from "next/navigation";
import WishlistToggle from "@/components/WishlistToggle";

export function generateStaticParams() {
    return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = categories.find((c) => c.slug === slug);
    if (!category) return { title: "Category Not Found" };
    return {
        title: `${category.name} — Pro Store`,
        description: category.description,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = categories.find((c) => c.slug === slug);
    if (!category) notFound();

    const categoryProducts = products.filter(
        (p) => p.category.toLowerCase() === category.name.toLowerCase()
    );

    return (
        <div>
            {/* ─── CATEGORY HERO ─── */}
            <section className="category-hero">
                <div className="category-hero-bg">
                    <img src={category.image} alt={category.name} />
                </div>
                <div className="category-hero-content">
                    <Link href="/" className="back-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                        All Collections
                    </Link>
                    <h1>{category.name}</h1>
                    <p className="category-hero-desc">{category.description}</p>
                    <span className="category-hero-count">{categoryProducts.length} {categoryProducts.length === 1 ? "Product" : "Products"}</span>
                </div>
            </section>

            {/* ─── PRODUCT GRID ─── */}
            {categoryProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 0" }}>
                    <p style={{ fontSize: "2rem", opacity: 0.3, marginBottom: "1rem" }}>◻</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        No products in this category yet.
                    </p>
                    <Link href="/" className="btn" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
                        Browse All Products
                    </Link>
                </div>
            ) : (
                <div className="product-grid" style={{ marginTop: "3rem" }}>
                    {categoryProducts.map((product, index) => {
                        const minPrice = Math.min(...product.variants.map((v) => v.price));
                        const maxPrice = Math.max(...product.variants.map((v) => v.price));
                        const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

                        return (
                            <article
                                key={product.id}
                                className="product-card animate-fade-in-up"
                                style={{ animationDelay: `${(index % 8) * 0.06}s` }}
                            >
                                <Link href={`/product/${product.id}`}>
                                    <div className="product-card-img-wrap">
                                        <img src={product.image} alt={product.name} />
                                        {product.new && <span className="product-badge badge-new">New</span>}
                                        {product.bestselling && <span className="product-badge badge-best">Best Seller</span>}
                                    </div>
                                </Link>
                                <div className="product-card-actions">
                                    <WishlistToggle productId={product.id} />
                                </div>
                                <div className="product-card-content">
                                    <span className="product-category">{product.brand || product.category}</span>
                                    <h3>
                                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                                    </h3>
                                    <p className="product-short-desc">{product.shortDescription}</p>
                                    <div className="product-meta-row">
                                        <p className="product-price">
                                            ${minPrice.toFixed(2)}
                                            {maxPrice > minPrice && <span className="price-range"> — ${maxPrice.toFixed(2)}</span>}
                                        </p>
                                        <div className="product-rating">
                                            ★ {product.rating} <span>({product.reviews})</span>
                                        </div>
                                    </div>
                                    <p className={`product-stock ${totalStock < 10 ? "low" : ""} ${totalStock === 0 ? "out" : ""}`}>
                                        {totalStock === 0 ? "Out of stock" : `${product.variants.length} variants · ${totalStock} in stock`}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* ─── OTHER CATEGORIES ─── */}
            <section style={{ marginTop: "5rem" }}>
                <div className="section-header">
                    <h2>More Collections</h2>
                </div>
                <div className="category-grid">
                    {categories
                        .filter((c) => c.slug !== slug)
                        .slice(0, 4)
                        .map((cat, i) => (
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
        </div>
    );
}
