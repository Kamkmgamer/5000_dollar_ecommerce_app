import { getInventorySummary, getInventoryAlerts, getInventoryTransactions } from "@/lib/inventory";
import { getLowStockProducts, getOutOfStockProducts } from "@/lib/products";
import InventoryTable from "./InventoryTable";

export default async function InventoryPage() {
  const [summary, alerts, transactions, lowStockProducts, outOfStockProducts] = await Promise.all([
    getInventorySummary(),
    getInventoryAlerts(),
    getInventoryTransactions(20),
    getLowStockProducts(10),
    getOutOfStockProducts(),
  ]);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="inventory-page">
      <h1>Inventory Management</h1>

      {unacknowledgedAlerts.length > 0 && (
        <div className="alert-banner warning">
          <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg></span>
          <p>
            <strong>{unacknowledgedAlerts.length} alerts:</strong>{" "}
            {unacknowledgedAlerts.filter((a) => a.type === "out_of_stock").length} out of stock,{" "}
            {unacknowledgedAlerts.filter((a) => a.type === "low_stock").length} low stock
          </p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{summary.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.totalVariants}</div>
          <div className="stat-label">Total Variants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.totalStock}</div>
          <div className="stat-label">Units in Stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${summary.inventoryValue.toFixed(2)}</div>
          <div className="stat-label">Inventory Value</div>
        </div>
      </div>

      {outOfStockProducts.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <div className="section-header">
            <h2>Out of Stock</h2>
            <span className="status-badge status-out_of_stock">{outOfStockProducts.length} products</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  padding: "1rem",
                  background: "var(--rose-bg)",
                  border: "1px solid rgba(192, 57, 43, 0.2)",
                  borderRadius: "var(--radius-md)",
                  minWidth: "200px",
                }}
              >
                <div style={{ fontWeight: 500 }}>{product.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {product.variants.filter((v) => v.stock === 0).length} variant(s) out of stock
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {lowStockProducts.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <div className="section-header">
            <h2>Low Stock Alerts</h2>
            <span className="status-badge status-low_stock">{lowStockProducts.length} products</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {lowStockProducts.map((product) => {
              const lowStockVariants = product.variants.filter((v) => v.stock > 0 && v.stock <= 10);
              return (
                <div
                  key={product.id}
                  style={{
                    padding: "1rem",
                    background: "var(--gold-bg)",
                    border: "1px solid rgba(184, 134, 11, 0.2)",
                    borderRadius: "var(--radius-md)",
                    minWidth: "200px",
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{product.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {lowStockVariants.map((v) => v.name).join(", ")}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="section-header">
        <h2>Inventory by Category</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {Object.entries(summary.categories).map(([category, data]) => (
          <div
            key={category}
            style={{
              padding: "1rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: "0.5rem" }}>{category}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {data.stock} units
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              ${data.value.toFixed(2)} value
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2>Recent Transactions</h2>
      </div>
      {transactions.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
          No inventory transactions yet. Transactions will appear when orders are placed or manual adjustments are made.
        </p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Previous</th>
              <th>New</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.productName}</td>
                <td>{tx.variantName}</td>
                <td>
                  <span className={`status-badge status-${tx.type === "in" ? "delivered" : tx.type === "out" ? "shipped" : "processing"}`}>
                    {tx.type}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: tx.type === "in" ? "var(--accent)" : tx.type === "out" ? "var(--rose)" : "var(--gold)" }}>
                  {tx.type === "in" ? "+" : tx.type === "out" ? "-" : ""}{tx.quantity}
                </td>
                <td>{tx.previousStock}</td>
                <td>{tx.newStock}</td>
                <td style={{ fontSize: "0.8rem" }}>{tx.reason}</td>
                <td style={{ fontSize: "0.8rem" }}>{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
