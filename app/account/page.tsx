import { getOrders } from "@/lib/orders";
import { getCustomerStats } from "@/lib/customers";
import AccountContent from "./AccountContent";

export default async function AccountPage() {
  const orders = await getOrders();
  const customerStats = await getCustomerStats();

  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return (
    <div className="account-page">
      <h1>My Account</h1>

      <div className="account-grid">
        <div className="account-sidebar">
          <div className="account-user">
            <div className="account-user-avatar">G</div>
            <p className="account-user-name">Guest User</p>
            <p className="account-user-email">guest@prostore.com</p>
          </div>
          <nav className="account-nav">
            <a href="#profile" className="active">Profile</a>
            <a href="#orders">Order History</a>
            <a href="/wishlist">Wishlist</a>
          </nav>
        </div>

        <AccountContent orders={serializedOrders} customerStats={customerStats} />
      </div>
    </div>
  );
}
