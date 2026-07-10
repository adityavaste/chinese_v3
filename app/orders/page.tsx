'use client';
import { supabase } from "@/lib/supabase";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { useRestaurant } from '@/lib/context/restaurant-context';
import { formatPrice, formatDate, getStatusLabel } from '@/lib/utils-restaurant';
import { useEffect, useState } from "react";
import { getGuestDeviceId } from "@/lib/guest";
import { getGuestByDeviceId } from "@/lib/guest-service";
import { getOrdersByGuest } from "@/lib/order-service";
import { dbToOrder } from "@/lib/order-mapper";
import { Order } from "@/lib/types";



export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
  useEffect(() => {
  async function loadOrders() {
    try {
      const deviceId = getGuestDeviceId();

      const guest = await getGuestByDeviceId(deviceId);

      const data = await getOrdersByGuest(guest.id);

      setOrders(data.map(dbToOrder));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadOrders();
 const channel = supabase
  .channel("guest-orders")
  .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "orders",
  },
  async (payload) => {
    console.log("Realtime Event:", payload);

    const deviceId = getGuestDeviceId();
    const guest = await getGuestByDeviceId(deviceId);

    const data = await getOrdersByGuest(guest.id);

    console.log("Fetched Orders:", data);

    setOrders(data.map(dbToOrder));
  }
)
  .subscribe((status) => {
    console.log("Realtime Status:", status);
  });

return () => {
  supabase.removeChannel(channel);
};
}, []);
   
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-card py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">Your Orders</h1>
            <p className="text-lg opacity-90 mt-2">View and track your orders</p>
          </div>
        </section>

        {/* Orders Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-3xl font-bold text-foreground mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-8">You haven&apos;t placed any orders yet</p>
                <Link
                  href="/menu"
                  className="inline-block bg-primary text-card px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Start Ordering
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/order-tracking/${order.orderNumber}`}
                    className="block bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{order.orderNumber}</h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(order.status)}`}
                          >
                            {getStatusLabel(order.status as any)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{order.customerInfo.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Total and Action */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
