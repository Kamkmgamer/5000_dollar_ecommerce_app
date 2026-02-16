"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: number;
  variantId: string;
  product: { name: string };
  variant: { name: string; price: number };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface CheckoutFormProps {
  cart: Cart;
}

export default function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        notes: formData.notes,
      }),
    });

    await fetch("/api/cart", { method: "DELETE" });

    setLoading(false);
    router.push("/checkout/success");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="123 Main Street"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State / Province</label>
          <input
            type="text"
            id="state"
            name="state"
            placeholder="NY"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zip">ZIP / Postal Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            placeholder="10001"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="United States"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Order Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Special instructions for your order..."
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          style={{
            width: "100%",
            padding: "0.7rem 0.9rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            resize: "vertical",
          }}
        />
      </div>

      <div className="checkout-notice">
        <p>
          This is a demo checkout. No actual payment will be processed.
        </p>
        <div className="checkout-total">
          Order Total: ${cart.total.toFixed(2)}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-lg"
        style={{ width: "100%", opacity: loading ? 0.8 : 1 }}
      >
        {loading ? "Processing your order..." : "Place Order"}
      </button>
    </form>
  );
}
