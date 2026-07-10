
'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { formatPrice, formatDate } from '@/lib/utils-restaurant';
import { Order, OrderStatus } from '@/lib/types';
import { supabase } from "@/lib/supabase";
import { getOrderByNumber } from "@/lib/order-service";
import { dbToOrder } from "@/lib/order-mapper";

interface OrderTrackingPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    async function loadOrder() {
      try {
        const data = await getOrderByNumber(orderNumber);
        if (data) setOrder(dbToOrder(data));
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`order-${orderNumber}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `order_number=eq.${orderNumber}`,
        },
        async (payload) => {
          const data = await getOrderByNumber(orderNumber);
          setOrder(dbToOrder(data));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderNumber]);

  if (!isHydrated || loading) return null;

  if (!order) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background">
          <section className="py-20 px-4">
            <div className="max-w-2xl mx-auto">
              <Link href="/orders" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
                <ArrowLeft className="w-5 h-5" /> Back to Orders
              </Link>
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground mb-4">Order not found</p>
                <p className="text-muted-foreground mb-8">We couldn&apos;t find your order. Please check the order number.</p>
              </div>
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  const statusSteps: OrderStatus[] = ['new', 'preparing', 'ready', 'completed'];
  const currentStatusIndex = statusSteps.indexOf(order.status);

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <section className="bg-primary text-card py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/orders" className="flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity">
              <ArrowLeft className="w-5 h-5" /> Back to Orders
            </Link>
            <div>
              <p className="text-sm opacity-90 mb-2">Order Number</p>
              <h1 className="text-4xl md:text-5xl font-bold">{order.orderNumber}</h1>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl border border-border p-8 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-8">Order Status</h2>
              <div className="relative space-y-6">
                {statusSteps.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const statusMessages = {
                    new: 'Order received and confirmed',
                    preparing: 'Your order is being prepared',
                    ready: 'Ready for pickup/delivery',
                    completed: 'Order completed',
                  };

                  return (
                    <div key={status} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${isCompleted ? 'bg-primary' : 'bg-muted border-2 border-border text-foreground'}`}>
                          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                        </div>
                        {index !== statusSteps.length - 1 && (
                          <div className={`w-1 h-12 mt-2 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className={`text-lg font-bold capitalize ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {status === 'dine_in' ? 'Dine In' : status.replace('_', ' ')}
                        </h3>
                        <p className={isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'}>{statusMessages[status]}</p>
                        {isCurrent && (
                          <div className="mt-2 flex items-center gap-2 text-primary">
                            <Clock className="w-4 h-4" /> <span className="text-sm font-medium">Currently processing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Timing</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Placed</p>
                    <p className="text-foreground font-semibold">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Ready Time</p>
                    <p className="text-foreground font-semibold">
                      {new Date(new Date(order.createdAt).getTime() + order.estimatedPrepTime * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="text-foreground font-semibold">{order.customerInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="text-foreground font-semibold">{order.customerInfo.mobileNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/menu" className="flex-1 text-center bg-primary text-card py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">Order Again</Link>
              <Link href="/orders" className="flex-1 text-center border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">View All Orders</Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}