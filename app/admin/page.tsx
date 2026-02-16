import { getOrders, getOrderStats } from "@/lib/orders";
import { getCustomerStats } from "@/lib/customers";
import { getInventorySummary } from "@/lib/inventory";
import { getAbandonedCartStats } from "@/lib/cart";
import OrderList from "./OrderList";

export default async function AdminPage() {
  const [orders, orderStats, customerStats, inventorySummary, abandonedCartStats] = await Promise.all([
    getOrders(),
    getOrderStats(),
    getCustomerStats(),
    getInventorySummary(),
    getAbandonedCartStats(),
  ]);

  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
    updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
  }));

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{orderStats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${orderStats.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{customerStats.total}</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${orderStats.averageOrderValue.toFixed(2)}</div>
          <div className="stat-label">Avg Order Value</div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: "3rem" }}>
        <div className="stat-card">
          <div className="stat-value">{orderStats.pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{orderStats.processingOrders}</div>
          <div className="stat-label">Processing</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{inventorySummary.lowStockCount}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{abandonedCartStats.total}</div>
          <div className="stat-label">Abandoned Carts</div>
        </div>
      </div>

      <div className="section-header">
        <h2>Recent Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>◻</p>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            No orders yet. Orders will appear here once customers checkout.
          </p>
        </div>
      ) : (
        <OrderList orders={serializedOrders} />
      )}
    </div>
  );
}
