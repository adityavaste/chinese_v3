'use client';

import { getGuestDeviceId } from "@/lib/guest";
import { registerGuest, getGuestByDeviceId } from "@/lib/guest-service";
import { createOrder as createOrderInDb } from "@/lib/order-service";
import { orderToDb } from "@/lib/order-mapper";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, MenuItem, Order, CustomerInfo } from '../types';
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  getDeliveryFee,
  generateOrderNumber,
  getEstimatedTime,
} from '../utils-restaurant';

interface RestaurantContextType {
  // Cart & State
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
  };
  setCurrentOrderType: (type: 'delivery' | 'takeaway' | 'dine_in') => void;
  currentOrderType: 'delivery' | 'takeaway' | 'dine_in';
  isHydrated: boolean;

  // Actions
  createOrder: (customerInfo: CustomerInfo) => Promise<Order>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [currentOrderType, setCurrentOrderType] = useState<'delivery' | 'takeaway' | 'dine_in'>('delivery');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        const deviceId = getGuestDeviceId();
        await registerGuest(deviceId);
        const guest = await getGuestByDeviceId(deviceId);
        
        setGuestId(guest.id);
        setIsHydrated(true);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    }

    initializeApp();
  }, []);

  const calculateCartTotal = () => {
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const deliveryFee = getDeliveryFee(currentOrderType);
    const total = calculateTotal(subtotal, tax, deliveryFee);

    return { subtotal, tax, deliveryFee, total };
  };

  const addToCart = (item: MenuItem, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.menuItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.menuItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { id: item.id, menuItem: item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuItem.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = async (customerInfo: CustomerInfo): Promise<Order> => {
    if (!guestId) throw new Error("Guest not initialized");

    const cartTotal = calculateCartTotal();

    const order: Order = {
      id: "",
      orderNumber: generateOrderNumber(),
      customerInfo,
      items: cart,
      subtotal: cartTotal.subtotal,
      tax: cartTotal.tax,
      deliveryFee: cartTotal.deliveryFee,
      total: cartTotal.total,
      status: "new",
      createdAt: new Date().toISOString(),
      estimatedPrepTime: getEstimatedTime(customerInfo.orderType),
    };

    const dbOrder = orderToDb(order, guestId);
    const savedOrder = await createOrderInDb(dbOrder);

    order.id = savedOrder.id;

    clearCart();

    return order;
  };

  const value: RestaurantContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal: calculateCartTotal(),
    setCurrentOrderType,
    currentOrderType,
    createOrder,
    isHydrated,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};