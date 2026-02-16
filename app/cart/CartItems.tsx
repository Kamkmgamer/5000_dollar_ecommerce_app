"use client";

import { useRouter } from "next/navigation";

interface CartItem {
  productId: number;
  variantId: string;
  product: { id: number; name: string; image: string };
  variant: { name: string; price: number; stock: number };
  quantity: number;
}

interface CartItemsProps {
  items: CartItem[];
}

export default function CartItems({ items }: CartItemsProps) {
  const router = useRouter();

  const handleRemove = async (productId: number, variantId: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId }),
    });
    router.refresh();
  };

  const handleUpdate = async (productId: number, variantId: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, variantId, quantity }),
    });
    router.refresh();
  };

  return (
    <>
      {items.map((item) => {
        const itemTotal = item.variant.price * item.quantity;

        return (
          <tr key={`${item.productId}-${item.variantId}`}>
            <td>
              <div className="cart-product-info">
                <img src={item.product.image} alt={item.product.name} />
                <span className="cart-product-name">{item.product.name}</span>
              </div>
            </td>
            <td>
              <span className="cart-variant-name">{item.variant.name}</span>
            </td>
            <td>${item.variant.price.toFixed(2)}</td>
            <td>
              <div className="quantity-selector" style={{ margin: 0 }}>
                <button onClick={() => handleUpdate(item.productId, item.variantId, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdate(item.productId, item.variantId, item.quantity + 1)}>+</button>
              </div>
            </td>
            <td style={{ fontWeight: 600 }}>${itemTotal.toFixed(2)}</td>
            <td>
              <button
                onClick={() => handleRemove(item.productId, item.variantId)}
                className="cart-remove"
              >
                Remove
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
