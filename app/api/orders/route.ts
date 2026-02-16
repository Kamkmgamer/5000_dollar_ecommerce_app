import { NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus, getOrderStats } from "@/lib/orders";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stats = searchParams.get("stats");

  if (stats === "true") {
    const orderStats = await getOrderStats();
    return NextResponse.json(orderStats);
  }

  const orders = await getOrders();
  return NextResponse.json(
    orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const order = await createOrder(body);
  return NextResponse.json({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { orderId, status, paymentStatus } = body;

  if (status) {
    await updateOrderStatus(orderId, status);
  }

  if (paymentStatus) {
    const { updatePaymentStatus } = await import("@/lib/orders");
    await updatePaymentStatus(orderId, paymentStatus);
  }

  const orders = await getOrders();
  return NextResponse.json(
    orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }))
  );
}
