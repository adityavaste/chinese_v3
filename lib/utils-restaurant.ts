import { CartItem, Order, OrderStatus } from './types';
import { TAX_RATE, DELIVERY_FEE, TAKEAWAY_FEE, DINE_IN_FEE, ESTIMATION_TIME } from './mock-data';

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number): number => {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
};

export const getDeliveryFee = (orderType: 'delivery' | 'takeaway' | 'dine_in'): number => {
  switch (orderType) {
    case 'delivery':
      return DELIVERY_FEE;
    case 'takeaway':
      return TAKEAWAY_FEE;
    case 'dine_in':
      return DINE_IN_FEE;
  }
};

export const calculateTotal = (subtotal: number, tax: number, deliveryFee: number): number => {
  return Math.round((subtotal + tax + deliveryFee) * 100) / 100;
};

export const getEstimatedTime = (orderType: 'delivery' | 'takeaway' | 'dine_in'): number => {
  return ESTIMATION_TIME[orderType];
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const getSpiceLevelLabel = (level: string): string => {
  const labels: { [key: string]: string } = {
    mild: 'Mild',
    medium: 'Medium',
    hot: 'Hot',
    very_hot: 'Very Hot',
  };
  return labels[level] || level;
};

export const getVegTypeLabel = (type: string): string => {
  return type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian';
};

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: { [key in OrderStatus]: string } = {
    new: 'New Order',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: { [key in OrderStatus]: string } = {
    new: 'bg-blue-100 text-blue-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
  };
  return colors[status];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getNextOrderStatus = (status: OrderStatus): OrderStatus => {
  const progression: { [key in OrderStatus]: OrderStatus } = {
    new: 'preparing',
    preparing: 'ready',
    ready: 'completed',
    completed: 'completed',
  };
  return progression[status];
};

export const isOrderInProgress = (status: OrderStatus): boolean => {
  return status !== 'completed';
};

export const validatePhoneNumber = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 10;
};

export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2;
};
