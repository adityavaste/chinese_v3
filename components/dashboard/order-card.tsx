'use client';

import { ChevronDown } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate, getStatusLabel, getNextOrderStatus } from '@/lib/utils-restaurant';
import { useState } from 'react';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderNumber: string, newStatus: OrderStatus) => void;
}

export const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const getNextStatus = (): OrderStatus | null => {
    if (order.status === 'completed') return null;
    return getNextOrderStatus(order.status);
  };

  const nextStatus = getNextStatus();

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg md:text-xl font-bold text-foreground">{order.orderNumber}</h3>
            <span className={`text-xs md:text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Quick Info Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 pb-4 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Customer</p>
          <p className="font-semibold text-foreground text-sm">{order.customerInfo.fullName}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Phone</p>
          <p className="font-semibold text-foreground text-sm">{order.customerInfo.mobileNumber}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Items</p>
          <p className="font-semibold text-foreground text-sm">{order.items.length}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="font-bold text-primary text-sm">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 mb-4 pb-4 border-b border-border animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Order Type and Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order Type</p>
              <p className="font-semibold text-foreground capitalize">
                {order.customerInfo.orderType === 'dine_in' ? 'Dine In' : order.customerInfo.orderType}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Payment</p>
              <p className="font-semibold text-foreground capitalize">{order.customerInfo.paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          {/* Address */}
          {order.customerInfo.orderType === 'delivery' && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
              <p className="font-semibold text-foreground text-sm whitespace-pre-wrap">
                {order.customerInfo.address}
              </p>
            </div>
          )}

          {/* Special Instructions */}
          {order.customerInfo.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Special Instructions</p>
              <p className="font-semibold text-foreground text-sm">{order.customerInfo.notes}</p>
            </div>
          )}

          {/* Items List */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Items</p>
            <div className="space-y-1 bg-muted rounded-lg p-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-foreground">
                  <span>
                    {item.menuItem.name} <span className="text-muted-foreground">×{item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.menuItem.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between text-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-foreground">
                <span>Delivery</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div className="border-t border-border pt-1 mt-1 flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {nextStatus && (
        <button
          onClick={() => onStatusUpdate(order.orderNumber, nextStatus)}
          className="w-full bg-primary text-card py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 capitalize"
        >
          Mark as {nextStatus.replace('_', ' ')}
        </button>
      )}

      {order.status === 'completed' && (
        <div className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-semibold text-center">
          ✓ Order Completed
        </div>
      )}
    </div>
  );
};
