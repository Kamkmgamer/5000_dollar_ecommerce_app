import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrders } from "@/lib/orders";
import { getCustomerStats } from "@/lib/customers";
import AccountContent from "./AccountContent";

export default async function AccountPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const orders = await getOrders();
  const customerStats = await getCustomerStats();

  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  const firstName = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User";
  const email = user.emailAddresses[0]?.emailAddress || "No email";

  return (
    <div className="account-page">
      <h1>My Account</h1>

      <div className="account-grid">
        <div className="account-sidebar">
          <div className="account-user">
            <div className="account-user-avatar">{firstName.charAt(0).toUpperCase()}</div>
            <p className="account-user-name">{firstName}</p>
            <p className="account-user-email">{email}</p>
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
