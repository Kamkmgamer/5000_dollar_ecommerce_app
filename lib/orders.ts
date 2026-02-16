"use server";

import { cookies } from "next/headers";
import { getCart, clearCart, validateCartStock } from "./cart";
import { createOrUpdateCustomer, Customer } from "./customers";
import { recordInventoryTransaction } from "./inventory";
import { trackCheckoutComplete } from "./analytics";

export interface OrderItem {
  productId: number;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  customerData?: Customer;
}

const ORDERS_COOKIE = "established_brand_orders";

async function getOrdersFromCookie(): Promise<Order[]> {
  const cookieStore = await cookies();
  const ordersCookie = cookieStore.get(ORDERS_COOKIE);
  if (!ordersCookie) return [];
  try {
    const orders = JSON.parse(ordersCookie.value);
    return orders.map((o: Order) => ({
      ...o,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt),
    }));
  } catch {
    return [];
  }
}

async function saveOrdersToCookie(orders: Order[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ORDERS_COOKIE, JSON.stringify(orders), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function createOrder(data: {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
}): Promise<Order> {
  const cart = await getCart();
  
  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const stockValidation = await validateCartStock(cart.items);
  if (!stockValidation.valid) {
    throw new Error(`Stock validation failed: ${stockValidation.errors.join(", ")}`);
  }

  const orders = await getOrdersFromCookie();
  
  const subtotal = cart.subtotal;
  const shipping = cart.shipping;
  const total = subtotal + shipping;

  const order: Order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    items: cart.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      variantId: item.variantId,
      variantName: item.variant.name,
      quantity: item.quantity,
      price: item.variant.price,
      image: item.product.image,
    })),
    subtotal,
    shipping,
    total,
    customer: {
      email: data.customerEmail,
      name: data.customerName,
      phone: data.customerPhone,
    },
    shippingAddress: data.shippingAddress,
    status: "pending",
    paymentStatus: "pending",
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  for (const item of cart.items) {
    await recordInventoryTransaction({
      productId: item.productId,
      variantId: item.variantId,
      type: "out",
      quantity: item.quantity,
      reason: `Order ${order.id}`,
      reference: order.id,
    });
  }

  const customerData = await createOrUpdateCustomer({
    email: data.customerEmail,
    name: data.customerName,
    phone: data.customerPhone,
    orderValue: total,
  });
  order.customerData = customerData;

  orders.push(order);
  await saveOrdersToCookie(orders);
  await clearCart();
  await trackCheckoutComplete(total, order.id);

  return order;
}

export async function getOrders(): Promise<Order[]> {
  const orders = await getOrdersFromCookie();
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const orders = await getOrdersFromCookie();
  return orders.find((o) => o.id === orderId);
}

export async function getOrdersByCustomer(email: string): Promise<Order[]> {
  const orders = await getOrdersFromCookie();
  return orders.filter(o => o.customer.email === email)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  const orders = await getOrdersFromCookie();
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex >= 0) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    await saveOrdersToCookie(orders);
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order["paymentStatus"]
): Promise<void> {
  const orders = await getOrdersFromCookie();
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex >= 0) {
    orders[orderIndex].paymentStatus = paymentStatus;
    orders[orderIndex].updatedAt = new Date();
    await saveOrdersToCookie(orders);
  }
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  recentOrders: Order[];
}> {
  const orders = await getOrdersFromCookie();
  
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    processingOrders: orders.filter((o) => o.status === "processing").length,
    shippedOrders: orders.filter((o) => o.status === "shipped").length,
    deliveredOrders: orders.filter((o) => o.status === "delivered").length,
    cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
    refundedOrders: orders.filter((o) => o.status === "refunded").length,
    recentOrders: orders.slice(-5).reverse(),
  };
}

export async function getRevenueByPeriod(period: "day" | "week" | "month"): Promise<
  Array<{ date: string; revenue: number; orders: number }>
> {
  const orders = await getOrdersFromCookie();
  const paidOrders = orders.filter(o => o.paymentStatus === "paid");
  
  const grouped: Record<string, { revenue: number; orders: number }> = {};

  for (const order of paidOrders) {
    const date = new Date(order.createdAt);
    let key: string;

    if (period === "day") {
      key = date.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, orders: 0 };
    }
    grouped[key].revenue += order.total;
    grouped[key].orders++;
  }

  return Object.entries(grouped)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
