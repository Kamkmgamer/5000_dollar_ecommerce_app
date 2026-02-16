import { getCart } from "@/lib/cart";
import { trackCheckoutStart } from "@/lib/analytics";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page" style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1>Checkout</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
          Your cart is empty. Add some items to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <div>
          <h3>Shipping Information</h3>
          <CheckoutForm cart={cart} />
        </div>

        <div>
          <h3>Order Summary</h3>
          <div className="order-summary">
            {cart.items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="order-item">
                <span>
                  {item.product.name} ({item.variant.name}) × {item.quantity}
                </span>
                <span style={{ fontWeight: 600 }}>
                  ${(item.variant.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="order-item" style={{ borderBottom: "none", color: "var(--text-muted)" }}>
              <span>Shipping</span>
              <span>{cart.shipping === 0 ? "Free" : `$${cart.shipping.toFixed(2)}`}</span>
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
