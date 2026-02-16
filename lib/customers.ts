import { cookies } from "next/headers";

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
  segment: CustomerSegment;
  tags: string[];
}

export type CustomerSegment = 
  | "new"
  | "active"
  | "at_risk"
  | "churned"
  | "vip"
  | "high_value";

export interface SegmentDefinition {
  id: CustomerSegment;
  name: string;
  description: string;
  color: string;
  criteria: {
    minOrders?: number;
    maxOrders?: number;
    minSpent?: number;
    maxSpent?: number;
    daysSinceLastOrder?: { min?: number; max?: number };
  };
}

export const segmentDefinitions: SegmentDefinition[] = [
  {
    id: "new",
    name: "New Customers",
    description: "Customers who made their first purchase within the last 30 days",
    color: "#4A8B65",
    criteria: { minOrders: 1, maxOrders: 1, daysSinceLastOrder: { max: 30 } },
  },
  {
    id: "active",
    name: "Active Customers",
    description: "Customers who have purchased in the last 90 days",
    color: "#2D5A3D",
    criteria: { minOrders: 2, daysSinceLastOrder: { max: 90 } },
  },
  {
    id: "at_risk",
    name: "At Risk",
    description: "Customers who haven't purchased in 90-180 days",
    color: "#B8860B",
    criteria: { daysSinceLastOrder: { min: 90, max: 180 } },
  },
  {
    id: "churned",
    name: "Churned",
    description: "Customers who haven't purchased in over 180 days",
    color: "#C0392B",
    criteria: { daysSinceLastOrder: { min: 180 } },
  },
  {
    id: "vip",
    name: "VIP Customers",
    description: "Top 10% of customers by lifetime value",
    color: "#9B59B6",
    criteria: { minSpent: 500 },
  },
  {
    id: "high_value",
    name: "High Value",
    description: "Customers with high average order value",
    color: "#2C5F8A",
    criteria: { minOrders: 3, minSpent: 200 },
  },
];

const CUSTOMERS_COOKIE = "established_brand_customers";

async function getCustomersFromCookie(): Promise<Customer[]> {
  const cookieStore = await cookies();
  const customersCookie = cookieStore.get(CUSTOMERS_COOKIE);
  if (!customersCookie) return [];
  try {
    const customers = JSON.parse(customersCookie.value);
    return customers.map((c: Customer) => ({
      ...c,
      firstOrderDate: new Date(c.firstOrderDate),
      lastOrderDate: new Date(c.lastOrderDate),
    }));
  } catch {
    return [];
  }
}

async function saveCustomersToCookie(customers: Customer[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMERS_COOKIE, JSON.stringify(customers), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

function determineSegment(customer: Omit<Customer, "segment">): CustomerSegment {
  const daysSinceLastOrder = Math.floor(
    (Date.now() - customer.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (customer.totalSpent >= 500) return "vip";
  if (customer.totalOrders >= 3 && customer.totalSpent >= 200) return "high_value";
  if (customer.totalOrders === 1 && daysSinceLastOrder <= 30) return "new";
  if (daysSinceLastOrder <= 90) return "active";
  if (daysSinceLastOrder <= 180) return "at_risk";
  return "churned";
}

export async function createOrUpdateCustomer(data: {
  email: string;
  name: string;
  phone?: string;
  orderValue: number;
}): Promise<Customer> {
  const customers = await getCustomersFromCookie();
  const existingIndex = customers.findIndex(c => c.email === data.email);
  const now = new Date();

  if (existingIndex >= 0) {
    const existing = customers[existingIndex];
    const updated: Customer = {
      ...existing,
      name: data.name,
      phone: data.phone || existing.phone,
      totalOrders: existing.totalOrders + 1,
      totalSpent: existing.totalSpent + data.orderValue,
      averageOrderValue: (existing.totalSpent + data.orderValue) / (existing.totalOrders + 1),
      lastOrderDate: now,
      segment: "new",
    };
    updated.segment = determineSegment(updated);
    customers[existingIndex] = updated;
    await saveCustomersToCookie(customers);
    return updated;
  }

  const newCustomer: Customer = {
    id: `CUS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    totalOrders: 1,
    totalSpent: data.orderValue,
    averageOrderValue: data.orderValue,
    firstOrderDate: now,
    lastOrderDate: now,
    segment: "new",
    tags: [],
  };
  newCustomer.segment = determineSegment(newCustomer);
  
  customers.push(newCustomer);
  await saveCustomersToCookie(customers);
  
  return newCustomer;
}

export async function getCustomers(): Promise<Customer[]> {
  const customers = await getCustomersFromCookie();
  return customers.sort((a, b) => b.lastOrderDate.getTime() - a.lastOrderDate.getTime());
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const customers = await getCustomersFromCookie();
  return customers.find(c => c.id === id);
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const customers = await getCustomersFromCookie();
  return customers.find(c => c.email === email);
}

export async function getCustomersBySegment(segment: CustomerSegment): Promise<Customer[]> {
  const customers = await getCustomersFromCookie();
  return customers.filter(c => c.segment === segment);
}

export async function getCustomerStats(): Promise<{
  total: number;
  bySegment: Record<CustomerSegment, number>;
  newThisMonth: number;
  activeThisMonth: number;
  totalRevenue: number;
  averageLifetimeValue: number;
}> {
  const customers = await getCustomersFromCookie();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const bySegment: Record<CustomerSegment, number> = {
    new: 0,
    active: 0,
    at_risk: 0,
    churned: 0,
    vip: 0,
    high_value: 0,
  };

  for (const customer of customers) {
    bySegment[customer.segment]++;
  }

  const newThisMonth = customers.filter(
    c => c.firstOrderDate >= thirtyDaysAgo
  ).length;

  const activeThisMonth = customers.filter(
    c => c.lastOrderDate >= thirtyDaysAgo
  ).length;

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageLifetimeValue = customers.length > 0 ? totalRevenue / customers.length : 0;

  return {
    total: customers.length,
    bySegment,
    newThisMonth,
    activeThisMonth,
    totalRevenue,
    averageLifetimeValue,
  };
}

export async function addCustomerTag(id: string, tag: string): Promise<void> {
  const customers = await getCustomersFromCookie();
  const index = customers.findIndex(c => c.id === id);
  if (index >= 0 && !customers[index].tags.includes(tag)) {
    customers[index].tags.push(tag);
    await saveCustomersToCookie(customers);
  }
}

export async function removeCustomerTag(id: string, tag: string): Promise<void> {
  const customers = await getCustomersFromCookie();
  const index = customers.findIndex(c => c.id === id);
  if (index >= 0) {
    customers[index].tags = customers[index].tags.filter(t => t !== tag);
    await saveCustomersToCookie(customers);
  }
}
