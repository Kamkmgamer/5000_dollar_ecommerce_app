"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { label: "Shop All", href: "/" },
        { label: "Tops", href: "/category/tops" },
        { label: "Outerwear", href: "/category/outerwear" },
        { label: "Accessories", href: "/category/accessories" },
        { label: "Home", href: "/category/home" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Account", href: "/account" },
    ];

    return (
        <div className="mobile-menu-container">
            <button
                className={`hamburger-btn ${isOpen ? "open" : ""}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            <div className={`mobile-menu-overlay ${isOpen ? "open" : ""}`} onClick={toggleMenu}></div>

            <div className={`mobile-menu-drawer ${isOpen ? "open" : ""}`}>
                <nav className="mobile-nav">
                    <div className="mobile-nav-header">
                        <span className="mobile-nav-title">Menu</span>
                        <button className="close-btn" onClick={toggleMenu}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <ul className="mobile-nav-list">
                        {menuItems.map((item, index) => (
                            <li key={item.href} style={{ transitionDelay: `${index * 0.05}s` }}>
                                <Link
                                    href={item.href}
                                    className={`mobile-nav-link ${pathname === item.href ? "active" : ""}`}
                                    onClick={toggleMenu}
                                >
                                    {item.label}
                                    <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mobile-nav-footer">
                        <Link href="/admin" onClick={toggleMenu} className="mobile-admin-link">Admin Dashboard</Link>
                        <div className="mobile-social">
                            <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg></a>
                            <a href="#" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 4s-1.1.5-2 .6A3.5 3.5 0 0021.4 3s-1.5.9-2.3 1.1A3.5 3.5 0 0012 7.5v1A8.4 8.4 0 013 4s-4 9 5 13a9.2 9.2 0 01-5.5 1.5c9 5 20 0 20-11.5 0-.3 0-.5 0-.8A5.7 5.7 0 0022 4z" /></svg></a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
