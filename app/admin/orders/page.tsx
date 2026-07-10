'use client';
import { useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle2, TrendingUp, ShoppingCart } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { OrderCard } from '@/components/dashboard/order-card';
import { useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/order-service";
import { dbToOrder } from "@/lib/order-mapper";
import { Order } from "@/lib/types";
import { formatPrice } from '@/lib/utils-restaurant';
import { OrderStatus } from '@/lib/types';

type FilterType = 'all' | 'new' | 'preparing' | 'ready' | 'completed';

function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Logout
    </button>
  );
}

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('new');
  const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [audioUnlocked, setAudioUnlocked] = useState(false);

const enableSound = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      setAudioUnlocked(true);
    } catch (e) {
      console.error(e);
    }
  };
const audioRef = useRef<HTMLAudioElement | null>(null);
const notifiedOrders = useRef(new Set<string>());

useEffect(() => {
  const audio = new Audio("/sounds/mixkit-urgent-simple-tone-loop-2976.wav");
  audio.preload = "auto";
  audioRef.current = audio;
}, []);



useEffect(() => {
  async function loadOrders() {
    try {
      const data = await getAllOrders();
      setOrders(data.map(dbToOrder));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadOrders();

  const channel = supabase
    .channel("orders")
   .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "orders",
  },
  async (payload) => {
  if (payload.eventType === "INSERT") {
    const orderNumber = payload.new.order_number;

    if (!notifiedOrders.current.has(orderNumber)) {
      notifiedOrders.current.add(orderNumber);

      audioRef.current?.play().catch(console.error);
    }
  }

  const data = await getAllOrders();
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
  // Filter orders
  const filteredOrders = useMemo(() => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (selectedFilter === 'all') return sorted;
    return sorted.filter((order) => order.status === selectedFilter);
  }, [orders, selectedFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const todayOrders = orders.filter(
      (order) =>
        new Date(order.createdAt).toDateString() === new Date().toDateString()
    );

    const pendingOrders = orders.filter((order) => order.status !== 'completed');
    const completedOrders = orders.filter((order) => order.status === 'completed');
    const todaysRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      todaysRevenue,
    };
  }, [orders]);

 const handleStatusUpdate = async (
  orderNumber: string,
  newStatus: OrderStatus
) => {
  // Update UI instantly
  setOrders((prev) =>
    prev.map((order) =>
      order.orderNumber === orderNumber
        ? { ...order, status: newStatus }
        : order
    )
  );

  try {
    await updateOrderStatus(orderNumber, newStatus);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <PageLayout showFooter={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-secondary text-card py-8 px-4 border-b border-border">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Restaurant Dashboard</h1>
              <p className="text-sm opacity-80 mt-1">Manage orders and track restaurant operations</p>
            </div>
            <div className="flex items-center gap-4">
  {!audioUnlocked && (
    <button
      onClick={enableSound}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      🔔 Enable Notification Sound
    </button>
  )}

  <Link href="/">Back to Site</Link>

  <LogoutButton />
</div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (

          <section className="py-20 px-4 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-lg text-muted-foreground">Loading orders...</p>
            </div>
          </section>
        )}

        {/* Statistics Section */}
      {!loading && (

          <>
            <section className="py-8 px-4 bg-card border-b border-border">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Today's Orders */}
                  <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Today&apos;s Orders</h3>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.todayOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">orders placed today</p>
                  </div>

                  {/* Pending Orders */}
                  <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Pending Orders</h3>
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.pendingOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">being processed</p>
                  </div>

                  {/* Completed Orders */}
                  <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Completed Orders</h3>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.completedOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">completed today</p>
                  </div>

                  {/* Today's Revenue */}
                  <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">Today&apos;s Revenue</h3>
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-primary">{formatPrice(stats.todaysRevenue)}</p>
                    <p className="text-xs text-muted-foreground mt-1">total revenue</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Orders Management Section */}
            <section className="py-8 px-4">
              <div className="max-w-7xl mx-auto">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-card rounded-lg p-2 border border-border w-fit">
                  {(['all', 'new', 'preparing', 'ready', 'completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                        selectedFilter === filter
                          ? 'bg-primary text-card'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {filter === 'all'
                        ? 'All Orders'
                        : filter === 'dine_in'
                          ? 'Dine In'
                          : filter.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-2xl font-semibold text-foreground mb-2">No orders found</p>
                    <p className="text-muted-foreground">
                      {selectedFilter === 'all'
                        ? 'No orders have been placed yet'
                        : `No ${selectedFilter} orders at the moment`}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onStatusUpdate={handleStatusUpdate}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  );
}