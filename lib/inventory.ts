import { cookies } from "next/headers";
import { products, Product, ProductVariant, getLowStockProducts, getOutOfStockProducts, getTotalInventory } from "./products";

export interface InventoryTransaction {
  id: string;
  productId: number;
  productName: string;
  variantId: string;
  variantName: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  timestamp: Date;
}

export interface InventoryAlert {
  id: string;
  productId: number;
  productName: string;
  variantId: string;
  variantName: string;
  type: "low_stock" | "out_of_stock" | "overstock";
  currentStock: number;
  threshold: number;
  createdAt: Date;
  acknowledged: boolean;
}

export interface InventorySummary {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  inventoryValue: number;
  categories: Record<string, { stock: number; value: number }>;
}

const TRANSACTIONS_COOKIE = "established_brand_inventory_transactions";
const ALERTS_COOKIE = "established_brand_inventory_alerts";

async function getTransactionsFromCookie(): Promise<InventoryTransaction[]> {
  const cookieStore = await cookies();
  const transactionsCookie = cookieStore.get(TRANSACTIONS_COOKIE);
  if (!transactionsCookie) return [];
  try {
    const transactions = JSON.parse(transactionsCookie.value);
    return transactions.map((t: InventoryTransaction) => ({
      ...t,
      timestamp: new Date(t.timestamp),
    }));
  } catch {
    return [];
  }
}

async function saveTransactionsToCookie(transactions: InventoryTransaction[]): Promise<void> {
  const cookieStore = await cookies();
  const recentTransactions = transactions.slice(-500);
  cookieStore.set(TRANSACTIONS_COOKIE, JSON.stringify(recentTransactions), {
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

async function getAlertsFromCookie(): Promise<InventoryAlert[]> {
  const cookieStore = await cookies();
  const alertsCookie = cookieStore.get(ALERTS_COOKIE);
  if (!alertsCookie) return [];
  try {
    const alerts = JSON.parse(alertsCookie.value);
    return alerts.map((a: InventoryAlert) => ({
      ...a,
      createdAt: new Date(a.createdAt),
    }));
  } catch {
    return [];
  }
}

async function saveAlertsToCookie(alerts: InventoryAlert[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ALERTS_COOKIE, JSON.stringify(alerts), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function recordInventoryTransaction(data: {
  productId: number;
  variantId: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  reference?: string;
}): Promise<InventoryTransaction> {
  const product = products.find(p => p.id === data.productId);
  const variant = product?.variants.find(v => v.id === data.variantId);
  
  if (!product || !variant) {
    throw new Error("Product or variant not found");
  }

  const previousStock = variant.stock;
  let newStock: number;
  
  if (data.type === "in") {
    newStock = previousStock + data.quantity;
  } else if (data.type === "out") {
    newStock = Math.max(0, previousStock - data.quantity);
  } else {
    newStock = Math.max(0, data.quantity);
  }

  variant.stock = newStock;

  const transactions = await getTransactionsFromCookie();
  const transaction: InventoryTransaction = {
    id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    productId: data.productId,
    productName: product.name,
    variantId: data.variantId,
    variantName: variant.name,
    type: data.type,
    quantity: data.quantity,
    previousStock,
    newStock,
    reason: data.reason,
    reference: data.reference,
    timestamp: new Date(),
  };
  
  transactions.push(transaction);
  await saveTransactionsToCookie(transactions);

  if (newStock <= 5 && newStock > 0) {
    await createLowStockAlert(product, variant, newStock);
  } else if (newStock === 0) {
    await createOutOfStockAlert(product, variant);
  }

  return transaction;
}

async function createLowStockAlert(product: Product, variant: ProductVariant, currentStock: number): Promise<void> {
  const alerts = await getAlertsFromCookie();
  const existingAlert = alerts.find(
    a => a.variantId === variant.id && a.type === "low_stock" && !a.acknowledged
  );

  if (!existingAlert) {
    alerts.push({
      id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      variantName: variant.name,
      type: "low_stock",
      currentStock,
      threshold: 10,
      createdAt: new Date(),
      acknowledged: false,
    });
    await saveAlertsToCookie(alerts);
  }
}

async function createOutOfStockAlert(product: Product, variant: ProductVariant): Promise<void> {
  const alerts = await getAlertsFromCookie();
  const existingAlert = alerts.find(
    a => a.variantId === variant.id && a.type === "out_of_stock" && !a.acknowledged
  );

  if (!existingAlert) {
    alerts.push({
      id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId: product.id,
      productName: product.name,
      variantId: variant.id,
      variantName: variant.name,
      type: "out_of_stock",
      currentStock: 0,
      threshold: 0,
      createdAt: new Date(),
      acknowledged: false,
    });
    await saveAlertsToCookie(alerts);
  }
}

export async function getInventoryTransactions(limit: number = 50): Promise<InventoryTransaction[]> {
  const transactions = await getTransactionsFromCookie();
  return transactions.slice(-limit).reverse();
}

export async function getInventoryAlerts(): Promise<InventoryAlert[]> {
  const alerts = await getAlertsFromCookie();
  return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  const alerts = await getAlertsFromCookie();
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    await saveAlertsToCookie(alerts);
  }
}

export async function getInventorySummary(): Promise<InventorySummary> {
  const totalProducts = products.length;
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0);
  const totalStock = getTotalInventory();

  const lowStockProducts = getLowStockProducts(10);
  const outOfStockProducts = getOutOfStockProducts();

  const lowStockCount = lowStockProducts.reduce(
    (sum, p) => sum + p.variants.filter(v => v.stock > 0 && v.stock <= 10).length,
    0
  );

  const outOfStockCount = outOfStockProducts.reduce(
    (sum, p) => sum + p.variants.filter(v => v.stock === 0).length,
    0
  );

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.variants.reduce((s, v) => s + v.price * v.stock, 0),
    0
  );

  const categories: Record<string, { stock: number; value: number }> = {};
  for (const product of products) {
    if (!categories[product.category]) {
      categories[product.category] = { stock: 0, value: 0 };
    }
    for (const variant of product.variants) {
      categories[product.category].stock += variant.stock;
      categories[product.category].value += variant.price * variant.stock;
    }
  }

  return {
    totalProducts,
    totalVariants,
    totalStock,
    lowStockCount,
    outOfStockCount,
    inventoryValue,
    categories,
  };
}

export async function bulkUpdateStock(
  updates: Array<{ productId: number; variantId: string; newStock: number }>
): Promise<InventoryTransaction[]> {
  const transactions: InventoryTransaction[] = [];

  for (const update of updates) {
    const transaction = await recordInventoryTransaction({
      productId: update.productId,
      variantId: update.variantId,
      type: "adjustment",
      quantity: update.newStock,
      reason: "Bulk stock update",
    });
    transactions.push(transaction);
  }

  return transactions;
}

export async function getProductInventory(productId: number): Promise<{
  product: Product;
  totalStock: number;
  variants: Array<{ variant: ProductVariant; stockValue: number }>;
}> {
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error("Product not found");

  const variants = product.variants.map(variant => ({
    variant,
    stockValue: variant.price * variant.stock,
  }));

  const totalStock = variants.reduce((sum, v) => sum + v.variant.stock, 0);

  return { product, totalStock, variants };
}
