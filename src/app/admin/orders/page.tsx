"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { CartItem } from "@/lib/types";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  location: string;
  cart_items: CartItem[];
  total: number;
  status: string;
  created_at: string;
};

type ProductSales = {
  name: string;
  totalSold: number;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const supabase = supabaseBrowser();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    const ordersData = (data || []) as Order[];
    setOrders(ordersData);
    calculateProductSales(ordersData);
    setLoading(false);
  }

  function calculateProductSales(ordersData: Order[]) {
    const salesMap = new Map<string, number>();

    for (const order of ordersData) {
      for (const item of order.cart_items) {
        const key = item.variant ? `${item.name} (${item.variant})` : item.name;
        salesMap.set(key, (salesMap.get(key) || 0) + item.quantity);
      }
    }

    const salesArray = Array.from(salesMap.entries())
      .map(([name, totalSold]) => ({ name, totalSold }))
      .sort((a, b) => b.totalSold - a.totalSold);

    setProductSales(salesArray);
  }

  async function toggleOrderStatus(orderId: string, currentStatus: string) {
    const supabase = supabaseBrowser();
    if (!supabase) return;

    setUpdatingOrder(orderId);
    const newStatus = currentStatus === "fulfilled" ? "pending" : "fulfilled";

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingOrder(null);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg
          className="animate-spin text-slate-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </div>
    );
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const fulfilledCount = orders.filter((o) => o.status === "fulfilled").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Orders</h1>
        <p className="text-sm text-slate-600">
          View all orders and mark them as fulfilled.
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="card flex-1 min-w-[140px]">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Orders</p>
          <p className="text-2xl font-semibold">{orders.length}</p>
        </div>
        <div className="card flex-1 min-w-[140px]">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-semibold text-amber-600">{pendingCount}</p>
        </div>
        <div className="card flex-1 min-w-[140px]">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Fulfilled</p>
          <p className="text-2xl font-semibold text-brand">{fulfilledCount}</p>
        </div>
      </div>

      {/* Product Analytics */}
      <div className="card">
        <h2 className="font-display text-lg mb-4">Product Performance</h2>
        {productSales.length === 0 ? (
          <p className="text-sm text-slate-500">No sales data yet.</p>
        ) : (
          <div className="space-y-2">
            {productSales.slice(0, 10).map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 w-5">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium">{product.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{product.totalSold} sold</span>
                  {index === 0 && (
                    <span className="badge-in text-xs">Top Seller</span>
                  )}
                  {index >= productSales.length - 2 && productSales.length > 3 && (
                    <span className="badge-oos text-xs">Slow</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="card">
        <h2 className="font-display text-lg mb-4">All Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id
                    )
                  }
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrderStatus(order.id, order.status);
                    }}
                    disabled={updatingOrder === order.id}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                      order.status === "fulfilled"
                        ? "bg-brand border-brand"
                        : "border-slate-300 hover:border-brand"
                    }`}
                    title={order.status === "fulfilled" ? "Mark as pending" : "Mark as fulfilled"}
                  >
                    {updatingOrder === order.id ? (
                      <svg
                        className="animate-spin w-3 h-3 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M12 2v4M12 18v4" />
                      </svg>
                    ) : order.status === "fulfilled" ? (
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </button>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{order.phone}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={
                      order.status === "fulfilled" ? "badge-in" : "badge-oos"
                    }
                  >
                    {order.status === "fulfilled" ? "Fulfilled" : "Pending"}
                  </span>

                  {/* Total */}
                  <span className="font-semibold text-sm">
                    KES {order.total.toLocaleString()}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-slate-500 hidden sm:block">
                    {formatDate(order.created_at)}
                  </span>

                  {/* Expand Icon */}
                  <svg
                    className={`w-4 h-4 text-slate-400 transition ${
                      expandedOrder === order.id ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="text-sm">
                      <span className="text-slate-500">Location:</span>{" "}
                      <span className="font-medium">{order.location}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Date:</span>{" "}
                      <span className="font-medium">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Items:</p>
                      <ul className="space-y-1">
                        {order.cart_items.map((item, i) => (
                          <li
                            key={`${item.product_id}-${i}`}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name}
                              {item.variant && (
                                <span className="text-slate-500">
                                  {" "}
                                  ({item.variant})
                                </span>
                              )}
                              <span className="text-slate-400">
                                {" "}
                                x{item.quantity}
                              </span>
                            </span>
                            <span className="font-medium">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
