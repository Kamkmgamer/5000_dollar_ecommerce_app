"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface CartItem {
  productId: number;
  variantId: string;
  product: { id: number; name: string; image: string };
  variant: { name: string; price: number };
  quantity: number;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartData>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then(setCart)
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen, fetchCart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cart-toggle"
        aria-label="Shopping cart"
      >
        <span className="cart-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
        </span>
        {cart.itemCount > 0 && <span className="cart-count">{cart.itemCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className="cart-overlay" onClick={() => setIsOpen(false)} />
          <div className="cart-dropdown">
            <div className="cart-header">
              <h4>Your Cart ({cart.itemCount})</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="cart-close"
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.items.length === 0 ? (
              <p className="cart-empty">Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="cart-item">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="cart-item-details">
                        <span className="cart-item-name">{item.product.name}</span>
                        <span className="cart-item-variant">{item.variant.name}</span>
                        <span className="cart-item-qty">
                          {item.quantity} × ${item.variant.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-drawer-footer">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/cart"
                    className="cart-view"
                    onClick={() => setIsOpen(false)}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="cart-checkout"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
