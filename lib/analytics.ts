import { cookies } from "next/headers";

export interface AnalyticsEvent {
  id: string;
  type: "page_view" | "product_view" | "add_to_cart" | "remove_from_cart" | "checkout_start" | "checkout_complete" | "search";
  data: Record<string, unknown>;
  timestamp: Date;
  sessionId: string;
}

export interface DailyMetrics {
  date: string;
  pageViews: number;
  productViews: number;
  addToCarts: number;
  checkoutsStarted: number;
  checkoutsCompleted: number;
  revenue: number;
  conversionRate: number;
}

export interface ProductAnalytics {
  productId: number;
  productName: string;
  views: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export interface TopProduct extends ProductAnalytics {}

const ANALYTICS_COOKIE = "established_brand_analytics";
const SESSION_COOKIE = "established_brand_session";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!sessionId) {
    sessionId = generateId();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  
  return sessionId;
}

async function getEvents(): Promise<AnalyticsEvent[]> {
  const cookieStore = await cookies();
  const analyticsCookie = cookieStore.get(ANALYTICS_COOKIE);
  if (!analyticsCookie) return [];
  try {
    const events = JSON.parse(analyticsCookie.value);
    return events.map((e: AnalyticsEvent) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));
  } catch {
    return [];
  }
}

async function saveEvents(events: AnalyticsEvent[]): Promise<void> {
  const cookieStore = await cookies();
  const recentEvents = events.slice(-1000);
  cookieStore.set(ANALYTICS_COOKIE, JSON.stringify(recentEvents), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function trackEvent(
  type: AnalyticsEvent["type"],
  data: Record<string, unknown> = {}
): Promise<void> {
  const sessionId = await getSessionId();
  const events = await getEvents();

  events.push({
    id: generateId(),
    type,
    data,
    timestamp: new Date(),
    sessionId,
  });

  await saveEvents(events);
}

export async function trackPageView(path: string): Promise<void> {
  await trackEvent("page_view", { path });
}

export async function trackProductView(productId: number, productName: string): Promise<void> {
  await trackEvent("product_view", { productId, productName });
}

export async function trackAddToCart(productId: number, productName: string, price: number): Promise<void> {
  await trackEvent("add_to_cart", { productId, productName, price });
}

export async function trackRemoveFromCart(productId: number, productName: string): Promise<void> {
  await trackEvent("remove_from_cart", { productId, productName });
}

export async function trackCheckoutStart(cartValue: number): Promise<void> {
  await trackEvent("checkout_start", { cartValue });
}

export async function trackCheckoutComplete(orderValue: number, orderId: string): Promise<void> {
  await trackEvent("checkout_complete", { orderValue, orderId });
}

export async function trackSearch(query: string, resultsCount: number): Promise<void> {
  await trackEvent("search", { query, resultsCount });
}

export async function getAnalytics(): Promise<{
  totalEvents: number;
  eventsByType: Record<string, number>;
  recentEvents: AnalyticsEvent[];
  dailyMetrics: DailyMetrics[];
}> {
  const events = await getEvents();
  
  const eventsByType: Record<string, number> = {};
  for (const event of events) {
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
  }

  const dailyData: Record<string, DailyMetrics> = {};
  for (const event of events) {
    const date = event.timestamp.toISOString().split("T")[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        pageViews: 0,
        productViews: 0,
        addToCarts: 0,
        checkoutsStarted: 0,
        checkoutsCompleted: 0,
        revenue: 0,
        conversionRate: 0,
      };
    }

    switch (event.type) {
      case "page_view":
        dailyData[date].pageViews++;
        break;
      case "product_view":
        dailyData[date].productViews++;
        break;
      case "add_to_cart":
        dailyData[date].addToCarts++;
        break;
      case "checkout_start":
        dailyData[date].checkoutsStarted++;
        break;
      case "checkout_complete":
        dailyData[date].checkoutsCompleted++;
        dailyData[date].revenue += (event.data.orderValue as number) || 0;
        break;
    }
  }

  for (const date of Object.keys(dailyData)) {
    const d = dailyData[date];
    d.conversionRate = d.checkoutsStarted > 0
      ? Math.round((d.checkoutsCompleted / d.checkoutsStarted) * 100)
      : 0;
  }

  return {
    totalEvents: events.length,
    eventsByType,
    recentEvents: events.slice(-50).reverse(),
    dailyMetrics: Object.values(dailyData).sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export async function getDashboardStats(): Promise<{
  todayViews: number;
  todayOrders: number;
  todayRevenue: number;
  conversionRate: number;
  topProducts: TopProduct[];
  periodComparison: {
    viewsChange: number;
    ordersChange: number;
    revenueChange: number;
  };
}> {
  const events = await getEvents();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const todayEvents = events.filter(e => e.timestamp.toISOString().split("T")[0] === today);
  const yesterdayEvents = events.filter(e => e.timestamp.toISOString().split("T")[0] === yesterday);

  const todayViews = todayEvents.filter(e => e.type === "page_view" || e.type === "product_view").length;
  const yesterdayViews = yesterdayEvents.filter(e => e.type === "page_view" || e.type === "product_view").length;

  const todayOrders = todayEvents.filter(e => e.type === "checkout_complete").length;
  const yesterdayOrders = yesterdayEvents.filter(e => e.type === "checkout_complete").length;

  const todayRevenue = todayEvents
    .filter(e => e.type === "checkout_complete")
    .reduce((sum, e) => sum + ((e.data.orderValue as number) || 0), 0);
  const yesterdayRevenue = yesterdayEvents
    .filter(e => e.type === "checkout_complete")
    .reduce((sum, e) => sum + ((e.data.orderValue as number) || 0), 0);

  const checkoutStarts = todayEvents.filter(e => e.type === "checkout_start").length;
  const checkoutCompletes = todayEvents.filter(e => e.type === "checkout_complete").length;
  const conversionRate = checkoutStarts > 0 ? Math.round((checkoutCompletes / checkoutStarts) * 100) : 0;

  const productViews: Record<number, { views: number; addToCarts: number; purchases: number; revenue: number; name: string }> = {};
  for (const event of events) {
    const productId = event.data.productId as number;
    if (!productId) continue;
    
    if (!productViews[productId]) {
      productViews[productId] = { views: 0, addToCarts: 0, purchases: 0, revenue: 0, name: (event.data.productName as string) || "Unknown" };
    }

    if (event.type === "product_view") productViews[productId].views++;
    if (event.type === "add_to_cart") productViews[productId].addToCarts++;
    if (event.type === "checkout_complete") {
      productViews[productId].purchases++;
      productViews[productId].revenue += (event.data.orderValue as number) || 0;
    }
  }

  const topProducts: TopProduct[] = Object.entries(productViews)
    .map(([productId, data]) => ({
      productId: parseInt(productId),
      productName: data.name,
      views: data.views,
      addToCarts: data.addToCarts,
      purchases: data.purchases,
      revenue: data.revenue,
      conversionRate: data.views > 0 ? Math.round((data.addToCarts / data.views) * 100) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    todayViews,
    todayOrders,
    todayRevenue,
    conversionRate,
    topProducts,
    periodComparison: {
      viewsChange: yesterdayViews > 0 ? Math.round(((todayViews - yesterdayViews) / yesterdayViews) * 100) : 0,
      ordersChange: yesterdayOrders > 0 ? Math.round(((todayOrders - yesterdayOrders) / yesterdayOrders) * 100) : 0,
      revenueChange: yesterdayRevenue > 0 ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : 0,
    },
  };
}
