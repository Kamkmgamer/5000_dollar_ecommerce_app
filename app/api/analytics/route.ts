import { NextResponse } from "next/server";
import { getAnalytics, getDashboardStats, trackEvent } from "@/lib/analytics";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dashboard = searchParams.get("dashboard");

  if (dashboard === "true") {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  }

  const analytics = await getAnalytics();
  return NextResponse.json(analytics);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, data } = body;
  await trackEvent(type, data);
  return NextResponse.json({ success: true });
}
