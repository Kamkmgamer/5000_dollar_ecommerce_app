import { getAnalytics, getDashboardStats } from "@/lib/analytics";

export default async function AnalyticsPage() {
  const [analytics, dashboardStats] = await Promise.all([
    getAnalytics(),
    getDashboardStats(),
  ]);

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{dashboardStats.todayViews}</div>
          <div className="stat-label">Today&apos;s Views</div>
          {dashboardStats.periodComparison.viewsChange !== 0 && (
            <div className={`stat-change ${dashboardStats.periodComparison.viewsChange > 0 ? "positive" : "negative"}`}>
              {dashboardStats.periodComparison.viewsChange > 0 ? "↑" : "↓"} {Math.abs(dashboardStats.periodComparison.viewsChange)}% vs yesterday
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardStats.todayOrders}</div>
          <div className="stat-label">Today&apos;s Orders</div>
          {dashboardStats.periodComparison.ordersChange !== 0 && (
            <div className={`stat-change ${dashboardStats.periodComparison.ordersChange > 0 ? "positive" : "negative"}`}>
              {dashboardStats.periodComparison.ordersChange > 0 ? "↑" : "↓"} {Math.abs(dashboardStats.periodComparison.ordersChange)}% vs yesterday
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-value">${dashboardStats.todayRevenue.toFixed(2)}</div>
          <div className="stat-label">Today&apos;s Revenue</div>
          {dashboardStats.periodComparison.revenueChange !== 0 && (
            <div className={`stat-change ${dashboardStats.periodComparison.revenueChange > 0 ? "positive" : "negative"}`}>
              {dashboardStats.periodComparison.revenueChange > 0 ? "↑" : "↓"} {Math.abs(dashboardStats.periodComparison.revenueChange)}% vs yesterday
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-value">{dashboardStats.conversionRate}%</div>
          <div className="stat-label">Conversion Rate</div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Events by Type</h3>
          <div className="chart-placeholder">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", padding: "1rem" }}>
              {Object.entries(analytics.eventsByType).map(([type, count]) => (
                <div key={type} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ textTransform: "capitalize" }}>{type.replace(/_/g, " ")}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Daily Metrics</h3>
          <div className="chart-placeholder">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", padding: "1rem", maxHeight: "180px", overflow: "auto" }}>
              {analytics.dailyMetrics.slice(0, 7).map((day) => (
                <div key={day.date} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                  <span>{day.date}</span>
                  <span>
                    {day.pageViews} views · {day.checkoutsCompleted} orders · ${day.revenue.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Top Products</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {dashboardStats.topProducts.length > 0 ? (
              dashboardStats.topProducts.map((product) => (
                <div key={product.productId} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{product.productName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {product.views} views · {product.addToCarts} add to carts
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600 }}>${product.revenue.toFixed(2)}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {product.conversionRate}% conv
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
                No product data yet. Data will appear as customers browse products.
              </p>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>Recent Events</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflow: "auto" }}>
            {analytics.recentEvents.length > 0 ? (
              analytics.recentEvents.slice(0, 15).map((event) => (
                <div key={event.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderBottom: "1px solid var(--border-light)" }}>
                  <span style={{ textTransform: "capitalize" }}>{event.type.replace(/_/g, " ")}</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
                No events tracked yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Performance Metrics</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
          Total events tracked: {analytics.totalEvents} · 
          Redis caching enabled for optimized queries · 
          Expected page load: 0.3-0.8s
        </p>
      </div>
    </div>
  );
}
