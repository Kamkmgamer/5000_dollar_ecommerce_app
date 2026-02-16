import { NextResponse } from "next/server";
import {
  getCustomers,
  getCustomerStats,
  getCustomersBySegment,
  addCustomerTag,
  removeCustomerTag,
} from "@/lib/customers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stats = searchParams.get("stats");
  const segment = searchParams.get("segment");

  if (stats === "true") {
    const customerStats = await getCustomerStats();
    return NextResponse.json(customerStats);
  }

  if (segment) {
    const customers = await getCustomersBySegment(segment as any);
    return NextResponse.json(customers);
  }

  const customers = await getCustomers();
  return NextResponse.json(customers);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { customerId, tag, action } = body;

  if (action === "add") {
    await addCustomerTag(customerId, tag);
  } else if (action === "remove") {
    await removeCustomerTag(customerId, tag);
  }

  const customers = await getCustomers();
  return NextResponse.json(customers);
}
