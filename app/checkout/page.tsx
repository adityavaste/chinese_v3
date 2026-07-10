'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/page-layout';
import { useRestaurant } from '@/lib/context/restaurant-context';
import { formatPrice, validateFullName, validatePhoneNumber, validateAddress } from '@/lib/utils-restaurant';
import { CustomerInfo, OrderType, PaymentMethod } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, currentOrderType, createOrder } = useRestaurant();

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    mobileNumber: '',
    address: '',
    orderType: currentOrderType,
    paymentMethod: 'cash',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background">
          <section className="bg-primary text-card py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
            </div>
          </section>
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-2xl font-semibold text-foreground mb-4">Your cart is empty</p>
              <Link href="/menu" className="inline-block bg-primary text-card px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Back to Menu
              </Link>
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!validateFullName(formData.fullName)) {
      newErrors.fullName = 'Please enter a valid name';
    }

    if (!validatePhoneNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!validateAddress(formData.address)) {
      newErrors.address = 'Please enter a complete address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder(formData);

console.log("Returned Order:", order);

router.push(`/order-confirmation/${order.orderNumber}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-card py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
            <p className="text-lg opacity-90 mt-2">Complete your order</p>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  {/* Customer Information */}
                  <div className="bg-card rounded-xl border border-border p-6 mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Customer Information</h2>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.fullName ? 'border-red-500' : 'border-border'
                          }`}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Mobile Number *</label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="555-0123"
                          className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.mobileNumber ? 'border-red-500' : 'border-border'
                          }`}
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Address *</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main Street, Apt 4B, City, State 12345"
                          rows={3}
                          className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                            errors.address ? 'border-red-500' : 'border-border'
                          }`}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Special Instructions</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any special requests or allergies..."
                          rows={2}
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Type and Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Order Type */}
                    <div className="bg-card rounded-xl border border-border p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">Order Type</h3>
                      <div className="space-y-3">
                        {(['delivery', 'takeaway', 'dine_in'] as const).map((type) => (
                          <label key={type} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                            <input
                              type="radio"
                              name="orderType"
                              value={type}
                              checked={formData.orderType === type}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="ml-3 capitalize font-medium text-foreground">
                              {type === 'dine_in' ? 'Dine In' : type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-card rounded-xl border border-border p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">Payment Method</h3>
                      <div className="space-y-3">
                        {(['cash', 'card', 'upi'] as const).map((method) => (
                          <label key={method} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method}
                              checked={formData.paymentMethod === method}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="ml-3 capitalize font-medium text-foreground">{method.toUpperCase()}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors.submit && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{errors.submit}</div>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-card py-4 rounded-lg font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order - ${formatPrice(cartTotal.total)}`}
                  </button>
                </form>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

                  {/* Items List */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-foreground">
                        <span>
                          {item.menuItem.name} <span className="text-muted-foreground">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold">{formatPrice(item.menuItem.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm text-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(cartTotal.tax)}</span>
                    </div>
                    {cartTotal.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>{formatPrice(cartTotal.deliveryFee)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border mt-4 pt-4 flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary text-xl">{formatPrice(cartTotal.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
