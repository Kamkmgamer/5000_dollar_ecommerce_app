"use client";

import { products, Product, ProductVariant } from "@/lib/products";

export default function InventoryTable() {
  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Variant</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {products.flatMap((product) =>
          product.variants.map((variant) => (
            <tr key={variant.id}>
              <td>{product.name}</td>
              <td>{variant.name}</td>
              <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{variant.sku}</td>
              <td>${variant.price.toFixed(2)}</td>
              <td>
                <span
                  className={`status-badge ${
                    variant.stock === 0
                      ? "status-out_of_stock"
                      : variant.stock <= 10
                      ? "status-low_stock"
                      : "status-in_stock"
                  }`}
                  style={{
                    background:
                      variant.stock === 0
                        ? "var(--rose-bg)"
                        : variant.stock <= 10
                        ? "var(--gold-bg)"
                        : "var(--accent-bg)",
                    color:
                      variant.stock === 0
                        ? "var(--rose)"
                        : variant.stock <= 10
                        ? "var(--gold)"
                        : "var(--accent)",
                  }}
                >
                  {variant.stock}
                </span>
              </td>
              <td>${(variant.price * variant.stock).toFixed(2)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
