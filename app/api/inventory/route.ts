import { NextResponse } from "next/server";
import {
  getInventorySummary,
  getInventoryAlerts,
  getInventoryTransactions,
  acknowledgeAlert,
  recordInventoryTransaction,
} from "@/lib/inventory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "summary") {
    const summary = await getInventorySummary();
    return NextResponse.json(summary);
  }

  if (type === "alerts") {
    const alerts = await getInventoryAlerts();
    return NextResponse.json(alerts);
  }

  if (type === "transactions") {
    const limit = parseInt(searchParams.get("limit") || "50");
    const transactions = await getInventoryTransactions(limit);
    return NextResponse.json(transactions);
  }

  const summary = await getInventorySummary();
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, variantId, type, quantity, reason, reference } = body;

  const transaction = await recordInventoryTransaction({
    productId,
    variantId,
    type,
    quantity,
    reason,
    reference,
  });

  return NextResponse.json(transaction);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { alertId } = body;

  await acknowledgeAlert(alertId);
  return NextResponse.json({ success: true });
}
