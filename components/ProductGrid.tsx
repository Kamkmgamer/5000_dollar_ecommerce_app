"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product, getCategories } from "@/lib/products";
import WishlistToggle from "./WishlistToggle";

interface ProductGridProps {
  products: Product[];
  categories: string[];
  title?: string;
}

export default function ProductGrid({ products, categories, title = "Our Collection" }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(lowerQuery))
      );
    }

    result = result.filter((p) => {
      const minPrice = Math.min(...p.variants.map((v) => v.price));
      const maxPrice = Math.max(...p.variants.map((v) => v.price));
      return minPrice >= priceRange[0] && maxPrice <= priceRange[1];
    });

    return [...result].sort((a, b) => {
      const aMinPrice = Math.min(...a.variants.map((v) => v.price));
      const bMinPrice = Math.min(...b.variants.map((v) => v.price));

      switch (sortBy) {
        case "price-asc":
          return aMinPrice - bMinPrice;
        case "price-desc":
          return bMinPrice - aMinPrice;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, activeCategory, searchQuery, sortBy, priceRange]);

  return (
    <>
      <div className="section-header" style={{ marginBottom: "1.5rem", borderBottom: "none" }}>
        <div>
          <h2>{title}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
            {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="filters-row">
        <div className="category-filter">
          <button
            onClick={() => setActiveCategory("All")}
            className={`category-btn ${activeCategory === "All" ? "active" : ""}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "auto", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: "200px" }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary btn-sm"
          >
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="filter-input"
                style={{ width: "80px" }}
                min={0}
              />
              <span>—</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
                className="filter-input"
                style={{ width: "80px" }}
                min={0}
              />
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.3 }}>⌕</p>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "2rem" }}>
            No products found. Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
              setPriceRange([0, 500]);
            }}
            className="btn"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product, index) => {
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            const maxPrice = Math.max(...product.variants.map((v) => v.price));
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

            return (
              <article
                key={product.id}
                className="product-card animate-fade-in-up"
                style={{ animationDelay: `${(index % 8) * 0.05}s` }}
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
    </>
  );
}
