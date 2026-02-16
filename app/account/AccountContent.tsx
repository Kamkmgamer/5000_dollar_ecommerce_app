"use client";

import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { productName: string; variantName: string; quantity: number }[];
}

interface CustomerStats {
  total: number;
  newThisMonth: number;
  activeThisMonth: number;
  totalRevenue: number;
  averageLifetimeValue: number;
}

interface AccountContentProps {
  orders: Order[];
  customerStats: CustomerStats;
}

export default function AccountContent({ orders, customerStats }: AccountContentProps) {
  return (
    <>
      <section id="profile">
        <h3>Profile Information</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value="Guest User"
            disabled
            style={{ background: "var(--bg-secondary)" }}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value="guest@prostore.com"
            disabled
            style={{ background: "var(--bg-secondary)" }}
          />
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Sign in with Clerk for full account management features.
        </p>
      </section>

      <section id="orders" style={{ marginTop: "3rem" }}>
        <h3>Order History</h3>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-muted)" }}>
            <p>No orders yet</p>
            <Link href="/" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i} style={{ fontSize: "0.8rem" }}>
                        {item.productName} × {item.quantity}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        +{order.items.length - 2} more
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
