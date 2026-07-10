export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'very_hot';
export type VegType = 'veg' | 'non_veg';
export type OrderType = 'dine_in' | 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'card' | 'upi';
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spiceLevel: SpiceLevel;
  vegType: VegType;
  servings?: number;
  preparationTime?: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export interface CustomerInfo {
  fullName: string;
  mobileNumber: string;
  address: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedPrepTime: number;
  completedAt?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  message: string;
}
