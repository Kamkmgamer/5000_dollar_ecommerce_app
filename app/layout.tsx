import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import Cart from "@/components/Cart";

import MobileMenu from "@/components/MobileMenu";

export const metadata: Metadata = {
  title: "Pro Store | Professional E-Commerce Platform",
  description: "Professional e-commerce platform for established brands. Advanced inventory management, customer segmentation, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
        <div className="announcement-bar">
          <span>Complimentary shipping on orders over $100 — Same-day dispatch before 2pm — Easy 30-day returns</span>
        </div>
        <header className="site-header">
          <div className="header-inner">
            <MobileMenu />
            <nav className="nav-left">
              <Link href="/">Shop</Link>
              <Link href="/wishlist">Wishlist</Link>
            </nav>
            <p className="site-title">
              <Link href="/">Pro Store</Link>
            </p>
            <nav className="nav">
              <div className="nav-desktop-links">
                <SignedOut>
                  <SignInButton mode="modal">
                    <span className="nav-auth-link">Sign In</span>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/account">Account</Link>
                  <Link href="/admin">Admin</Link>
                  <Link href="/analytics">Analytics</Link>
                  <Link href="/inventory">Inventory</Link>
                </SignedIn>
              </div>
              <SignedIn>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "clerk-avatar" } }} />
              </SignedIn>
              <Cart />
            </nav>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-grid">
              <div className="footer-col footer-brand">
                <p className="brand-name">Pro Store</p>
                <p>
                  Artisan-crafted goods meeting modern commerce. A professional platform
                  for established brands that demand exceptional quality.
                </p>
                <div className="footer-social">
                  <a href="#" aria-label="Instagram" className="social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 4s-1.1.5-2 .6A3.5 3.5 0 0021.4 3s-1.5.9-2.3 1.1A3.5 3.5 0 0012 7.5v1A8.4 8.4 0 013 4s-4 9 5 13a9.2 9.2 0 01-5.5 1.5c9 5 20 0 20-11.5 0-.3 0-.5 0-.8A5.7 5.7 0 0022 4z" /></svg>
                  </a>
                  <a href="#" aria-label="Pinterest" className="social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.6 6 9.2l1.5-5.5c-.4-.3-.7-.8-.7-1.4 0-1.4 1-2.5 2.2-2.5.8 0 1.3.6 1.3 1.3 0 .8-.5 2-0.8 3.1-.2.9.5 1.6 1.4 1.6 1.7 0 3-1.8 3-4.5 0-2.3-1.7-4-4-4-2.8 0-4.4 2.1-4.4 4.2 0 .8.3 1.7.7 2.2l-0.8 3.2C4.5 19.2 2 15.9 2 12 2 6.5 6.5 2 12 2z" /></svg>
                  </a>
                </div>
              </div>
              <div className="footer-col">
                <h5>Shop</h5>
                <nav className="footer-links">
                  <Link href="/">All Products</Link>
                  <Link href="/category/tops">Tops</Link>
                  <Link href="/category/outerwear">Outerwear</Link>
                  <Link href="/category/accessories">Accessories</Link>
                  <Link href="/category/home">Home</Link>
                  <Link href="/category/footwear">Footwear</Link>
                </nav>
              </div>
              <div className="footer-col">
                <h5>Account</h5>
                <nav className="footer-links">
                  <Link href="/account">My Account</Link>
                  <Link href="/wishlist">Wishlist</Link>
                  <Link href="/cart">Shopping Cart</Link>
                  <Link href="/checkout">Checkout</Link>
                </nav>
              </div>
              <div className="footer-col">
                <h5>Admin</h5>
                <nav className="footer-links">
                  <Link href="/admin">Dashboard</Link>
                  <Link href="/analytics">Analytics</Link>
                  <Link href="/inventory">Inventory</Link>
                </nav>
              </div>
              <div className="footer-col">
                <h5>Support</h5>
                <nav className="footer-links">
                  <a href="mailto:support@prostore.com">support@prostore.com</a>
                  <a href="tel:+18005551234">1-800-555-1234</a>
                  <span style={{ color: "var(--text-light)", fontSize: "0.82rem" }}>Mon — Fri, 9am — 6pm EST</span>
                </nav>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 Pro Store. All rights reserved.</p>
              <p>
                <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Shipping</a> · <a href="#">Returns</a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
