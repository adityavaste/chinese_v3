'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { useRestaurant } from '@/lib/context/restaurant-context';
import { formatPrice, getVegTypeLabel } from '@/lib/utils-restaurant';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, currentOrderType, setCurrentOrderType } =
    useRestaurant();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dine_in'>(currentOrderType);

  const handleOrderTypeChange = (type: 'delivery' | 'takeaway' | 'dine_in') => {
    setOrderType(type);
    setCurrentOrderType(type);
  };

  if (cart.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <section className="bg-primary text-card py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
              <p className="text-lg opacity-90 mt-2">Review and modify your order</p>
            </div>
          </section>

          {/* Empty State */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Start adding delicious dishes to your order</p>
              <Link
                href="/menu"
                className="inline-block bg-primary text-card px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
              >
                Browse Menu
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
        {/* Header */}
        <section className="bg-primary text-card py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
            <p className="text-lg opacity-90 mt-2">Review and modify your order</p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  {cart.map((cartItem, index) => (
                    <div
                      key={cartItem.id}
                      className={`p-4 md:p-6 flex gap-4 ${index !== cart.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      {/* Image Placeholder */}
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground mb-1">{cartItem.menuItem.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{cartItem.menuItem.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2 py-1 rounded bg-muted text-foreground">
                            {getVegTypeLabel(cartItem.menuItem.vegType)}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(cartItem.menuItem.price * cartItem.quantity)}
                        </div>
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeFromCart(cartItem.menuItem.id)}
                          className="p-2 text-destructive hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center bg-muted rounded-lg p-1">
                          <button
                            onClick={() => updateCartItemQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                            className="p-1 hover:bg-background rounded transition-colors"
                          >
                            <Minus className="w-4 h-4 text-foreground" />
                          </button>
                          <span className="px-3 py-1 font-semibold text-foreground min-w-[2rem] text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                            className="p-1 hover:bg-background rounded transition-colors"
                          >
                            <Plus className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                  {/* Order Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-3">Order Type</label>
                    <div className="space-y-2">
                      {(['delivery', 'takeaway', 'dine_in'] as const).map((type) => (
                        <label key={type} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                          <input
                            type="radio"
                            name="orderType"
                            value={type}
                            checked={orderType === type}
                            onChange={() => handleOrderTypeChange(type)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="ml-3 capitalize font-medium text-foreground">
                            {type === 'dine_in' ? 'Dine In' : type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(cartTotal.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Tax ({(8).toFixed(0)}%)</span>
                      <span className="font-semibold">{formatPrice(cartTotal.tax)}</span>
                    </div>
                    {cartTotal.deliveryFee > 0 && (
                      <div className="flex justify-between text-foreground">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">{formatPrice(cartTotal.deliveryFee)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6 text-xl">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary text-2xl">{formatPrice(cartTotal.total)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full block text-center bg-primary text-card py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/menu"
                    className="w-full block text-center mt-3 border border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
