'use client';
import { use } from 'react';
import { getOrderByNumber } from "@/lib/order-service";
import { dbToOrder } from "@/lib/order-mapper";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { useRestaurant } from '@/lib/context/restaurant-context';
import { formatPrice, formatDate } from '@/lib/utils-restaurant';
import { Order } from '@/lib/types';

interface OrderConfirmationPageProps {
  params: Promise<{ // Update this: params is a Promise
    orderNumber: string;
  }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  // Unwrap the promise here
  const { orderNumber } = use(params);
  
  const { getOrder } = useRestaurant();
  const [order, setOrder] = useState<Order | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  async function loadOrder() {
    try {
      const dbOrder = await getOrderByNumber(orderNumber);

      if (dbOrder) {
        setOrder(dbToOrder(dbOrder));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  loadOrder();
}, [orderNumber]); // Dependency is now the string value

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground font-semibold">Loading your order...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background">
          <section className="py-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-2xl font-semibold text-foreground mb-4">Order not found</p>
              <p className="text-muted-foreground mb-8">We couldn&apos;t find your order. Please check the order number.</p>
              <Link href="/menu" className="inline-block bg-primary text-card px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Back to Menu
              </Link>
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Success Header */}
        <section className="bg-gradient-to-b from-green-50 to-background py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">Your order has been received and is being prepared.</p>
          </div>
        </section>

        {/* Confirmation Content */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Order Number Card */}
            <div className="bg-primary text-card rounded-xl p-8 mb-6 text-center">
              <p className="text-sm opacity-90 mb-2">Your Order Number</p>
              <p className="text-4xl font-bold">{order.orderNumber}</p>
              <p className="text-sm opacity-90 mt-4">Save this number to track your order</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Estimated Time */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Estimated Time</h3>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">{order.estimatedPrepTime} mins</p>
                <p className="text-sm text-muted-foreground">
                  Order placed: {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Order Type */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Order Type</h3>
                </div>
                <p className="text-2xl font-bold text-primary mb-2 capitalize">
                  {order.customerInfo.orderType === 'dine_in' ? 'Dine In' : order.customerInfo.orderType}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="text-foreground font-semibold">{order.customerInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground font-semibold">{order.customerInfo.mobileNumber}</p>
                </div>
                {order.customerInfo.orderType === 'delivery' && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                    <p className="text-foreground font-semibold whitespace-pre-wrap">{order.customerInfo.address}</p>
                  </div>
                )}
                {order.customerInfo.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                    <p className="text-foreground font-semibold">{order.customerInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between pb-4 border-b border-border last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-foreground">{item.menuItem.name}</p>
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-foreground">{formatPrice(item.menuItem.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-muted rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Tax</span>
                <span className="font-semibold">{formatPrice(order.tax)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-foreground">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{formatPrice(order.deliveryFee)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
              <p className="text-lg font-bold text-foreground capitalize">{order.customerInfo.paymentMethod.toUpperCase()}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href={`/order-tracking/${order.orderNumber}`}
                className="block text-center bg-primary text-card py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Track Order
              </Link>
              <Link
                href="/menu"
                className="block text-center border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
