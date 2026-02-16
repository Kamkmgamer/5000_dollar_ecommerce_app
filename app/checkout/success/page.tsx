import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>Order Confirmed!</h1>
      <p className="order-number">
        Thank you for your purchase. You&apos;ll receive a confirmation email with tracking details shortly.
      </p>
      <p style={{ color: "var(--text-light)", fontSize: "0.78rem", marginBottom: "2rem" }}>
        This is a demo checkout — no payment was processed.
      </p>
      <Link href="/" className="btn">Continue Shopping</Link>
    </div>
  );
}
